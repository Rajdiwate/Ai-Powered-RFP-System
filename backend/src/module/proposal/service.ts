import { ProposalRepo, proposalRepo } from './repository';
import { vendorRepo } from '@module/vendor';
import { ParsedMail } from 'mailparser';

import { sendPrompt } from '@util/send-prompt';

class ProposalService {
  constructor(private readonly repo: ProposalRepo) {}

  async processVendorReply(parsed: ParsedMail) {
    return this.repo.processVendorReply(parsed, vendorRepo);
  }

  async evaluateProposals(rfpId: string) {
    const proposals = await this.repo.getByRfpId(rfpId);

    if (!proposals.length) {
      return {
        analysis: 'No proposals found for this RFP.',
        recommendation: null,
      };
    }

    const proposalsWithVendor = await Promise.all(
      proposals.map(async (p) => {
        const vendor = await vendorRepo.getById(p.vendorId);
        return {
          vendorName: vendor?.name || 'Unknown',
          totalCost: p.totalCost,
          details: p.details,
        };
      })
    );

    const prompt = `
      You are an expert procurement consultant.
      Evaluate the following vendor proposals for an RFP.

      Proposals:
      ${JSON.stringify(proposalsWithVendor, null, 2)}

      Tasks:
      1. Compare them based on pricing, terms, and completeness.
      2. Provide a score (0-100) for each vendor.
      3. Recommend: "Which vendor should I go with, and why?".

      Output Format: JSON
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        comparison: { type: 'STRING', description: 'Detailed comparison text' },
        scores: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              vendorName: { type: 'STRING' },
              score: { type: 'INTEGER' },
              reason: { type: 'STRING' },
            },
          },
        },
        recommendation: { type: 'STRING', description: 'Final recommendation' },
      },
      required: ['comparison', 'scores', 'recommendation'],
    };

    const aiRes = await sendPrompt(prompt, schema);
    return aiRes;
  }
}

const proposalService = new ProposalService(proposalRepo);

export { ProposalService, proposalService };

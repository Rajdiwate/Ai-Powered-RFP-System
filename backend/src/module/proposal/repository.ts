import { BaseRepository } from '@core/base-repository';
import { db } from '@db/index';
import { ProposalTable } from '@db/schema';
import { ParsedMail } from 'mailparser';
import { sendPrompt } from '@util/send-prompt';
import { eq } from 'drizzle-orm';

class ProposalRepo extends BaseRepository<typeof ProposalTable> {
  constructor() {
    super(db, ProposalTable);
  }

  async processVendorReply(parsed: ParsedMail, vendorRepo: any) {
    const emailBody = parsed.text || parsed.html || '';
    const subject = parsed.subject || '';
    const fromEmail = parsed.from?.value[0]?.address;

    if (!fromEmail) {
      console.error('❌ Could not identify sender email.');
      return;
    }

    // 1. Identify Vendor from Email
    const vendor = await vendorRepo.getByEmail(fromEmail);
    if (!vendor) {
      console.error(`❌ Vendor not found for email: ${fromEmail}`);
      return;
    }

    console.log(`✅ Identified Vendor: ${vendor.name} (${vendor.id})`);

    // 2. Extract Proposal Details using AI
    const prompt = `
      Analyze the following email from a vendor.
      It is a reply to a Request for Proposal (RFP).
      Extract the total cost and key details of their proposal.

      Email Subject: "${subject}"
      Email Body: "${emailBody}"

      If the email is not a proposal, set 'isProposal' to false.
      The 'totalCost' should be a numeric string (e.g. "5000").
      The 'details' should be a JSON object containing extracted points like timeline, approach, inclusions, exclusions, etc.
      The 'rfpId' should be extracted from the subject or body. It allows looking for "Ref: <UUID>" or "RFP Notification [Ref: <UUID>]". If found, return the UUID.
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        isProposal: { type: 'BOOLEAN' },
        totalCost: { type: 'STRING' },
        details: { type: 'OBJECT', description: 'Structured details of the proposal' },
        rfpId: { type: 'STRING', nullable: true },
      },
      required: ['isProposal', 'totalCost', 'details'],
    };

    try {
      const aiRes = await sendPrompt(prompt, schema);

      if (!aiRes.isProposal) {
        console.log('ℹ️ Email does not appear to be a proposal.');
        return;
      }

      console.log('🤖 AI Extracted Proposal:', aiRes);

      if (!aiRes.rfpId) {
        console.warn('⚠️ Could not extract RFP ID from email content. Proposal creation skipped.');
        return;
      }

      // 3. Save Proposal
      await this.create({
        vendorId: vendor.id,
        rfpId: aiRes.rfpId,
        totalCost: aiRes.totalCost,
        details: aiRes.details,
      });

      console.log(`🎉 Proposal created for Vendor ${vendor.name} on RFP ${aiRes.rfpId}`);
    } catch (error) {
      console.error('❌ Error processing vendor reply:', error);
    }
  }

  async getByRfpId(rfpId: string) {
    return this.ctx().select().from(ProposalTable).where(eq(ProposalTable.rfpId, rfpId));
  }
}

const proposalRepo = new ProposalRepo();

export { ProposalRepo, proposalRepo };

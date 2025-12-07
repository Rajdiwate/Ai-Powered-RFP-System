import { ProposalService, proposalService } from './service';
import { Request, Response } from 'express';

class ProposalController {
  constructor(private readonly service: ProposalService) {}

  evaluateProposals = async (req: Request, res: Response) => {
    const { rfpId } = req.params;
    const result = await this.service.evaluateProposals(rfpId);
    res.ok('Proposals evaluated successfully', result);
  };
}

const proposalController = new ProposalController(proposalService);

export { ProposalController, proposalController };

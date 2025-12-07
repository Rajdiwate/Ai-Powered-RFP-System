import { Router } from 'express';
import { proposalController } from './controller';

const proposalRouter = Router();

proposalRouter.get('/:rfpId/evaluate', proposalController.evaluateProposals);

export { proposalRouter };

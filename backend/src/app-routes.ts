import { rfpRouter } from '@module/rfp';
import { rfpCategoryRouter } from '@module/rfp-category';
import { vendorRouter } from '@module/vendor';
import { proposalRouter } from '@module/proposal';
import { Router } from 'express';

const appRoutes = Router();

appRoutes.use('/rfp', rfpRouter);
appRoutes.use('/rfp-category', rfpCategoryRouter);
appRoutes.use('/vendor', vendorRouter);
appRoutes.use('/proposal', proposalRouter);

export { appRoutes };

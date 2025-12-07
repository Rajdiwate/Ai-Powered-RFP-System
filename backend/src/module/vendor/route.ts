import { Router } from 'express';

import { vendorController } from './controller';
import { validate } from '@middleware/validate.middleware';
import { createVendorSchema, paginationSchema, notifyVendorSchema } from './schema';

const vendorRouter = Router();

vendorRouter.post('/', validate(createVendorSchema, 'body'), vendorController.create);
vendorRouter.get('/', validate(paginationSchema, 'query'), vendorController.getAll);
vendorRouter.post('/notify', validate(notifyVendorSchema, 'body'), vendorController.notifyVendor);

export { vendorRouter };

import { Router } from 'express';

import { rfpCategoryController } from './controller';
import { validate } from '@middleware/validate.middleware';
import { createRfpCategorySchema } from './schema';

const rfpCategoryRouter = Router();

rfpCategoryRouter.post(
  '/',
  validate(createRfpCategorySchema, 'body'),
  rfpCategoryController.create
);
rfpCategoryRouter.get('/', rfpCategoryController.getAll);

export { rfpCategoryRouter };

import { Router } from 'express';

import { rfpController } from './controller';
import { validate } from '@middleware/validate.middleware';
import { generateRfpSchema } from './schema';

const rfpRouter = Router();

rfpRouter.post('/', validate(generateRfpSchema , 'body'), rfpController.generateRfp);

export { rfpRouter };

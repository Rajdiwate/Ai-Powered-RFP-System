import { NextFunction, Request, Response } from 'express';

import { AppError } from '@core/app-error';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(AppError.NotFoundError('Route Not Found!'));
};

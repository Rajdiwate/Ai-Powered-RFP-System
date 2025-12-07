import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';
import { AppError } from '../core/app-error';

export const validate =
  (schema: ZodType , type : 'body' | 'params' | 'query') => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        next(AppError.BadRequestError(errorMessages, 'Validation failed'));
      } else {
        next(error);
      }
    }
  };

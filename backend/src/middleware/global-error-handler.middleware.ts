import { NextFunction, Request, Response } from 'express';

import { AppError, ApplicationError, instanceOfApplicationError } from '@core/app-error';

interface ErrorResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: unknown;
}

const sendErrorResponse = (err: Error, res: Response) => {
  let error: ApplicationError = AppError.InternalServerError('Internal Server Error');
  if (instanceOfApplicationError(err)) {
    error = err;
  }
  const statusCode = error.ErrorCode;
  const message = error.ErrorResponse.error;
  const success = false;
  const data = error.ErrorResponse.data;

  const responseData: ErrorResponse = { statusCode, message, success, data };

  return res.status(statusCode).json(responseData);
};

export const globalErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error('Responding to API call with error.', err);
  sendErrorResponse(err, res);
};

export const processUnhandledError = async (req: Request, res: Response, next: NextFunction) => {
  // this is catching exception which not caught by globalErrorHandler
  process
    .once('unhandledRejection', (err: Error, promise) => {
      console.error('Promise unhandled rejection.', err, promise);
      return sendErrorResponse(err, res);
    })
    .once('uncaughtException', (err) => {
      console.error('Uncaught exception. Exiting the process.', err);
      process.exit(1);
    });
  next();
};

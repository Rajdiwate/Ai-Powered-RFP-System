import { NextFunction, Request, Response } from 'express';

type SuccessResponse<T> = {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
};

export const apiResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.ok = function <T>(msg: string, data: T) {
    const body: SuccessResponse<T> = {
      statusCode: 200,
      message: msg,
      success: true,
      data,
    };
    this.status(200).json(body);
  };

  res.created = function <T>(msg: string, data: T) {
    const body: SuccessResponse<T> = {
      statusCode: 201,
      message: msg,
      success: true,
      data,
    };
    this.status(201).json(body);
  };

  next();
};

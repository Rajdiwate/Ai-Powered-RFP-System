interface ErrorResponse {
  error: string;
  data: unknown;
}

export interface ApplicationError extends Error {
  ErrorCode: number;
  ErrorResponse: ErrorResponse;
}

export const instanceOfApplicationError = (err: Error): err is ApplicationError => {
  return 'ErrorCode' in err && 'ErrorResponse' in err;
};

class ErrorType {
  _errorCode: number;
  _error: string;
  constructor(errorCode: number, error: string) {
    this._errorCode = errorCode;
    this._error = error;
  }

  newError = (data: unknown, error: string = ''): ApplicationError => {
    error = error || this._error;
    return {
      ErrorCode: this._errorCode,
      ErrorResponse: { error, data },
    } as ApplicationError;
  };
}

const badRequestErrorType: ErrorType = new ErrorType(400, 'Bad Request');
const unauthorizedErrorType: ErrorType = new ErrorType(401, 'Unauthorized');
const forbiddenErrorType: ErrorType = new ErrorType(403, 'Forbidden');
const notFoundErrorType: ErrorType = new ErrorType(404, 'Not Found');
const conflictErrorType: ErrorType = new ErrorType(409, 'Conflict');
const unprocessableEntityErrorType: ErrorType = new ErrorType(422, 'Unprocessable Entity');
const toManyRequestErrorType: ErrorType = new ErrorType(429, 'Too Many Requests');
const internalServerErrorType: ErrorType = new ErrorType(500, 'Internal Server Error');
const badGatewayErrorType: ErrorType = new ErrorType(502, 'Bad Gateway');
const goneErrorType: ErrorType = new ErrorType(410, 'Gone');

export const AppError = {
  BadRequestError: badRequestErrorType.newError,
  UnauthorizedError: unauthorizedErrorType.newError,
  ForbiddenError: forbiddenErrorType.newError,
  NotFoundError: notFoundErrorType.newError,
  ConflictError: conflictErrorType.newError,
  unprocessableEntityError: unprocessableEntityErrorType.newError,
  TooManyRequestError: toManyRequestErrorType.newError,
  InternalServerError: internalServerErrorType.newError,
  BadGatewayError: badGatewayErrorType.newError,
  GoneError: goneErrorType.newError,
};

import { NextFunction } from 'express';
import { HTTP_STATUS } from './http-status';

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      statusCode >= HTTP_STATUS.BAD_REQUEST &&
      statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? 'fail'
        : 'error';
    this.success = false;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const customError = (
  message: string,
  statusCode: number,
  next: NextFunction
) => {
  next(new AppError(message, statusCode));
};

export default AppError;

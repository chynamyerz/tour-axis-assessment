import { NextFunction, Request, Response } from 'express';
import AppError from './app-error';
import { HTTP_STATUS } from './http-status';

const devErrors = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res: Response, error: AppError) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong! Please try again later.',
    });
  }
};

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    prodErrors(res, error);
  }
};

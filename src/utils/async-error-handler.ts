import { Response, NextFunction } from 'express';
import { Query } from 'express-serve-static-core';
import AppError from './app-error';
import { TypedRequest } from './types';

const asyncErrorHandler = <T extends Query, K>(
  func: (
    req: TypedRequest<T, K>,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: TypedRequest<T, K>, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err: AppError) => {
      next(err);
    });
  };
};

export default asyncErrorHandler;

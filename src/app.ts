import express, { Request, Response, NextFunction } from 'express';
import userRouter from '@routers/user';
import taskRouter from '@routers/task';
import AppError from '@utils/app-error';
import { HTTP_STATUS } from '@utils/http-status';
import { errorHandler } from '@utils/error-handler';

const app = express();

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/users', taskRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Cannot find ${req.originalUrl} on the server!`,
      HTTP_STATUS.NOT_FOUND
    )
  );
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;

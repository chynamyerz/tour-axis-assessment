import { NextFunction, Request, Response } from 'express';
import { CreateUserProps, UpdateUserProps } from './types';
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestQuery,
} from '@utils/types';
import asyncErrorHandler from '@utils/async-error-handler';
import { customError } from '@utils/app-error';
import { HTTP_STATUS } from '@utils/http-status';
import prismaClient from '@/prisma-client';

const userClient = prismaClient.user;

export const getUser = asyncErrorHandler(
  async (
    req: TypedRequest<{ id: string }, undefined>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await userClient.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return customError(
        `User with id: ${req.params.id} does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    res.status(HTTP_STATUS.OK).json({ data: user, success: true });
  }
);

export const getUsers = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const users = await userClient.findMany();

    res.status(HTTP_STATUS.OK).json({ data: users, success: true });
  }
);

export const createUser = asyncErrorHandler(
  async (
    req: TypedRequestBody<CreateUserProps>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body.username) {
      return customError(
        `Username required, but it is not provided!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (!req.body.first_name) {
      return customError(
        `First name required, but it is not provided!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (!req.body.last_name) {
      return customError(
        `Last name required, but it is not required!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (
      await userClient.findUnique({ where: { username: req.body.username } })
    ) {
      return customError(
        `User with username: ${req.body.username}, already exist`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    const user = await userClient.create({
      data: req.body,
    });

    res.status(HTTP_STATUS.OK).json({ data: user, success: true });
  }
);

export const updateUser = asyncErrorHandler(
  async (
    req: TypedRequest<{ id: string }, UpdateUserProps>,
    res: Response,
    next: NextFunction
  ) => {
    if (!(await userClient.findUnique({ where: { id: req.params.id } }))) {
      return customError(
        `User with id: ${req.params.id}, does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    const user = await userClient.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(HTTP_STATUS.OK).json({ data: user, success: true });
  }
);

export const deleteUser = asyncErrorHandler(
  async (
    req: TypedRequestQuery<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!(await userClient.findUnique({ where: { id: req.params.id } }))) {
      return customError(
        `User with id: ${req.params.id}, does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    const user = await userClient.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(HTTP_STATUS.OK).json({ data: user, success: true });
  }
);

import { NextFunction, Response } from 'express';
import { CreateTaskProps, UpdateTaskProps } from './types';
import moment from 'moment';
import asyncErrorHandler from '@utils/async-error-handler';
import { TypedRequest, TypedRequestQuery } from '@utils/types';
import { HTTP_STATUS } from '@utils/http-status';
import { customError } from '@utils/app-error';
import { Status } from '@prisma/client';
import prismaClient from '@/prisma-client';

const taskClient = prismaClient.task;

const mapStatus = (status: string): Status => {
  switch (status) {
    case 'done':
      return Status.done;
    default:
      return Status.pending;
  }
};

const formatDateTime = (date_time: string) => {
  return moment(date_time).format();
};

export const getTasks = asyncErrorHandler(
  async (req: TypedRequestQuery<{ user_id: string }>, res: Response) => {
    const tasks = await taskClient.findMany({
      where: {
        user_id: req.params.user_id,
      },
    });

    res.status(HTTP_STATUS.OK).json({ data: tasks, success: true });
  }
);

export const getTask = asyncErrorHandler(
  async (
    req: TypedRequestQuery<{ user_id: string; task_id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const task = await taskClient.findUnique({
      where: {
        id: req.params.task_id,
        user_id: req.params.user_id,
      },
    });

    if (!task) {
      return customError(
        `Task with id: ${req.params.task_id} does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    res.status(HTTP_STATUS.OK).json({ data: task, success: true });
  }
);

export const createTask = asyncErrorHandler(
  async (
    req: TypedRequest<{ user_id: string }, CreateTaskProps>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body.name) {
      return customError(
        `Task name required, but it is not provided!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (!req.body.description) {
      return customError(
        `Task description required, but it is not provided!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (!req.body.date_time) {
      return customError(
        `Task date time required, but it is not required!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (!req.body.next_execute_date_time) {
      return customError(
        `Task next execute date time required, but it is not required!`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    if (
      await taskClient.findUnique({
        where: { name: req.body.name, user_id: req.params.user_id },
      })
    ) {
      return customError(
        `Task with name: ${req.body.name}, already exist`,
        HTTP_STATUS.BAD_REQUEST,
        next
      );
    }

    const task = await taskClient.create({
      data: {
        ...req.body,
        date_time: formatDateTime(req.body.date_time),
        next_execute_date_time: formatDateTime(req.body.next_execute_date_time),
        status: mapStatus(req.body.status),
        user: {
          connect: {
            id: req.params.user_id,
          },
        },
      },
    });

    res.status(HTTP_STATUS.OK).json({ data: task, success: true });
  }
);

export const updateTask = asyncErrorHandler(
  async (
    req: TypedRequest<{ user_id: string; task_id: string }, UpdateTaskProps>,
    res: Response,
    next: NextFunction
  ) => {
    const update_data: UpdateTaskProps = {};

    if (
      !(await taskClient.findUnique({
        where: { id: req.params.task_id, user_id: req.params.user_id },
      }))
    ) {
      return customError(
        `Task with id: ${req.params.task_id}, does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    if (req.body.name) {
      update_data.name = req.body.name;
    }

    if (req.body.description) {
      update_data.description = req.body.description;
    }

    if (req.body.date_time) {
      update_data.date_time = formatDateTime(req.body.date_time);
    }

    if (req.body.next_execute_date_time) {
      update_data.next_execute_date_time = formatDateTime(
        req.body.next_execute_date_time
      );
    }

    if (req.body.status) {
      update_data.status = mapStatus(req.body.status);
    }

    const task = await taskClient.update({
      where: {
        id: req.params.task_id,
        user_id: req.params.user_id,
      },
      data: update_data,
    });

    res.status(HTTP_STATUS.OK).json({ data: task, success: true });
  }
);

export const deleteTask = asyncErrorHandler(
  async (
    req: TypedRequestQuery<{ user_id: string; task_id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (
      !(await taskClient.findUnique({
        where: { id: req.params.task_id, user_id: req.params.user_id },
      }))
    ) {
      return customError(
        `Task with id: ${req.params.id}, does not exist!`,
        HTTP_STATUS.NOT_FOUND,
        next
      );
    }

    const task = await taskClient.delete({
      where: {
        id: req.params.task_id,
        user_id: req.params.user_id,
      },
    });

    res.status(HTTP_STATUS.OK).json({ data: task, success: true });
  }
);

export const updateTasksStatus = async () => {
  const outdatedTask = await taskClient.findMany({
    where: {
      next_execute_date_time: {
        lt: moment().format(),
      },
      status: 'pending',
    },
  });

  await taskClient.updateMany({
    where: {
      next_execute_date_time: {
        lt: moment().format(),
      },
      status: 'pending',
    },
    data: {
      status: 'done',
    },
  });

  console.log('Tasks with elapsed execute date time: ', outdatedTask);
};

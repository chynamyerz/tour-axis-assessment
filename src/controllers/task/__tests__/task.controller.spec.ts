import { CreateTaskProps } from '../types';
import request from 'supertest';
import app from '../../../app';
import { HTTP_STATUS } from '@utils/http-status';
import { prismaMock } from '@mocks/prisma-client.mock';
import { Status, Task } from '@prisma/client';
import moment from 'moment';

const task_client_mock = prismaMock.task;

describe('Task Controller', () => {
  const user_id = 'a59a7547-34e5-4cbd-839a-ba98ad31795f';
  const task_id = 'a1b41943-da0c-427d-8d6f-a277e716246d';
  const name = 'My task name';
  const description = 'My task description';
  const date_time = '2024-06-20 00:00:00';
  const next_execute_date_time = '2024-06-19 00:00:00';
  const status: Status = 'pending';
  const task_mock: Task = {
    id: task_id,
    name,
    description,
    date_time: moment(date_time).toDate(),
    next_execute_date_time: moment(next_execute_date_time).toDate(),
    status: 'pending',
    user_id,
  };

  describe('GET Request', () => {
    it('should get task', async () => {
      task_client_mock.findUnique.mockResolvedValue(task_mock);

      const response = await request(app).get(
        `/api/users/${user_id}/tasks/${task_id}`
      );

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({
        data: {
          ...task_mock,
          date_time: task_mock.date_time.toISOString(),
          next_execute_date_time:
            task_mock.next_execute_date_time.toISOString(),
        },
        success: true,
      });
    });

    it('should get tasks', async () => {
      task_client_mock.findMany.mockResolvedValue([task_mock]);

      const response = await request(app).get(`/api/users/${user_id}/tasks`);

      expect(task_client_mock.findMany).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({
        data: [
          {
            ...task_mock,
            date_time: task_mock.date_time.toISOString(),
            next_execute_date_time:
              task_mock.next_execute_date_time.toISOString(),
          },
        ],
        success: true,
      });
    });

    it('should throw 404 error if task not found', async () => {
      task_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app).get(
        `/api/users/${user_id}/tasks/empty-task-id`
      );

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });

  describe('POST Request', () => {
    it('should create new task', async () => {
      const create_task_props: CreateTaskProps = {
        name,
        description,
        date_time,
        next_execute_date_time,
        status,
      };

      task_client_mock.create.mockResolvedValue(task_mock);

      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send(create_task_props);

      expect(task_client_mock.create).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({
        data: {
          ...task_mock,
          date_time: task_mock.date_time.toISOString(),
          next_execute_date_time:
            task_mock.next_execute_date_time.toISOString(),
        },
        success: true,
      });
    });

    it('should throw 400 error if task already exist', async () => {
      const create_task_props: CreateTaskProps = {
        name,
        description,
        date_time,
        next_execute_date_time,
        status,
      };

      task_client_mock.findUnique.mockResolvedValue(task_mock);

      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send(create_task_props);

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(task_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('already exist');
    });

    it('should throw 400 error if request body is missing name', async () => {
      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send({
          description,
          date_time,
          next_execute_date_time,
          status,
        });

      expect(task_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('Task name required');
    });

    it('should throw 400 error if request body is missing description', async () => {
      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send({
          name,
          date_time,
          next_execute_date_time,
          status,
        });

      expect(task_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('Task description required');
    });

    it('should throw 400 error if request body is missing date time', async () => {
      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send({
          name,
          description,
          next_execute_date_time,
          status,
        });

      expect(task_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('Task date time required');
    });

    it('should throw 400 error if request body is missing next execute date time', async () => {
      const response = await request(app)
        .post(`/api/users/${user_id}/tasks`)
        .send({
          name,
          description,
          date_time,
          status,
        });

      expect(task_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain(
        'Task next execute date time required'
      );
    });
  });

  describe('PUT Request', () => {
    it('should update task', async () => {
      const updated_task_mock: Task = {
        ...task_mock,
        description: 'updated',
      };

      task_client_mock.findUnique.mockResolvedValue(task_mock);
      task_client_mock.update.mockResolvedValue(updated_task_mock);

      const response = await request(app)
        .put(`/api/users/${user_id}/tasks/${task_id}`)
        .send({
          first_name: 'updated',
        });

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(task_client_mock.update).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({
        data: {
          ...updated_task_mock,
          date_time: updated_task_mock.date_time.toISOString(),
          next_execute_date_time:
            updated_task_mock.next_execute_date_time.toISOString(),
        },
        success: true,
      });
    });

    it('should throw 404 error if task to update not found', async () => {
      task_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/users/${user_id}/tasks/empty-task-id`)
        .send({
          description: 'updated',
        });

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(task_client_mock.update).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });

  describe('DELETE Request', () => {
    it('should delete task', async () => {
      const deleted_delete_mock: Task = {
        ...task_mock,
      };

      task_client_mock.findUnique.mockResolvedValue(task_mock);
      task_client_mock.delete.mockResolvedValue(deleted_delete_mock);

      const response = await request(app).delete(
        `/api/users/${user_id}/tasks/${task_id}`
      );

      expect(task_client_mock.delete).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({
        data: {
          ...deleted_delete_mock,
          date_time: deleted_delete_mock.date_time.toISOString(),
          next_execute_date_time:
            deleted_delete_mock.next_execute_date_time.toISOString(),
        },
        success: true,
      });
    });

    it('should throw 404 error if task to delete not found', async () => {
      task_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app).delete(
        `/api/users/${user_id}/tasks/empty-task-id`
      );

      expect(task_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(task_client_mock.delete).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });
});

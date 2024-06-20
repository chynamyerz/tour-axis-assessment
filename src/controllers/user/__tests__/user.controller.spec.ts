import { CreateUserProps } from '../types';
import request from 'supertest';
import app from '../../../app';
import { HTTP_STATUS } from '@utils/http-status';
import { prismaMock } from '@mocks/prisma-client.mock';
import { User } from '@prisma/client';

const user_client_mock = prismaMock.user;

describe('User Controller', () => {
  const user_id = 'a59a7547-34e5-4cbd-839a-ba98ad31795f';
  const username = 'johnsmith';
  const first_name = 'John';
  const last_name = 'Smith';
  const user_mock: User = {
    id: user_id,
    username,
    first_name,
    last_name,
  };

  describe('GET Request', () => {
    it('should get user', async () => {
      user_client_mock.findUnique.mockResolvedValue(user_mock);

      const response = await request(app).get(`/api/users/${user_id}`);

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({ data: user_mock, success: true });
    });

    it('should get users', async () => {
      user_client_mock.findMany.mockResolvedValue([user_mock]);

      const response = await request(app).get(`/api/users`);

      expect(user_client_mock.findMany).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({ data: [user_mock], success: true });
    });

    it('should throw 404 error if user not found', async () => {
      user_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/users/empty-user-id');

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });

  describe('POST Request', () => {
    it('should create new user', async () => {
      const create_user_props: CreateUserProps = {
        username,
        first_name,
        last_name,
      };

      user_client_mock.create.mockResolvedValue(user_mock);

      const response = await request(app)
        .post('/api/users')
        .send(create_user_props);

      expect(user_client_mock.create).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({ data: user_mock, success: true });
    });

    it('should throw 400 error if user already exist', async () => {
      const create_user_props: CreateUserProps = {
        username,
        first_name,
        last_name,
      };

      user_client_mock.findUnique.mockResolvedValue(user_mock);

      const response = await request(app)
        .post('/api/users')
        .send(create_user_props);

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(user_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('already exist');
    });

    it('should throw 400 error if request body is missing username', async () => {
      const response = await request(app).post('/api/users').send({
        first_name,
        last_name,
      });

      expect(user_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('Username required');
    });

    it('should throw 400 error if request body is missing first name', async () => {
      const response = await request(app).post('/api/users').send({
        username,
        last_name,
      });

      expect(user_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('First name required');
    });

    it('should throw 400 error if request body is missing last name', async () => {
      const response = await request(app).post('/api/users').send({
        username,
        first_name,
      });

      expect(user_client_mock.create).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.message).toContain('Last name required');
    });
  });

  describe('PUT Request', () => {
    it('should update user', async () => {
      const updated_user_mock: User = {
        ...user_mock,
        first_name: 'updated',
      };

      user_client_mock.findUnique.mockResolvedValue(user_mock);
      user_client_mock.update.mockResolvedValue(updated_user_mock);

      const response = await request(app).put(`/api/users/${user_id}`).send({
        first_name: 'updated',
      });

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(user_client_mock.update).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({ data: updated_user_mock, success: true });
    });

    it('should throw 404 error if user to update not found', async () => {
      user_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app).put(`/api/users/empty-user-id`).send({
        first_name: 'updated',
      });

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(user_client_mock.update).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });

  describe('DELETE Request', () => {
    it('should delete user', async () => {
      const deleted_user_mock: User = {
        ...user_mock,
      };

      user_client_mock.findUnique.mockResolvedValue(user_mock);
      user_client_mock.delete.mockResolvedValue(deleted_user_mock);

      const response = await request(app).delete(`/api/users/${user_id}`);

      expect(user_client_mock.delete).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toBe(HTTP_STATUS.OK);
      expect(response.body).toEqual({ data: deleted_user_mock, success: true });
    });

    it('should throw 404 error if user to delete not found', async () => {
      user_client_mock.findUnique.mockResolvedValue(null);

      const response = await request(app).delete(`/api/users/empty-user-id`);

      expect(user_client_mock.findUnique).toHaveBeenCalledTimes(1);
      expect(user_client_mock.delete).toHaveBeenCalledTimes(0);
      expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body.message).toContain('does not exist!');
    });
  });
});

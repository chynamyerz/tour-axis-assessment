import {
  createTask,
  deleteTask,
  getTasks,
  getTask,
  updateTask,
} from '@controllers/task/task.controller';
import { Router } from 'express';

const taskRouter = Router();
const SECONDARY_BASE_PATH = ':user_id/tasks';

taskRouter.get(`/${SECONDARY_BASE_PATH}`, getTasks);
taskRouter.get(`/${SECONDARY_BASE_PATH}/:task_id`, getTask);
taskRouter.post(`/${SECONDARY_BASE_PATH}`, createTask);
taskRouter.put(`/${SECONDARY_BASE_PATH}/:task_id`, updateTask);
taskRouter.delete(`/${SECONDARY_BASE_PATH}/:task_id`, deleteTask);

export default taskRouter;

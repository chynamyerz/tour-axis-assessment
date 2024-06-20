import {
  createUser,
  deleteUser,
  getUsers,
  getUser,
  updateUser,
} from '@controllers/user/user.controller';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;

import { User } from '@prisma/client';

export interface CreateUserProps extends Omit<User, 'id'> {}

export interface UpdateUserProps {
  username?: string;
  first_name?: string;
  last_name?: string;
}

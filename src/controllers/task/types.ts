import { Status, Task } from '@prisma/client';

export interface CreateTaskProps
  extends Omit<
    Task,
    'id' | 'user_id' | 'date_time' | 'next_execute_date_time'
  > {
  date_time: string;
  next_execute_date_time: string;
}

export interface UpdateTaskProps {
  name?: string;
  description?: string;
  date_time?: string;
  next_execute_date_time?: string;
  status?: Status;
}

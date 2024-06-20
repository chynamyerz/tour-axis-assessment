import cron from 'node-cron';
import { updateTasksStatus } from '@controllers/task/task.controller';
import app from '@/app';

const startServer = () => {
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server up and running on port: ${port}`);

    // Runs every day midnight
    cron.schedule('0 * * * *', () => {
      updateTasksStatus();
    });
  });
};

startServer();

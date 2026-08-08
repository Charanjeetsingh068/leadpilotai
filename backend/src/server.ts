import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';
import { startMetaSyncCron } from './jobs/meta-sync.job';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(ENV.PORT, () => {
    console.log(`[Server] LeadPilot AI Backend running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
    startMetaSyncCron();
  });
};

startServer();

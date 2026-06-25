import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './utils/db';
import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  logger.error('[uncaughtException]', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('[unhandledRejection]', { reason });
  process.exit(1);
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger docs at http://localhost:${PORT}/api/docs`);
  });
};

start().catch((err) => {
  logger.error('[Startup Error]', err);
  process.exit(1);
});

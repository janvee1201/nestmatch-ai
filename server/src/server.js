import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

// Handle synchronous uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  if (error.stack) logger.error(error.stack);
  process.exit(1);
});

const startServer = async () => {
  // Connect to database. The process will terminate here if connection fails.
  await connectDB();

  // Start Express listener
  const server = app.listen(env.port, () => {
    logger.info(`NestMatch AI server running in [${env.nodeEnv}] mode on port ${env.port}`);
  });

  // Handle asynchronous unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Promise Rejection: ${error.message}`);
    if (error.stack) logger.error(error.stack);
    
    // Close the server and exit
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();

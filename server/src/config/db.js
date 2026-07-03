import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(env.mongoUri);
    logger.info(`Database successfully connected to host: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

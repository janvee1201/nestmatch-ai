import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(env.nodeEnv === 'development' ? { stack: error.stack } : {}),
  };

  logger.error(`${req.method} ${req.url} - Status ${error.statusCode} - Error: ${error.message}`);

  res.status(error.statusCode).json(response);
};

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env.js';
console.log("FRONTEND_URL loaded:", env.frontendUrl);
import { logger } from './utils/logger.js';
import { ApiResponse } from './utils/ApiResponse.js';
import authRouter from './routes/auth.routes.js';
import profileRouter from './routes/profile.routes.js';
import propertyRouter from './routes/property.routes.js';
import matchingRouter from './routes/matching.routes.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Secure HTTP headers
app.use(helmet());

// Enable CORS with configured frontend URL
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(
  express.json({
    limit: '16kb',
    type: ['application/json', 'text/plain', 'application/*+json'],
  })
);
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Stream HTTP logs through Winston logger
const morganFormat = env.nodeEnv === 'development' ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const mongoStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const readyState = mongoose.connection.readyState;

  const healthInfo = {
    status: 'healthy',
    uptime: process.uptime(),
    environment: env.nodeEnv,
    mongodb: {
      readyState,
      status: mongoStates[readyState] || 'unknown',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(
    new ApiResponse(200, healthInfo, 'Server and database connection status')
  );
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/matching', matchingRouter);

// Fallback 404 handler for unmatched routes
app.use(notFound);

// Global centralized error handler
app.use(errorHandler);

export { app };

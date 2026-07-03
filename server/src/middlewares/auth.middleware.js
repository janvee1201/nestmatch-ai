import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User associated with this token does not exist');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Your account is inactive');
    }

    // Attach user to the request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token');
  }
});

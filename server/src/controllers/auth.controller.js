import * as authService from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Handle user registration request
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, user, 'User registered successfully'));
});

/**
 * Handle user login request
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, 'User logged in successfully'));
});

/**
 * Handle user logout request
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser();
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, 'Logged out successfully'));
});

/**
 * Handle fetch current user profile request
 */
export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, user, 'User profile retrieved successfully'));
});

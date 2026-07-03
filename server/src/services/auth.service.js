import * as authRepository from '../repositories/auth.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Registers a new user.
 * @param {Object} userData
 * @returns {Promise<Object>} Created user without password
 */
export const registerUser = async (userData) => {
  const { email, role } = userData;

  // Prevent admin registration
  if (role === 'ADMIN') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Admin registration is not allowed.');
  }

  // Prevent duplicate registration
  const emailExists = await authRepository.checkEmailExists(email);
  if (emailExists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Email is already registered.');
  }

  // Create user
  const user = await authRepository.createUser(userData);

  // Remove password from response object
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data and JWT token
 */
export const loginUser = async (email, password) => {
  // Retrieve user with password
  const user = await authRepository.findUserByEmail(email, true);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  // Reject inactive user
  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Your account is currently inactive.');
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  // Generate access token
  const token = user.generateAccessToken();

  // Remove password from output
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    token,
  };
};

/**
 * Retrieves the current user's profile.
 * @param {string} userId
 * @returns {Promise<Object>} User profile
 */
export const getCurrentUser = async (userId) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found.');
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Your account is inactive.');
  }

  return user;
};

/**
 * Logs out a user (stub for client-side cleanup).
 * @returns {Promise<boolean>}
 */
export const logoutUser = async () => {
  return true;
};

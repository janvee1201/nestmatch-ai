import * as profileService from '../services/profile.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Handle fetch user profile request
 */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getUserProfile(req.user._id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, profile, 'Profile retrieved successfully'));
});

/**
 * Handle update user profile request
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateUserProfile(req.user._id, req.body);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, profile, 'Profile updated successfully'));
});

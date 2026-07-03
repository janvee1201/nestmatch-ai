import * as matchingService from '../services/matching.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Handle fetch tenant compatibility recommendations
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await matchingService.getRecommendations(req.user._id);
  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        recommendations,
        'Compatibility recommendations retrieved successfully'
      )
    );
});

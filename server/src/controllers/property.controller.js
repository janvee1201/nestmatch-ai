import * as propertyService from '../services/property.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Handle property listing creation
 */
export const createProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.createProperty(
    req.user._id,
    req.user.role,
    req.body
  );
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, property, 'Property listing created successfully'));
});

/**
 * Handle searching and filtering properties
 */
export const searchProperties = asyncHandler(async (req, res) => {
  const properties = await propertyService.searchProperties(req.query);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, properties, 'Properties retrieved successfully'));
});

/**
 * Handle fetching details of a specific property listing
 */
export const getPropertyDetails = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyDetails(req.params.id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, property, 'Property details retrieved successfully'));
});

/**
 * Handle property listing updates
 */
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.updateProperty(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, property, 'Property listing updated successfully'));
});

/**
 * Handle property listing deletion
 */
export const deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deleteProperty(req.params.id, req.user._id, req.user.role);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, 'Property listing deleted successfully'));
});

/**
 * Handle fetching own listings for the logged-in owner
 */
export const getMyListings = asyncHandler(async (req, res) => {
  const properties = await propertyService.getOwnerListings(req.user._id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, properties, 'Owner listings retrieved successfully'));
});

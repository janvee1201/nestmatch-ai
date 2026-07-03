import * as propertyRepository from '../repositories/property.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, ROLES } from '../utils/constants.js';

/**
 * Ensures that the user has the OWNER role.
 * @param {string} role
 */
const assertOwnerRole = (role) => {
  if (role !== ROLES.OWNER) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'Access denied. Only owners can manage property listings.'
    );
  }
};

/**
 * Creates a new property listing.
 * @param {string} ownerId
 * @param {string} role
 * @param {Object} propertyData
 * @returns {Promise<Object>} Created property document
 */
export const createProperty = async (ownerId, role, propertyData) => {
  assertOwnerRole(role);
  return await propertyRepository.createProperty({
    ...propertyData,
    owner: ownerId,
  });
};

/**
 * Updates an existing property listing owned by the user.
 * @param {string} propertyId
 * @param {string} ownerId
 * @param {string} role
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated property document
 */
export const updateProperty = async (propertyId, ownerId, role, updateData) => {
  assertOwnerRole(role);

  const property = await propertyRepository.getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found.');
  }

  // Ensure owner matches (populate maps owner as an object/document, so check owner._id or owner directly)
  const actualOwnerId = property.owner._id ? property.owner._id.toString() : property.owner.toString();
  if (actualOwnerId !== ownerId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'Access denied. You can only update your own property listings.'
    );
  }

  const updatedProperty = await propertyRepository.updateProperty(propertyId, updateData);
  if (!updatedProperty) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found.');
  }

  return updatedProperty;
};

/**
 * Deletes a property listing owned by the user.
 * @param {string} propertyId
 * @param {string} ownerId
 * @param {string} role
 * @returns {Promise<Object>} Deleted property document
 */
export const deleteProperty = async (propertyId, ownerId, role) => {
  assertOwnerRole(role);

  const property = await propertyRepository.getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found.');
  }

  const actualOwnerId = property.owner._id ? property.owner._id.toString() : property.owner.toString();
  if (actualOwnerId !== ownerId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      'Access denied. You can only delete your own property listings.'
    );
  }

  return await propertyRepository.deleteProperty(propertyId);
};

/**
 * Gets details of a specific property listing.
 * @param {string} propertyId
 * @returns {Promise<Object>} Property document
 */
export const getPropertyDetails = async (propertyId) => {
  const property = await propertyRepository.getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found.');
  }
  return property;
};

/**
 * Searches all available properties with dynamic filters.
 * @param {Object} queryParams
 * @returns {Promise<Array>} List of filtered property documents
 */
export const searchProperties = async (queryParams) => {
  return await propertyRepository.searchProperties(queryParams);
};

/**
 * Retrieves listings created by the logged-in owner.
 * @param {string} ownerId
 * @returns {Promise<Array>} Owner property documents
 */
export const getOwnerListings = async (ownerId) => {
  return await propertyRepository.getOwnerProperties(ownerId);
};

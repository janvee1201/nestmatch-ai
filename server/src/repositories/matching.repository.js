import { User } from '../models/User.model.js';
import { Property } from '../models/Property.model.js';

/**
 * Finds a tenant profile by ID.
 * @param {string} tenantId
 * @returns {Promise<Object|null>} User document
 */
export const getTenantProfile = async (tenantId) => {
  return await User.findById(tenantId);
};

/**
 * Retrieves all available properties, populating their owners.
 * @returns {Promise<Array>} List of available property documents with owners populated
 */
export const getAvailableProperties = async () => {
  return await Property.find({ isAvailable: true }).populate('owner');
};

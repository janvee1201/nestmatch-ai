import { Property } from '../models/Property.model.js';

/**
 * Creates a new property listing.
 * @param {Object} propertyData
 * @returns {Promise<Object>} Created property document
 */
export const createProperty = async (propertyData) => {
  return await Property.create(propertyData);
};

/**
 * Updates a property listing.
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>} Updated property document
 */
export const updateProperty = async (id, updateData) => {
  return await Property.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Deletes a property listing.
 * @param {string} id
 * @returns {Promise<Object|null>} Deleted property document
 */
export const deleteProperty = async (id) => {
  return await Property.findByIdAndDelete(id);
};

/**
 * Finds a property by its ID, populating owner information.
 * @param {string} id
 * @returns {Promise<Object|null>} Property document
 */
export const getPropertyById = async (id) => {
  return await Property.findById(id).populate('owner', 'fullName email phone');
};

/**
 * Retrieves all properties owned by a specific user.
 * @param {string} ownerId
 * @returns {Promise<Array>} List of property documents
 */
export const getOwnerProperties = async (ownerId) => {
  return await Property.find({ owner: ownerId });
};

/**
 * Dynamic search filtering for properties.
 * @param {Object} queryParams
 * @returns {Promise<Array>} List of filtered property documents
 */
export const searchProperties = async (queryParams) => {
  const filter = { isAvailable: true };

  if (queryParams.city) {
    filter.city = { $regex: queryParams.city.trim(), $options: 'i' };
  }

  if (queryParams.locality) {
    filter.locality = { $regex: queryParams.locality.trim(), $options: 'i' };
  }

  if (queryParams.propertyType) {
    filter.propertyType = queryParams.propertyType;
  }

  if (queryParams.furnishing) {
    filter.furnishing = queryParams.furnishing;
  }

  if (queryParams.bedrooms !== undefined && queryParams.bedrooms !== '') {
    filter.bedrooms = Number(queryParams.bedrooms);
  }

  if (queryParams.minRent !== undefined && queryParams.minRent !== '') {
    if (!filter.rent) filter.rent = {};
    filter.rent.$gte = Number(queryParams.minRent);
  }

  if (queryParams.maxRent !== undefined && queryParams.maxRent !== '') {
    if (!filter.rent) filter.rent = {};
    filter.rent.$lte = Number(queryParams.maxRent);
  }

  return await Property.find(filter)
    .populate('owner', 'fullName email phone')
    .sort({ createdAt: -1 });
};

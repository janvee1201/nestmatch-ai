import { User } from '../models/User.model.js';

/**
 * Finds a user by their ID.
 * @param {string} id
 * @returns {Promise<Object|null>} User document
 */
export const findUserById = async (id) => {
  return await User.findById(id);
};

/**
 * Updates a user's profile data.
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>} Updated user document
 */
export const updateUserProfile = async (id, updateData) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

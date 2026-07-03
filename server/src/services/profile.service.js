import * as profileRepository from '../repositories/profile.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Checks if all required profile fields are completed.
 * @param {Object} user
 * @returns {boolean}
 */
const calculateProfileCompleted = (user) => {
  const requiredFields = [
    user.fullName,
    user.phone,
    user.gender,
    user.age,
    user.occupation,
    user.bio,
    user.preferredLocation,
    user.budgetMin,
    user.budgetMax,
    user.moveInDate,
  ];

  const hasEmptyCoreField = requiredFields.some(
    (field) => field === null || field === undefined || field === ''
  );

  if (hasEmptyCoreField) return false;

  const lifestyle = user.lifestyle || {};
  const lifestyleFields = [
    lifestyle.smoking,
    lifestyle.drinking,
    lifestyle.pets,
    lifestyle.sleepSchedule,
    lifestyle.cleanliness,
  ];

  const hasEmptyLifestyleField = lifestyleFields.some(
    (field) => field === null || field === undefined || field === ''
  );

  return !hasEmptyLifestyleField;
};

/**
 * Retrieves the current user's profile.
 * @param {string} userId
 * @returns {Promise<Object>} User profile document
 */
export const getUserProfile = async (userId) => {
  const user = await profileRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found.');
  }
  return user;
};

/**
 * Updates the user's profile and recalculates completion status.
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Promise<Object>} Updated user profile document
 */
export const updateUserProfile = async (userId, updateData) => {
  const user = await profileRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found.');
  }

  // Validate budget constraint against the merged data
  const currentMin = updateData.budgetMin !== undefined ? updateData.budgetMin : user.budgetMin;
  const currentMax = updateData.budgetMax !== undefined ? updateData.budgetMax : user.budgetMax;
  if (currentMin !== null && currentMax !== null && currentMin > currentMax) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Minimum budget cannot be greater than maximum budget'
    );
  }

  // Build the flat update object
  const updateObj = {};

  const coreFields = [
    'fullName',
    'phone',
    'gender',
    'age',
    'occupation',
    'bio',
    'preferredLocation',
    'budgetMin',
    'budgetMax',
    'moveInDate',
  ];

  coreFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updateObj[field] = updateData[field];
    }
  });

  // Handle nested lifestyle fields partially to avoid overwriting unprovided fields
  if (updateData.lifestyle) {
    const lifestyleFields = ['smoking', 'drinking', 'pets', 'sleepSchedule', 'cleanliness'];
    lifestyleFields.forEach((field) => {
      if (updateData.lifestyle[field] !== undefined) {
        updateObj[`lifestyle.${field}`] = updateData.lifestyle[field];
      }
    });
  }

  // Create a merged representation to calculate profileCompleted
  const mergedUser = {
    fullName: updateData.fullName !== undefined ? updateData.fullName : user.fullName,
    phone: updateData.phone !== undefined ? updateData.phone : user.phone,
    gender: updateData.gender !== undefined ? updateData.gender : user.gender,
    age: updateData.age !== undefined ? updateData.age : user.age,
    occupation: updateData.occupation !== undefined ? updateData.occupation : user.occupation,
    bio: updateData.bio !== undefined ? updateData.bio : user.bio,
    preferredLocation: updateData.preferredLocation !== undefined ? updateData.preferredLocation : user.preferredLocation,
    budgetMin: currentMin,
    budgetMax: currentMax,
    moveInDate: updateData.moveInDate !== undefined ? updateData.moveInDate : user.moveInDate,
    lifestyle: {
      smoking: (updateData.lifestyle && updateData.lifestyle.smoking !== undefined) ? updateData.lifestyle.smoking : (user.lifestyle ? user.lifestyle.smoking : null),
      drinking: (updateData.lifestyle && updateData.lifestyle.drinking !== undefined) ? updateData.lifestyle.drinking : (user.lifestyle ? user.lifestyle.drinking : null),
      pets: (updateData.lifestyle && updateData.lifestyle.pets !== undefined) ? updateData.lifestyle.pets : (user.lifestyle ? user.lifestyle.pets : null),
      sleepSchedule: (updateData.lifestyle && updateData.lifestyle.sleepSchedule !== undefined) ? updateData.lifestyle.sleepSchedule : (user.lifestyle ? user.lifestyle.sleepSchedule : null),
      cleanliness: (updateData.lifestyle && updateData.lifestyle.cleanliness !== undefined) ? updateData.lifestyle.cleanliness : (user.lifestyle ? user.lifestyle.cleanliness : null),
    }
  };

  updateObj.profileCompleted = calculateProfileCompleted(mergedUser);

  // Save changes using repository's updateUserProfile
  return await profileRepository.updateUserProfile(userId, updateObj);
};

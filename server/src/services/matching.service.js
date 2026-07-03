import * as matchingRepository from '../repositories/matching.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Computes co-living compatibility recommendations for a tenant.
 * @param {string} tenantId
 * @returns {Promise<Array>} List of recommended properties sorted by compatibility score
 */
export const getRecommendations = async (tenantId) => {
  // 1. Retrieve tenant profile
  const tenant = await matchingRepository.getTenantProfile(tenantId);
  if (!tenant) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Tenant profile not found.');
  }

  // 2. Validate tenant profile is complete
  if (!tenant.profileCompleted) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Profile is incomplete. Please complete your profile to get matching recommendations.'
    );
  }

  // 3. Retrieve all available properties
  const properties = await matchingRepository.getAvailableProperties();
  if (!properties || properties.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No available properties found.');
  }

  // 4. Compute compatibility score (0-100) for each property
  const recommendations = properties.map((property) => {
    let score = 0;
    const reasons = [];

    // Preferred Location: Exact match on city or locality (case-insensitive) -> +30
    const tenantLoc = (tenant.preferredLocation || '').trim().toLowerCase();
    const propCity = (property.city || '').trim().toLowerCase();
    const propLocality = (property.locality || '').trim().toLowerCase();

    if (tenantLoc && (propCity === tenantLoc || propLocality === tenantLoc)) {
      score += 30;
      reasons.push('Location matches your preferences');
    }

    // Budget: Rent is within budget [budgetMin, budgetMax] -> +25
    const budgetMin = tenant.budgetMin !== null && tenant.budgetMin !== undefined ? tenant.budgetMin : 0;
    const budgetMax = tenant.budgetMax !== null && tenant.budgetMax !== undefined ? tenant.budgetMax : Infinity;
    if (property.rent >= budgetMin && property.rent <= budgetMax) {
      score += 25;
      reasons.push('Rent is within your budget');
    }

    // Move-in Date: Available within 30 days of tenant's move-in date -> +15
    if (tenant.moveInDate && property.availableFrom) {
      const diffTime = Math.abs(new Date(property.availableFrom) - new Date(tenant.moveInDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        score += 15;
        reasons.push('Property is available within 30 days of your move-in date');
      }
    }

    // Lifestyle Compatibility: Compare smoking, drinking, pets -> +5 each
    if (tenant.lifestyle && property.owner && property.owner.lifestyle) {
      const tenantLife = tenant.lifestyle;
      const ownerLife = property.owner.lifestyle;
      const matchingHabits = [];

      if (tenantLife.smoking && ownerLife.smoking && tenantLife.smoking === ownerLife.smoking) {
        score += 5;
        matchingHabits.push('smoking');
      }
      if (tenantLife.drinking && ownerLife.drinking && tenantLife.drinking === ownerLife.drinking) {
        score += 5;
        matchingHabits.push('drinking');
      }
      if (tenantLife.pets && ownerLife.pets && tenantLife.pets === ownerLife.pets) {
        score += 5;
        matchingHabits.push('pets');
      }

      if (matchingHabits.length > 0) {
        reasons.push(`Compatible lifestyle choices (${matchingHabits.join(', ')})`);
      }
    }

    const compatibilityScore = Math.min(score, 100);
    const compatibilityReason = reasons.length > 0 ? reasons.join('. ') + '.' : 'No significant match criteria satisfied.';

    return {
      property,
      compatibilityScore,
      compatibilityReason,
    };
  });

  // 5. Sort descending by compatibilityScore, then slice to top 10
  return recommendations
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 10);
};

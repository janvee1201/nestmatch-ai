import Joi from 'joi';

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().messages({
    'string.empty': 'Full name cannot be empty',
  }),
  phone: Joi.string().trim().allow(null, '').optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').uppercase().messages({
    'any.only': 'Gender must be MALE, FEMALE, or OTHER',
  }),
  age: Joi.number().integer().min(18).messages({
    'number.min': 'Age must be at least 18 years old',
    'number.base': 'Age must be a number',
  }),
  occupation: Joi.string().trim().allow(null, '').optional(),
  bio: Joi.string().trim().allow(null, '').optional(),
  preferredLocation: Joi.string().trim().allow(null, '').optional(),
  budgetMin: Joi.number().min(0).allow(null).optional().messages({
    'number.min': 'Minimum budget must be a positive number',
  }),
  budgetMax: Joi.number().min(0).allow(null).optional().messages({
    'number.min': 'Maximum budget must be a positive number',
  }),
  moveInDate: Joi.date().allow(null, '').optional().messages({
    'date.base': 'Move-in date must be a valid date',
  }),
  lifestyle: Joi.object({
    smoking: Joi.string().trim().allow(null, '').optional(),
    drinking: Joi.string().trim().allow(null, '').optional(),
    pets: Joi.string().trim().allow(null, '').optional(),
    sleepSchedule: Joi.string().trim().allow(null, '').optional(),
    cleanliness: Joi.string().trim().allow(null, '').optional(),
  }).optional(),
}).custom((value, helpers) => {
  const { budgetMin, budgetMax } = value;
  if (budgetMin !== undefined && budgetMax !== undefined && budgetMin !== null && budgetMax !== null) {
    if (budgetMin > budgetMax) {
      return helpers.message('Minimum budget cannot be greater than maximum budget');
    }
  }
  return value;
});

export const profileValidator = {
  update: {
    body: updateProfileSchema,
  },
};

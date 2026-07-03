import Joi from 'joi';

const registerSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    'any.required': 'Full name is required',
    'string.empty': 'Full name cannot be empty',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one letter and one number',
      'string.empty': 'Password cannot be empty',
    }),
  role: Joi.string().valid('TENANT', 'OWNER').required().messages({
    'any.required': 'Role is required',
    'any.only': 'Role must be either TENANT or OWNER',
  }),
  preferredLocation: Joi.string().allow(null, '').optional(),
  budgetMin: Joi.number().allow(null).optional(),
  budgetMax: Joi.number().allow(null).optional(),
  moveInDate: Joi.date().allow(null, '').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
  }),
});

export const authValidator = {
  register: {
    body: registerSchema,
  },
  login: {
    body: loginSchema,
  },
};

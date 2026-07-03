import Joi from 'joi';

const createPropertySchema = Joi.object({
  title: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().min(10).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required',
  }),
  propertyType: Joi.string().valid('Apartment', 'Flat', 'PG', 'House').required().messages({
    'any.only': 'Property type must be Apartment, Flat, PG, or House',
    'any.required': 'Property type is required',
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': 'Address is required',
    'any.required': 'Address is required',
  }),
  city: Joi.string().trim().required().messages({
    'string.empty': 'City is required',
    'any.required': 'City is required',
  }),
  locality: Joi.string().trim().required().messages({
    'string.empty': 'Locality is required',
    'any.required': 'Locality is required',
  }),
  rent: Joi.number().positive().required().messages({
    'number.base': 'Rent must be a number',
    'number.positive': 'Rent must be a positive number',
    'any.required': 'Rent is required',
  }),
  securityDeposit: Joi.number().positive().required().messages({
    'number.base': 'Security deposit must be a number',
    'number.positive': 'Security deposit must be a positive number',
    'any.required': 'Security deposit is required',
  }),
  availableFrom: Joi.date().required().messages({
    'date.base': 'Available from must be a valid date',
    'any.required': 'Available from date is required',
  }),
  furnishing: Joi.string().valid('Furnished', 'Semi-Furnished', 'Unfurnished').required().messages({
    'any.only': 'Furnishing must be Furnished, Semi-Furnished, or Unfurnished',
    'any.required': 'Furnishing status is required',
  }),
  bedrooms: Joi.number().integer().min(0).required().messages({
    'number.base': 'Bedrooms must be a number',
    'number.min': 'Bedrooms cannot be negative',
    'any.required': 'Number of bedrooms is required',
  }),
  bathrooms: Joi.number().integer().min(0).required().messages({
    'number.base': 'Bathrooms must be a number',
    'number.min': 'Bathrooms cannot be negative',
    'any.required': 'Number of bathrooms is required',
  }),
  amenities: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isAvailable: Joi.boolean().optional(),
});

const updatePropertySchema = Joi.object({
  title: Joi.string().trim().min(3).optional().messages({
    'string.min': 'Title must be at least 3 characters long',
  }),
  description: Joi.string().trim().min(10).optional().messages({
    'string.min': 'Description must be at least 10 characters long',
  }),
  propertyType: Joi.string().valid('Apartment', 'Flat', 'PG', 'House').optional().messages({
    'any.only': 'Property type must be Apartment, Flat, PG, or House',
  }),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  locality: Joi.string().trim().optional(),
  rent: Joi.number().positive().optional().messages({
    'number.positive': 'Rent must be a positive number',
  }),
  securityDeposit: Joi.number().positive().optional().messages({
    'number.positive': 'Security deposit must be a positive number',
  }),
  availableFrom: Joi.date().optional().messages({
    'date.base': 'Available from must be a valid date',
  }),
  furnishing: Joi.string().valid('Furnished', 'Semi-Furnished', 'Unfurnished').optional().messages({
    'any.only': 'Furnishing must be Furnished, Semi-Furnished, or Unfurnished',
  }),
  bedrooms: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Bedrooms cannot be negative',
  }),
  bathrooms: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Bathrooms cannot be negative',
  }),
  amenities: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isAvailable: Joi.boolean().optional(),
});

export const propertyValidator = {
  create: {
    body: createPropertySchema,
  },
  update: {
    body: updatePropertySchema,
  },
};

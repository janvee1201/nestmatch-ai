import Joi from 'joi';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

export const validate = (schema) => (req, res, next) => {
  const validations = {};

  if (Joi.isSchema(schema)) {
    validations.body = schema;
  } else {
    if (schema.body) validations.body = schema.body;
    if (schema.query) validations.query = schema.query;
    if (schema.params) validations.params = schema.params;
  }

  const errors = [];

  for (const [key, partSchema] of Object.entries(validations)) {
    const { value, error } = partSchema.validate(req[key], {
      abortEarly: false,
      errors: { wrap: { label: '' } },
    });

    if (error) {
      errors.push(...error.details.map((detail) => detail.message));
    } else {
      req[key] = value;
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors));
  }

  next();
};

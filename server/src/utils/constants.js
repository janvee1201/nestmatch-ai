export const ROLES = {
  TENANT: 'TENANT',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export const DB_NAME = 'nestmatch';

export const AI_FALLBACK = {
  DEFAULT_COMPATIBILITY_SCORE: 70,
  DEFAULT_COMPATIBILITY_REASON: 'High match based on location preference and budget criteria.',
  DEFAULT_SUGGESTIONS: [
    'Schedule a viewing to see the space in person.',
    'Ask the landlord about utility costs and lease terms.',
  ],
};

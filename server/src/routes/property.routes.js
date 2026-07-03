import { Router } from 'express';
import {
  createProperty,
  searchProperties,
  getPropertyDetails,
  updateProperty,
  deleteProperty,
  getMyListings,
} from '../controllers/property.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { propertyValidator } from '../validators/property.validator.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// Search properties - Public endpoint (can also be accessed by unauthenticated users or tenants)
router.get('/', searchProperties);

// Fetch logged-in owner's properties - Protected endpoint (OWNER only)
// Note: This must be defined before router.get('/:id') so it is not treated as a property ID.
router.get('/my/listings', verifyJWT, requireRole(ROLES.OWNER), getMyListings);

// Get property details - Public endpoint
router.get('/:id', getPropertyDetails);

// Property management endpoints - Protected endpoints (OWNER only)
router.post(
  '/',
  verifyJWT,
  requireRole(ROLES.OWNER),
  validate(propertyValidator.create),
  createProperty
);

router.put(
  '/:id',
  verifyJWT,
  requireRole(ROLES.OWNER),
  validate(propertyValidator.update),
  updateProperty
);

router.delete(
  '/:id',
  verifyJWT,
  requireRole(ROLES.OWNER),
  deleteProperty
);

export default router;

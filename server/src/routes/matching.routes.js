import { Router } from 'express';
import { getRecommendations } from '../controllers/matching.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get(
  '/recommendations',
  verifyJWT,
  requireRole(ROLES.TENANT),
  getRecommendations
);

export default router;

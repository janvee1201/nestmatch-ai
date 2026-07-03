import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { profileValidator } from '../validators/profile.validator.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes in this router with JWT verification
router.use(verifyJWT);

router.get('/', getProfile);
router.put('/', validate(profileValidator.update), updateProfile);

export default router;

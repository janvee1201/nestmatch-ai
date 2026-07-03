import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authValidator } from '../validators/auth.validator.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public auth routes
router.post('/register', validate(authValidator.register), register);
router.post('/login', validate(authValidator.login), login);

// Protected auth routes
router.post('/logout', verifyJWT, logout);
router.get('/me', verifyJWT, me);

export default router;

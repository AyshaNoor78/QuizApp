import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schemas from '../validators/auth.validators';

const router = Router();

router.post('/register', authLimiter, validate(schemas.registerSchema), authController.register);
router.post('/login', authLimiter, validate(schemas.loginSchema), authController.login);
router.post('/refresh', authLimiter, validate(schemas.refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getProfile);

export default router;

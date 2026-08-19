import { Router } from 'express';
import * as subController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { otpLimiter } from '../middleware/rate-limit.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schemas from '../validators/subscription.validators';

const router = Router();

router.get('/status', authenticate, subController.getStatus);
router.post('/request-otp', authenticate, otpLimiter, validate(schemas.requestOtpSchema), subController.requestOtp);
router.post('/verify-otp', authenticate, validate(schemas.verifyOtpSchema), subController.verifyOtp);
router.post('/callback', subController.handleCallback); // Internal validation
router.post('/cancel', authenticate, subController.cancelSubscription);

export default router;

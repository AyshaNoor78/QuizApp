import { Router } from 'express';
import { getDailyScores } from '../controllers/daily-score.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.get('/', authenticate, getDailyScores);
export default router;

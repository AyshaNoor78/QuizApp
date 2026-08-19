import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { quizLimiter } from '../middleware/rate-limit.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schemas from '../validators/quiz.validators';

const router = Router();

router.get('/subjects', optionalAuth, quizController.getSubjects);
router.get('/subjects/:id/chapters', optionalAuth, quizController.getChapters);
router.get('/chapters/:id/sections', optionalAuth, quizController.getSections);

router.post('/start', authenticate, quizLimiter, validate(schemas.startQuizSchema), quizController.startSession);
router.get('/sessions/:id/next', authenticate, quizController.getNextQuestion);
router.post('/sessions/:id/answer', authenticate, quizLimiter, validate(schemas.submitAnswerSchema), quizController.submitAnswer);
router.get('/sessions/:id/result', authenticate, quizController.getResult);
router.get('/history', authenticate, quizController.getHistory);

export default router;

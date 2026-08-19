import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schemas from '../validators/admin.validators';

const router = Router();
router.use(authenticate, requireAdmin);

router.post('/subjects', validate(schemas.createSubjectSchema), adminController.createSubject);
router.post('/chapters', validate(schemas.createChapterSchema), adminController.createChapter);
router.post('/sections', validate(schemas.createSectionSchema), adminController.createSection);
router.post('/questions', validate(schemas.createQuestionSchema), adminController.createQuestion);
router.put('/questions/:id', validate(schemas.updateQuestionSchema), adminController.updateQuestion);
router.post('/questions/import', validate(schemas.importQuestionsSchema), adminController.importQuestions);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/subscriptions', adminController.getSubscriptions);
router.get('/sms-logs', adminController.getSmsLogs);
router.get('/transactions', adminController.getTransactions);

export default router;

import express from 'express';
import { config } from './config';
import { applySecurityMiddleware } from './middleware/security.middleware';
import { globalLimiter } from './middleware/rate-limit.middleware';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

import authRoutes from './routes/auth.routes';
import quizRoutes from './routes/quiz.routes';
import subscriptionRoutes from './routes/subscription.routes';
import adminRoutes from './routes/admin.routes';
import dailyScoreRoutes from './routes/daily-score.routes';

import { startDailyScoreJob } from './jobs/daily-score.job';
import { startSubscriptionExpiryJob } from './jobs/subscription-expiry.job';
import { smsService } from './services/sms.service';
import cron from 'node-cron';

const app = express();

applySecurityMiddleware(app);
app.use(globalLimiter);

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/quiz', quizRoutes);
apiRouter.use('/subscription', subscriptionRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/daily-score', dailyScoreRoutes);

app.use('/api', apiRouter);

app.use(errorHandler);

const PORT = config.server.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.server.nodeEnv} mode`);
  
  startDailyScoreJob();
  startSubscriptionExpiryJob();
  
  // SMS retry processor every 5 mins
  cron.schedule('*/5 * * * *', () => {
    smsService.processQueue().catch(err => logger.error('SMS Queue Error', { err }));
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    process.exit(0);
  });
});

export default app;

import cron from 'node-cron';
import { config } from '../config';
import { dailyScoreService } from '../services/daily-score.service';
import { logger } from '../utils/logger';

export const startDailyScoreJob = () => {
  cron.schedule(config.cron.dailyScoreCron, async () => {
    logger.info('Running daily score job');
    const today = new Date();
    try {
      await dailyScoreService.calculateDailyScores(today);
      await dailyScoreService.sendDailyScoreNotifications(today);
    } catch (error) {
      logger.error('Error running daily score job', { error });
    }
  });
};

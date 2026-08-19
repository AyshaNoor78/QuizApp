import cron from 'node-cron';
import { subscriptionService } from '../services/subscription.service';
import { logger } from '../utils/logger';

export const startSubscriptionExpiryJob = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running subscription expiry job');
    try {
      await subscriptionService.expireSubscriptions();
    } catch (error) {
      logger.error('Error running subscription expiry job', { error });
    }
  });
};

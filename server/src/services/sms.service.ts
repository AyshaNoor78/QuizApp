import { PrismaClient } from '@prisma/client';
import { getBDAppsService } from './bdapps.service';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const bdappsService = getBDAppsService();

export class SmsService {
  async sendDailyScore(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = 'Your daily quiz score is ready! Check the app for details.';
    await prisma.smsLog.create({
      data: { userId, type: 'DAILY_SCORE', message, status: 'QUEUED' }
    });
  }

  async sendSubscriptionConfirmation(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = 'You have successfully subscribed to BDApps Quiz App!';
    await prisma.smsLog.create({
      data: { userId, type: 'SUBSCRIPTION_CONFIRM', message, status: 'QUEUED' }
    });
  }

  async sendOtp(mobileNumber: string, otp: string) {
    const message = `Your OTP for Quiz App is ${otp}. Valid for 5 minutes.`;
    const res = await bdappsService.sendSMS(mobileNumber, message);
    logger.info('OTP SMS sent', { mobileNumber, res });
  }

  async sendSubscriptionStatus(userId: string, status: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const message = `Your subscription status is now ${status}.`;
    await prisma.smsLog.create({
      data: { userId, type: 'SUBSCRIPTION_STATUS', message, status: 'QUEUED' }
    });
  }

  async processQueue() {
    const logs = await prisma.smsLog.findMany({
      where: {
        status: { in: ['QUEUED', 'FAILED'] },
        retryCount: { lt: 3 },
        OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: new Date() } }]
      }
    });

    for (const log of logs) {
      const user = await prisma.user.findUnique({ where: { id: log.userId } });
      if (!user) continue;

      try {
        const res = await bdappsService.sendSMS(user.mobileNumber, log.message);
        await prisma.smsLog.update({
          where: { id: log.id },
          data: { status: 'SENT', providerMessageId: res.messageId }
        });
      } catch (error: any) {
        const retryCount = log.retryCount + 1;
        const nextRetryAt = new Date(Date.now() + (Math.pow(2, retryCount) * 60 * 1000));
        await prisma.smsLog.update({
          where: { id: log.id },
          data: { status: 'FAILED', errorMessage: error.message, retryCount, nextRetryAt }
        });
      }
    }
  }

  async handleDeliveryStatus(messageId: string, status: 'DELIVERED' | 'FAILED') {
    await prisma.smsLog.updateMany({
      where: { providerMessageId: messageId },
      data: { status }
    });
  }
}

export const smsService = new SmsService();

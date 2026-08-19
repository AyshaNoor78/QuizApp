import { PrismaClient, Operator } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateOtp } from '../utils/helpers';
import { config } from '../config';
import { getBDAppsService } from './bdapps.service';
import { smsService } from './sms.service';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const bdappsService = getBDAppsService();

export class SubscriptionService {
  async getStatus(userId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return sub || { status: 'INACTIVE' };
  }

  async requestOtp(userId: string, mobileNumber: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.operator !== 'ROBI' && user.operator !== 'AIRTEL')) {
      throw new Error('Only ROBI and AIRTEL are supported');
    }

    const activeSub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    if (activeSub) throw new Error('User already has an active subscription');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await prisma.otpVerification.count({
      where: { userId, createdAt: { gte: oneHourAgo } },
    });

    if (recentRequests >= config.otp.maxRequestsPerHour) {
      throw new Error('Too many OTP requests. Try again later.');
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    await prisma.otpVerification.create({
      data: { userId, mobileNumber, otpHash, expiresAt },
    });

    await smsService.sendOtp(mobileNumber, otp);

    return { sent: true, expiresInSeconds: config.otp.expiryMinutes * 60 };
  }

  async verifyOtpAndSubscribe(userId: string, mobileNumber: string, otp: string) {
    const latestOtp = await prisma.otpVerification.findFirst({
      where: { userId, mobileNumber, isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestOtp) throw new Error('OTP expired or not found');

    if (latestOtp.attempts >= config.otp.maxAttempts) {
      await prisma.otpVerification.update({ where: { id: latestOtp.id }, data: { isUsed: true } });
      throw new Error('Max attempts reached. Request a new OTP.');
    }

    await prisma.otpVerification.update({
      where: { id: latestOtp.id },
      data: { attempts: latestOtp.attempts + 1 },
    });

    const isValid = await bcrypt.compare(otp, latestOtp.otpHash);
    if (!isValid) throw new Error('Invalid OTP');

    await prisma.otpVerification.update({ where: { id: latestOtp.id }, data: { isUsed: true } });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const result = await bdappsService.subscribe(mobileNumber, user.operator);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        operator: user.operator,
        status: 'ACTIVE',
        bdappsSubscriptionId: result.subscriptionId,
        productId: config.bdapps.subscriptionProductId,
        subscriptionStart: new Date(),
        subscriptionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        lastBillingDate: new Date(),
      },
    });

    await prisma.subscriptionTransaction.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        type: 'NEW',
        bdappsTransactionId: 'txn_' + Date.now(),
        amount: 2.0,
      },
    });

    await smsService.sendSubscriptionConfirmation(userId);

    return subscription;
  }

  async handleCallback(payload: any, signature: string) {
    const isValid = bdappsService.verifyCallbackSignature(payload, signature);
    if (!isValid) throw new Error('Invalid signature');

    logger.info('BDApps Callback received', { payload });
    // Process renewal, cancellation, etc., updating Subscription records.
    return { processed: true };
  }

  async cancelSubscription(userId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    if (!sub) throw new Error('No active subscription found');

    if (sub.bdappsSubscriptionId) {
      await bdappsService.unsubscribe(sub.bdappsSubscriptionId);
    }

    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.subscriptionTransaction.create({
      data: {
        subscriptionId: sub.id,
        userId,
        type: 'CANCELLATION',
      },
    });

    return { cancelled: true };
  }

  async expireSubscriptions() {
    const now = new Date();
    await prisma.subscription.updateMany({
      where: { status: 'ACTIVE', subscriptionExpiry: { lt: now } },
      data: { status: 'EXPIRED' },
    });
  }
}

export const subscriptionService = new SubscriptionService();

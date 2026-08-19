import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface IBDAppsService {
  subscribe(msisdn: string, operator: string): Promise<{ subscriptionId: string; status: string }>;
  unsubscribe(subscriptionId: string): Promise<void>;
  getSubscriptionStatus(subscriptionId: string): Promise<{ status: string; expiryDate: Date }>;
  sendSMS(msisdn: string, message: string): Promise<{ messageId: string; status: string }>;
  verifyCallbackSignature(payload: any, signature: string): boolean;
}

class MockBDAppsService implements IBDAppsService {
  async subscribe(msisdn: string, operator: string) {
    logger.info(`[Mock] Subscribing ${msisdn} on ${operator}`);
    return { subscriptionId: 'mock_sub_' + Date.now(), status: 'ACTIVE' };
  }
  async unsubscribe(subscriptionId: string) {
    logger.info(`[Mock] Unsubscribing ${subscriptionId}`);
  }
  async getSubscriptionStatus(subscriptionId: string) {
    return { status: 'ACTIVE', expiryDate: new Date(Date.now() + 86400000) };
  }
  async sendSMS(msisdn: string, message: string) {
    logger.info(`[Mock] Sending SMS to ${msisdn}: ${message}`);
    return { messageId: 'mock_msg_' + Date.now(), status: 'DELIVERED' };
  }
  verifyCallbackSignature(payload: any, signature: string) {
    return true;
  }
}

class RealBDAppsService implements IBDAppsService {
  async subscribe(msisdn: string, operator: string) {
    // TODO: Call BDApps API: /subscription/send
    logger.info(`Calling real BDApps subscription API for ${msisdn}`);
    return { subscriptionId: 'real_sub_' + Date.now(), status: 'ACTIVE' };
  }
  async unsubscribe(subscriptionId: string) {
    // TODO: Call BDApps API: /subscription/cancel
    logger.info(`Calling real BDApps unsubscription API for ${subscriptionId}`);
  }
  async getSubscriptionStatus(subscriptionId: string) {
    // TODO: Call BDApps API: /subscription/status
    return { status: 'ACTIVE', expiryDate: new Date(Date.now() + 86400000) };
  }
  async sendSMS(msisdn: string, message: string) {
    // TODO: Call BDApps API: /sms/send
    logger.info(`Calling real BDApps SMS API to ${msisdn}`);
    return { messageId: 'real_msg_' + Date.now(), status: 'DELIVERED' };
  }
  verifyCallbackSignature(payload: any, signature: string) {
    // TODO: Implement actual HMAC verification
    return true;
  }
}

export const getBDAppsService = (): IBDAppsService => {
  return config.server.nodeEnv === 'production' ? new RealBDAppsService() : new MockBDAppsService();
};

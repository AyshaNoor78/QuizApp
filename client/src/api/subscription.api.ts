import { apiClient } from './client';
import { SubscriptionStatus, OtpResponse, VerifyOtpResponse } from '../types';

export const subscriptionApi = {
  getStatus: async () => {
    const res = await apiClient.get<SubscriptionStatus>('/subscription/status');
    return res.data;
  },
  requestOtp: async () => {
    const res = await apiClient.post<OtpResponse>('/subscription/request-otp');
    return res.data;
  },
  verifyOtp: async (referenceId: string, otp: string) => {
    const res = await apiClient.post<VerifyOtpResponse>('/subscription/verify-otp', { referenceId, otp });
    return res.data;
  },
  cancel: async () => {
    const res = await apiClient.post('/subscription/cancel');
    return res.data;
  }
};

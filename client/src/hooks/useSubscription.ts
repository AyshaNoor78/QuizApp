import { useAuth } from '../contexts/AuthContext';
import { subscriptionApi } from '../api/subscription.api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const useSubscription = () => {
  const { isSubscribed, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const requestOtp = async () => {
    try {
      setIsLoading(true);
      const res = await subscriptionApi.requestOtp();
      return res.referenceId;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request OTP');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (refId: string, otp: string) => {
    try {
      setIsLoading(true);
      const res = await subscriptionApi.verifyOtp(refId, otp);
      if (res.success) {
        await refreshProfile();
        toast.success(res.message || 'Subscribed successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to verify OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubscribed,
    isLoading,
    requestOtp,
    verifyOtp
  };
};

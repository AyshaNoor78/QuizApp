import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useTranslation } from 'react-i18next';
import SubscriptionStepper from '../components/subscription/SubscriptionStepper';
import OtpInput from '../components/subscription/OtpInput';
import { Crown, ShieldCheck } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { user, isSubscribed } = useAuth();
  const { requestOtp, verifyOtp, isLoading } = useSubscription();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [refId, setRefId] = useState('');

  if (isSubscribed) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t('subscription.premiumActive')}</h2>
        <p className="text-gray-500">Your subscription is currently active.</p>
        <button onClick={() => navigate('/')} className="text-primary-600 font-bold">
          Continue Learning
        </button>
      </div>
    );
  }

  const handleSendOtp = async () => {
    const id = await requestOtp();
    if (id) {
      setRefId(id);
      setStep(2);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const success = await verifyOtp(refId, otp);
    if (success) {
      setStep(3);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 sm:px-0">
      <SubscriptionStepper currentStep={step} />

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Premium</h2>
              <p className="text-gray-500">{t('subscription.pricingNotice')}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
              <p className="font-bold text-lg text-gray-900">{user?.mobile}</p>
              <p className="text-xs text-primary-600 font-bold mt-1 uppercase">{user?.operator}</p>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors text-lg disabled:opacity-70"
            >
              {isLoading ? t('common.loading') : t('subscription.sendOtp')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('subscription.verifyOtp')}</h2>
              <p className="text-gray-500">{t('subscription.enterOtp')}</p>
              <p className="font-bold text-gray-900 mt-1">{user?.mobile}</p>
            </div>

            <OtpInput
              length={6}
              onComplete={handleVerifyOtp}
              onResend={handleSendOtp}
              isResending={isLoading}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-500">{t('subscription.successMessage')}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors text-lg"
            >
              Start Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;

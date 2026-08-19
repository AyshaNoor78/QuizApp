import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const SubscriptionBanner: React.FC = () => {
  const { isSubscribed, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) return null;

  return (
    <div className="w-full bg-white border-b border-gray-100 flex justify-center py-1.5 px-4 shadow-sm z-40">
      {isSubscribed ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {t('subscription.premiumActive')}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          {t('subscription.freeTier')}
        </span>
      )}
    </div>
  );
};

export default SubscriptionBanner;

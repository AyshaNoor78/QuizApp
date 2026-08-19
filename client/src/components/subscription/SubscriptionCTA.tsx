import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';

const SubscriptionCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-primary-50 to-emerald-100 border border-primary-200 rounded-2xl p-6 text-center shadow-sm">
      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {t('subscription.upgradePrompt')}
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        {t('subscription.pricingNotice')}
      </p>
      <Link
        to="/subscribe"
        className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
      >
        {t('subscription.subscribe')}
      </Link>
    </div>
  );
};

export default SubscriptionCTA;

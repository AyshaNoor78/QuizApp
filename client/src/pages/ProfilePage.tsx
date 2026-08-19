import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, LogOut, Settings, ShieldCheck, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, isSubscribed, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            {user.mobile} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-bold uppercase">{user.operator}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Status</h2>
        {isSubscribed ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-600 w-6 h-6" />
              <div>
                <p className="font-bold text-green-900">Premium Active</p>
                <p className="text-sm text-green-700">Auto-renews daily (৳5/day)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Crown className="text-gray-400 w-6 h-6" />
              <div>
                <p className="font-bold text-gray-700">Free Tier</p>
                <p className="text-sm text-gray-500">Limited to 3 questions per section</p>
              </div>
            </div>
            <Link to="/subscribe" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold text-sm">
              Upgrade
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-medium">
          <LogOut className="w-5 h-5" /> {t('auth.logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

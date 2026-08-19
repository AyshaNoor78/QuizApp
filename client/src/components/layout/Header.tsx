import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User as UserIcon, BookOpen, Crown } from 'lucide-react';

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('app_lang', nextLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600">
          <BookOpen className="w-6 h-6" />
          <span className="font-bold text-lg hidden sm:block">বিজ্ঞান কুইজ</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {i18n.language === 'en' ? 'বাংলা' : 'EN'}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-primary-600 hover:underline">
                  Admin
                </Link>
              )}
              {user?.isSubscribed && (
                <Crown className="w-5 h-5 text-accent-500" />
              )}
              <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center hover:bg-primary-200 transition-colors">
                <UserIcon className="w-5 h-5" />
              </Link>
              <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors p-1">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-colors">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

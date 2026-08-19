import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import OperatorSelector from '../components/auth/OperatorSelector';
import { BookOpen } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [operator, setOperator] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!operator) {
      toast.error('Please select an operator');
      return;
    }
    
    setLoading(true);
    try {
      await register({ name, mobile, operator, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-600 mb-4">
          <BookOpen className="w-12 h-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {t('auth.register')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.name')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-3 border px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.mobile')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium">
                  +880
                </span>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="pl-14 block w-full border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-3 border"
                  placeholder="18xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.operator')}
              </label>
              <p className="text-xs text-amber-600 mb-1">{t('auth.operatorNotice')}</p>
              <OperatorSelector value={operator} onChange={setOperator} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-3 border px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-3 border px-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

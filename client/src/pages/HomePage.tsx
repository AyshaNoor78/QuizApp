import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { quizApi } from '../api/quiz.api';
import { Subject } from '../types';
import SubjectCard from '../components/quiz/SubjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SubscriptionCTA from '../components/subscription/SubscriptionCTA';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isSubscribed } = useAuth();
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi.getSubjects()
      .then(setSubjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-primary-600 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 rounded-b-3xl shadow-sm text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Welcome to বিজ্ঞান কুইজ!'}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base max-w-xl">
          Master your subjects with interactive quizzes. Start learning today and prepare for your exams.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          📚 {t('quiz.subjects')}
        </h2>
        
        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {subjects.map(sub => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        )}
      </div>

      {!isSubscribed && (
        <div className="mt-12">
          <SubscriptionCTA />
        </div>
      )}
    </div>
  );
};

export default HomePage;

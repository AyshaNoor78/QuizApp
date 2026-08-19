import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quiz.api';
import { QuizResult } from '../types';
import ScoreCard from '../components/quiz/ScoreCard';
import SubscriptionCTA from '../components/subscription/SubscriptionCTA';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ArrowRight, RotateCcw } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSubscribed } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!sessionId) return;
    quizApi.getResult(sessionId)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (!result) return <div>Result not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {!isSubscribed || result.isRestricted ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h2>
            <p className="text-gray-500">{t('quiz.freeCompleted')}</p>
          </div>
          <SubscriptionCTA />
          <div className="flex justify-center">
            <button onClick={() => navigate('/')} className="text-primary-600 font-bold hover:underline">
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <ScoreCard result={result} />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(`/quiz/start?sectionId=${result.session.sectionId}`)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> {t('quiz.tryAgain')}
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
            >
              {t('quiz.nextSection')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;

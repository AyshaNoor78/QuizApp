import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../contexts/AuthContext';
import QuizQuestionCard from '../components/quiz/QuizQuestion';
import ProgressBar from '../components/quiz/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SubscriptionCTA from '../components/subscription/SubscriptionCTA';
import { useTranslation } from 'react-i18next';

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId');
  const navigate = useNavigate();
  const { isSubscribed } = useAuth();
  const { t } = useTranslation();
  
  const { session, currentQuestion, loading, feedback, startQuiz, nextQuestion, submitAnswer } = useQuiz(sectionId || undefined);
  const [questionCount, setQuestionCount] = useState(1);

  useEffect(() => {
    if (sectionId && !session && !loading) {
      startQuiz();
    }
  }, [sectionId]);

  useEffect(() => {
    if (session?.status === 'COMPLETED') {
      navigate(`/quiz/${session.id}/result`);
    }
  }, [session?.status, navigate]);

  const handleNext = () => {
    if (session) {
      setQuestionCount(c => c + 1);
      nextQuestion(session.id);
    }
  };

  const isLockedForFree = !isSubscribed && questionCount > 3;

  if (loading && !currentQuestion) {
    return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (isLockedForFree) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Limit Reached</h2>
          <p className="text-gray-500">{t('quiz.freeCompleted')}</p>
        </div>
        <SubscriptionCTA />
        <button onClick={() => navigate(-1)} className="mt-6 text-gray-500 font-semibold w-full text-center">
          Go Back
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <ProgressBar progress={(questionCount / 10) * 100} /> 
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <QuizQuestionCard
          question={currentQuestion}
          currentNumber={questionCount}
          total={10} 
          onSubmit={(opt) => submitAnswer(currentQuestion.id, opt)}
          feedback={feedback}
          isSubscribed={isSubscribed}
        />
        
        {feedback && (
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full mt-6 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors text-lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : t('common.next')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

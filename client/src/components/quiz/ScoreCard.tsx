import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuizResult } from '../../types';

interface Props {
  result: QuizResult;
}

const ScoreCard: React.FC<Props> = ({ result }) => {
  const { t } = useTranslation();
  const { percentage, correctAnswers, answeredQuestions, totalQuestions, session } = result;

  let colorClass = 'text-green-500';
  let strokeClass = 'stroke-green-500';
  if (percentage < 40) {
    colorClass = 'text-red-500';
    strokeClass = 'stroke-red-500';
  } else if (percentage < 70) {
    colorClass = 'text-amber-500';
    strokeClass = 'stroke-amber-500';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center max-w-sm mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('quiz.result')}</h3>
      
      <div className="relative flex justify-center items-center mb-8">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            className="stroke-gray-100"
            strokeWidth="12"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${colorClass}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm font-medium">Correct</p>
          <p className="text-xl font-bold text-gray-900">{correctAnswers} <span className="text-sm font-normal text-gray-400">/ {totalQuestions}</span></p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm font-medium">Score</p>
          <p className="text-xl font-bold text-gray-900">{session.score} <span className="text-sm font-normal text-gray-400">/ {session.totalMarks}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

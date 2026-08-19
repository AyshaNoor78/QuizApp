import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuizQuestion, SubmitAnswerResponse } from '../../types';
import DifficultyBadge from './DifficultyBadge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: QuizQuestion;
  currentNumber: number;
  total: number;
  onSubmit: (optionId: string) => void;
  feedback: SubmitAnswerResponse | null;
  isSubscribed: boolean;
}

const QuizQuestionCard: React.FC<Props> = ({ question, currentNumber, total, onSubmit, feedback, isSubscribed }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const lang = i18n.language;

  const text = lang === 'en' ? question.textEn : question.textBn;
  const options = [
    { id: 'A', text: lang === 'en' ? question.optionAEn : question.optionABn },
    { id: 'B', text: lang === 'en' ? question.optionBEn : question.optionBBn },
    { id: 'C', text: lang === 'en' ? question.optionCEn : question.optionCBn },
    { id: 'D', text: lang === 'en' ? question.optionDEn : question.optionDBn },
  ];

  const handleSelect = (id: string) => {
    if (feedback || !isSubscribed && selected) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  // Reset selected when question changes
  React.useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const getOptionStyle = (optId: string) => {
    if (!feedback) {
      return selected === optId 
        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
        : 'border-gray-200 bg-white hover:border-gray-300';
    }

    if (!isSubscribed) {
       return selected === optId ? 'border-primary-500 bg-primary-50 opacity-70' : 'border-gray-200 opacity-50';
    }

    if (optId === feedback.correctOption) {
      return 'border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500';
    }
    if (selected === optId && !feedback.isCorrect) {
      return 'border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500';
    }
    return 'border-gray-200 opacity-50';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-500">
          {t('quiz.question')} {currentNumber} {t('quiz.of')} {total}
        </span>
        <div className="flex gap-2">
           <DifficultyBadge difficulty={question.difficulty} />
           <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{question.marks} Pts</span>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 leading-snug">
        {text}
      </h2>

      <div className="space-y-3 mb-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={!!feedback}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${getOptionStyle(opt.id)}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                 selected === opt.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {opt.id}
              </span>
              <span className="text-base font-medium">{opt.text}</span>
            </div>
            {feedback && isSubscribed && opt.id === feedback.correctOption && (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            )}
            {feedback && isSubscribed && selected === opt.id && !feedback.isCorrect && (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </button>
        ))}
      </div>

      {!feedback ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-lg"
        >
          {t('common.submit')}
        </button>
      ) : (
        isSubscribed && (feedback.explanationEn || feedback.explanationBn) && (
          <div className={`p-4 rounded-xl border ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className="font-bold flex items-center gap-2 mb-2">
               {feedback.isCorrect ? (
                 <><CheckCircle2 className="w-5 h-5 text-green-600"/> <span className="text-green-800">{t('quiz.correct')}</span></>
               ) : (
                 <><XCircle className="w-5 h-5 text-red-600"/> <span className="text-red-800">{t('quiz.incorrect')}</span></>
               )}
            </h4>
            <p className="text-sm text-gray-700">
              <strong>{t('quiz.explanation')}:</strong> {lang === 'en' ? feedback.explanationEn : feedback.explanationBn}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default QuizQuestionCard;

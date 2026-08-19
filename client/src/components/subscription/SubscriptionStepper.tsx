import React from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  currentStep: number;
}

const SubscriptionStepper: React.FC<Props> = ({ currentStep }) => {
  const { t } = useTranslation();
  
  const steps = [
    { num: 1, label: t('subscription.step1') },
    { num: 2, label: t('subscription.step2') },
    { num: 3, label: t('subscription.step3') }
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-xs mx-auto mb-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full" />
      <div 
        className="absolute top-1/2 left-0 h-1 bg-primary-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
      />
      
      {steps.map((step) => {
        const isCompleted = step.num < currentStep;
        const isActive = step.num === currentStep;
        
        return (
          <div key={step.num} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                isCompleted ? 'bg-primary-500 text-white' : 
                isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
                'bg-gray-200 text-gray-500'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : step.num}
            </div>
            <span className={`text-xs mt-2 font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionStepper;

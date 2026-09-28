import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  'CHALLENGE',
  'DISCOVERY',
  'EVALUATION',
  'PILOT',
  'VALIDATION',
  'SCALE'
];

const LifecycleIndicator = ({ currentStep }: { currentStep: string }) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="mb-6 flex items-center text-[13px]">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center">
              {isCompleted ? (
                <div className="flex items-center text-[#1F3A5F]">
                  <Check size={14} className="mr-1" />
                  <span className="font-medium">{step}</span>
                </div>
              ) : isCurrent ? (
                <div className="flex items-center text-slate-800 font-bold border-b-2 border-slate-800 pb-0.5">
                  {step}
                </div>
              ) : (
                <div className="flex items-center text-slate-400 font-medium">
                  {step}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="mx-3 text-slate-300 font-bold">&gt;</div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LifecycleIndicator;

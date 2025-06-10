import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: number[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2
              ${
                currentStep > step
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : currentStep === step
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-400 text-gray-400'
              }
            `}
          >
            {currentStep > step ? (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="font-semibold">{step}</span>
            )}
          </div>
          {index !== steps.length - 1 && (
            <div className={`flex-1 h-0.5 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-400'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;

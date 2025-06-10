import { useState } from 'react';
import Stepper from '../Product/Component/Stepper';
import TiffinInfo from './TiffinInfo';
import Items from './Items';

const Tiffin = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [1, 2];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <TiffinInfo />;
      case 2:
        return <Items />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full mb-8">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>

      <div className="w-full">{renderStepContent(currentStep)}</div>

      {/* Example: Buttons to move between steps */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tiffin;

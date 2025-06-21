
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface NavigationControlsProps {
  currentStep: number;
  stepsLength: number;
  prevStep: () => void;
  nextStep: () => void;
  handleSubmit: () => void;
  isNextDisabled: boolean;
  onTransitionNext?: () => void;
  onTransitionPrev?: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  stepsLength,
  prevStep,
  nextStep,
  handleSubmit,
  isNextDisabled,
  onTransitionNext,
  onTransitionPrev
}) => {
  const handleNextClick = () => {
    if (onTransitionNext) {
      onTransitionNext();
    } else {
      nextStep();
    }
  };

  const handlePrevClick = () => {
    if (onTransitionPrev) {
      onTransitionPrev();
    } else {
      prevStep();
    }
  };

  const handleSubmitClick = () => {
    if (onTransitionNext) {
      onTransitionNext();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-between mt-6">
      <Button 
        onClick={handlePrevClick} 
        disabled={currentStep === 0} 
        variant="ghost" 
        className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm"
      >
        <ArrowUp className="mr-2 h-4 w-4" /> Back
      </Button>
      {currentStep === stepsLength - 1 ? (
        <Button onClick={handleSubmitClick} disabled={isNextDisabled} className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm">
          Create Recipe <Zap className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={handleNextClick} disabled={isNextDisabled} className="px-6 bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm">
          Continue <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default NavigationControls;

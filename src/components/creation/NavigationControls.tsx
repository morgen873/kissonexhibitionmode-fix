
import React from 'react';
import { Button } from "@/components/ui/button";
import { Zap } from 'lucide-react';

interface NavigationControlsProps {
  currentStep: number;
  stepsLength: number;
  prevStep: () => void;
  nextStep: () => void;
  handleSubmit: () => void;
  isNextDisabled: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  stepsLength,
  prevStep,
  nextStep,
  handleSubmit,
  isNextDisabled
}) => {
  const handleNextClick = () => {
    console.log('NavigationControls: Next button clicked');
    nextStep();
  };

  const handlePrevClick = () => {
    console.log('NavigationControls: Previous button clicked');
    prevStep();
  };

  const handleSubmitClick = () => {
    console.log('NavigationControls: Submit button clicked');
    handleSubmit();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 sm:gap-0 w-full">
      <Button 
        onClick={handlePrevClick} 
        disabled={currentStep === 0} 
        variant="ghost" 
        className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm w-full sm:w-auto order-2 sm:order-1"
      >
        Back
      </Button>
      
      {currentStep === stepsLength - 1 ? (
        <Button 
          onClick={handleSubmitClick} 
          disabled={isNextDisabled} 
          className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-2"
        >
          Create Recipe <Zap className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={handleNextClick} 
          disabled={isNextDisabled} 
          className="px-6 bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-2"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default NavigationControls;

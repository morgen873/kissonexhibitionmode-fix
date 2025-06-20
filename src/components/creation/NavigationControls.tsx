
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
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  stepsLength,
  prevStep,
  nextStep,
  handleSubmit,
  isNextDisabled
}) => {
  return (
    <div className="flex justify-between mt-8 my-[30px]">
      <Button 
        onClick={prevStep} 
        disabled={currentStep === 0} 
        variant="ghost" 
        className="text-foreground hover:bg-muted/50 disabled:opacity-50 border border-border/30"
      >
        <ArrowUp className="mr-2" /> Back
      </Button>
      {currentStep === stepsLength - 1 ? (
        <Button 
          onClick={handleSubmit} 
          disabled={isNextDisabled}
          className="bg-foreground text-background hover:bg-foreground/90 border border-foreground"
        >
          Create Recipe <Zap className="ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={nextStep} 
          disabled={isNextDisabled} 
          className="py-0 px-[30px] bg-foreground text-background hover:bg-foreground/90 border border-foreground"
        >
          Continue <ArrowDown className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default NavigationControls;

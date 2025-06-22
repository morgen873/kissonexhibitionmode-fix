
import React from 'react';
import { Loader2 } from 'lucide-react';
import IntroStepContent from '@/components/creation/IntroStepContent';
import IntroNavigation from '@/components/creation/IntroNavigation';
import CreationMainContent from '@/components/creation/CreationMainContent';
import NavigationControls from '@/components/creation/NavigationControls';
import RecipeResultScreen from '@/components/creation/RecipeResultScreen';
import { introSteps } from "@/data/introSteps";
import { steps } from '@/data/creation';

interface CreationContentProps {
  isCreatingRecipe: boolean;
  recipeResult: any;
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStep: number;
  creationStepData: any;
  answers: { [key: number]: string };
  customAnswers: { [key: number]: string };
  controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
  theme: any;
  isNextDisabled: boolean;
  onAnswerSelect: (optionTitle: string) => void;
  onCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTemperatureChange: (value: number) => void;
  onShapeChange: (value: number) => void;
  onFlavorChange: (value: number) => void;
  onEnhancerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  nextIntroStep: () => void;
  prevIntroStep: () => void;
  prevCreationStep: () => void;
  nextCreationStep: () => void;
  handleSubmit: () => void;
  handleReset: () => void;
  handleIntroNext: () => void;
  handleIntroPrev: () => void;
  handleCreationNext: () => void;
  handleCreationPrev: () => void;
  handleCreationSubmit: () => void;
}

const CreationContent: React.FC<CreationContentProps> = ({
  isCreatingRecipe,
  recipeResult,
  hasStartedCreation,
  currentIntroStep,
  creationStep,
  creationStepData,
  answers,
  customAnswers,
  controlValues,
  theme,
  isNextDisabled,
  onAnswerSelect,
  onCustomAnswerChange,
  onTemperatureChange,
  onShapeChange,
  onFlavorChange,
  onEnhancerChange,
  nextIntroStep,
  prevIntroStep,
  prevCreationStep,
  nextCreationStep,
  handleSubmit,
  handleReset,
  handleIntroNext,
  handleIntroPrev,
  handleCreationNext,
  handleCreationPrev,
  handleCreationSubmit
}) => {
  if (isCreatingRecipe) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="text-lg font-semibold text-white/80 font-mono">Creating your recipe...</p>
      </div>
    );
  }

  if (recipeResult) {
    return <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />;
  }

  return (
    <div className="transition-opacity duration-300">
      {!hasStartedCreation ? (
        <IntroStepContent 
          step={introSteps[currentIntroStep]} 
          onNext={nextIntroStep}
        />
      ) : (
        <CreationMainContent
          stepData={creationStepData}
          answers={answers}
          customAnswers={customAnswers}
          controlValues={controlValues}
          theme={theme}
          onAnswerSelect={onAnswerSelect}
          onCustomAnswerChange={onCustomAnswerChange}
          onTemperatureChange={onTemperatureChange}
          onShapeChange={onShapeChange}
          onFlavorChange={onFlavorChange}
          onEnhancerChange={onEnhancerChange}
        />
      )}
      
      {/* Navigation Controls */}
      {!hasStartedCreation ? (
        introSteps[currentIntroStep].type !== 'hero' && (
          <IntroNavigation
            currentStep={currentIntroStep}
            totalSteps={4}
            onPrev={prevIntroStep}
            onNext={nextIntroStep}
            onTransitionPrev={handleIntroPrev}
            onTransitionNext={handleIntroNext}
            isFirstStep={currentIntroStep === 0}
            isLastStep={currentIntroStep === introSteps.length - 1}
            buttonText={introSteps[currentIntroStep].buttonText}
          />
        )
      ) : (
        <NavigationControls 
          currentStep={creationStep} 
          stepsLength={steps.length} 
          prevStep={prevCreationStep} 
          nextStep={nextCreationStep} 
          handleSubmit={handleSubmit}
          onTransitionNext={creationStep === steps.length - 1 ? handleCreationSubmit : handleCreationNext}
          onTransitionPrev={handleCreationPrev}
          isNextDisabled={isNextDisabled} 
        />
      )}
    </div>
  );
};

export default CreationContent;

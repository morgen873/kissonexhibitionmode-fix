
import React from 'react';
import { Loader2 } from 'lucide-react';
import IntroStepContent from '@/components/creation/IntroStepContent';
import IntroNavigation from '@/components/creation/IntroNavigation';
import CreationMainContent from '@/components/creation/CreationMainContent';
import NavigationControls from '@/components/creation/NavigationControls';
import RecipeResultScreen from '@/components/creation/RecipeResultScreen';
import { introSteps } from "@/data/introSteps";
import { steps } from '@/data/creation';
import { CreationContentHandlers, CreationContentState, CreationContentNavigation } from '@/types/creationTypes';

interface CreationContentProps extends CreationContentHandlers, CreationContentState, CreationContentNavigation {
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStep: number;
  creationStepData: any;
  theme: any;
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
  handleReset
}) => {
  if (isCreatingRecipe) {
    return (
      <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-4 px-4">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-white" />
        <p className="text-base sm:text-lg font-semibold text-white/80 font-mono text-center max-w-xs sm:max-w-md leading-relaxed">
          We are making your KissOn recipe, please be patient, because memories last forever...
        </p>
      </div>
    );
  }

  if (recipeResult) {
    return <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />;
  }

  // Check if current step should hide navigation (question or timeline steps)
  const shouldHideNavigation = hasStartedCreation && 
    creationStepData && 
    (creationStepData.type === 'question' || creationStepData.type === 'timeline');

  return (
    <div className="transition-opacity duration-300 w-full">
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
          onAutoAdvance={nextCreationStep}
        />
      )}
      
      {/* Navigation Controls - Hidden for question and timeline steps */}
      {!shouldHideNavigation && (
        <>
          {!hasStartedCreation ? (
            introSteps[currentIntroStep].type !== 'hero' && (
              <IntroNavigation
                currentStep={currentIntroStep}
                totalSteps={4}
                onPrev={prevIntroStep}
                onNext={nextIntroStep}
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
              isNextDisabled={isNextDisabled} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreationContent;

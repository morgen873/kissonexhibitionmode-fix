
import React from 'react';
import { steps } from '@/data/creation';
import { introSteps } from "@/data/introSteps";
import IntroNavigation from './IntroNavigation';
import NavigationControls from './NavigationControls';

interface CreationNavigationProps {
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStep: number;
  isNextDisabled: boolean;
  isCreatingRecipe: boolean;
  recipeResult: any;
  onIntroNext: () => void;
  onIntroPrev: () => void;
  onIntroTransitionNext: () => void;
  onIntroTransitionPrev: () => void;
  onCreationNext: () => void;
  onCreationPrev: () => void;
  onCreationTransitionNext: () => void;
  onCreationTransitionPrev: () => void;
  onCreationSubmit: () => void;
}

const CreationNavigation: React.FC<CreationNavigationProps> = ({
  hasStartedCreation,
  currentIntroStep,
  creationStep,
  isNextDisabled,
  isCreatingRecipe,
  recipeResult,
  onIntroNext,
  onIntroPrev,
  onIntroTransitionNext,
  onIntroTransitionPrev,
  onCreationNext,
  onCreationPrev,
  onCreationTransitionNext,
  onCreationTransitionPrev,
  onCreationSubmit
}) => {
  // Don't show navigation during recipe creation or when showing results
  if (isCreatingRecipe || recipeResult) {
    return null;
  }

  if (!hasStartedCreation) {
    // Only show navigation for non-hero intro steps
    if (introSteps[currentIntroStep].type === 'hero') {
      return null;
    }

    return (
      <IntroNavigation
        currentStep={currentIntroStep}
        totalSteps={4}
        onPrev={onIntroPrev}
        onNext={onIntroNext}
        onTransitionPrev={onIntroTransitionPrev}
        onTransitionNext={onIntroTransitionNext}
        isFirstStep={currentIntroStep === 0}
        isLastStep={currentIntroStep === introSteps.length - 1}
        buttonText={introSteps[currentIntroStep].buttonText}
      />
    );
  }

  return (
    <NavigationControls 
      currentStep={creationStep} 
      stepsLength={steps.length} 
      prevStep={onCreationPrev} 
      nextStep={onCreationNext} 
      handleSubmit={onCreationSubmit}
      onTransitionNext={creationStep === steps.length - 1 ? onCreationSubmit : onCreationTransitionNext}
      onTransitionPrev={onCreationTransitionPrev}
      isNextDisabled={isNextDisabled} 
    />
  );
};

export default CreationNavigation;

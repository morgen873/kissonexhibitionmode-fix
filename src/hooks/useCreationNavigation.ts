import { useState } from 'react';
import { introSteps } from "@/data/introSteps";

interface UseCreationNavigationProps {
  nextCreationStep: () => void;
  prevCreationStep: () => void;
  handleSubmit: () => void;
}

export const useCreationNavigation = ({
  nextCreationStep,
  prevCreationStep,
  handleSubmit
}: UseCreationNavigationProps) => {
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  // Simple navigation handlers without transitions
  const handleIntroNext = () => {
    if (currentIntroStep < introSteps.length - 1) {
      setCurrentIntroStep(currentIntroStep + 1);
    } else {
      setHasStartedCreation(true);
    }
  };

  const handleIntroPrev = () => {
    if (currentIntroStep > 0) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  const handleCreationNext = () => {
    nextCreationStep();
  };

  const handleCreationPrev = () => {
    prevCreationStep();
  };

  const handleCreationSubmit = () => {
    handleSubmit();
  };

  // Reset navigation to hero page
  const resetNavigation = () => {
    setCurrentIntroStep(0);
    setHasStartedCreation(false);
  };

  // Keep the same interface for backward compatibility
  const nextIntroStep = () => {
    if (currentIntroStep < introSteps.length - 1) {
      setCurrentIntroStep(currentIntroStep + 1);
    } else {
      setHasStartedCreation(true);
    }
  };

  const prevIntroStep = () => {
    if (currentIntroStep > 0) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  return {
    currentIntroStep,
    hasStartedCreation,
    isTransitioning: false, // Always false now
    transitionDirection: 'forward' as const,
    transitionVariant: 'geometric' as const,
    completeTransition: () => {}, // No-op function
    handleIntroNext,
    handleIntroPrev,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit,
    nextIntroStep,
    prevIntroStep,
    resetNavigation
  };
};

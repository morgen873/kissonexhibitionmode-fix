
import { useState } from 'react';
import { useTransition } from '@/hooks/useTransition';
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
  const { isTransitioning, transitionDirection, startTransition, completeTransition } = useTransition();
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  // Transition handlers for intro steps
  const handleIntroNext = () => {
    startTransition('forward', () => {
      if (currentIntroStep < introSteps.length - 1) {
        setCurrentIntroStep(currentIntroStep + 1);
      } else {
        setHasStartedCreation(true);
      }
    });
  };

  const handleIntroPrev = () => {
    startTransition('backward', () => {
      if (currentIntroStep > 0) {
        setCurrentIntroStep(currentIntroStep - 1);
      }
    });
  };

  // Transition handlers for creation steps
  const handleCreationNext = () => {
    startTransition('forward', () => {
      nextCreationStep();
    });
  };

  const handleCreationPrev = () => {
    startTransition('backward', () => {
      prevCreationStep();
    });
  };

  const handleCreationSubmit = () => {
    startTransition('forward', () => {
      handleSubmit();
    });
  };

  // Regular non-transition handlers
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
    isTransitioning,
    transitionDirection,
    completeTransition,
    handleIntroNext,
    handleIntroPrev,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit,
    nextIntroStep,
    prevIntroStep
  };
};

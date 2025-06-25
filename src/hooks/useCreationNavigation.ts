
import { useState } from 'react';
import { useEnhancedTransition } from '@/hooks/useEnhancedTransition';
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
  const { isTransitioning, transitionConfig, startTransition, completeTransition } = useEnhancedTransition();
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  // Transition handlers for intro steps
  const handleIntroNext = () => {
    startTransition(() => {
      if (currentIntroStep < introSteps.length - 1) {
        setCurrentIntroStep(currentIntroStep + 1);
      } else {
        setHasStartedCreation(true);
      }
    }, {
      variant: 'geometric',
      direction: 'forward'
    });
  };

  const handleIntroPrev = () => {
    startTransition(() => {
      if (currentIntroStep > 0) {
        setCurrentIntroStep(currentIntroStep - 1);
      }
    }, {
      variant: 'geometric',
      direction: 'backward'
    });
  };

  // Transition handlers for creation steps
  const handleCreationNext = () => {
    startTransition(() => {
      nextCreationStep();
    }, {
      variant: 'particle',
      direction: 'forward'
    });
  };

  const handleCreationPrev = () => {
    startTransition(() => {
      prevCreationStep();
    }, {
      variant: 'wave',
      direction: 'backward'
    });
  };

  const handleCreationSubmit = () => {
    startTransition(() => {
      handleSubmit();
    }, {
      variant: 'loading',
      direction: 'forward',
      duration: 1500
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
    transitionDirection: transitionConfig.direction || 'forward',
    transitionVariant: transitionConfig.variant || 'geometric',
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


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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionGifUrl, setTransitionGifUrl] = useState<string>('');

  // Simple navigation handlers with transition support
  const handleIntroNext = (gifUrl?: string) => {
    if (gifUrl) {
      setTransitionGifUrl(gifUrl);
      setIsTransitioning(true);
    } else {
      proceedToNextIntroStep();
    }
  };

  const proceedToNextIntroStep = () => {
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

  const handleCreationNext = (gifUrl?: string) => {
    if (gifUrl) {
      setTransitionGifUrl(gifUrl);
      setIsTransitioning(true);
    } else {
      nextCreationStep();
    }
  };

  const handleCreationPrev = () => {
    prevCreationStep();
  };

  const handleCreationSubmit = () => {
    handleSubmit();
  };

  const completeTransition = () => {
    setIsTransitioning(false);
    setTransitionGifUrl('');
    
    // Complete the actual navigation step
    if (hasStartedCreation) {
      nextCreationStep();
    } else {
      proceedToNextIntroStep();
    }
  };

  // Reset navigation to hero page
  const resetNavigation = () => {
    setCurrentIntroStep(0);
    setHasStartedCreation(false);
    setIsTransitioning(false);
    setTransitionGifUrl('');
  };

  // Keep the same interface for backward compatibility
  const nextIntroStep = (gifUrl?: string) => {
    handleIntroNext(gifUrl);
  };

  const prevIntroStep = () => {
    handleIntroPrev();
  };

  return {
    currentIntroStep,
    hasStartedCreation,
    isTransitioning,
    transitionGifUrl,
    transitionDirection: 'forward' as const,
    transitionVariant: 'minimal' as const, // Changed from 'gif' to 'minimal'
    completeTransition,
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

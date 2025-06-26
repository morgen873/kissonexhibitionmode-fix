
import { useState } from 'react';
import { introSteps } from "@/data/introSteps";

interface UseCreationNavigationProps {
  nextCreationStep: () => void;
  prevCreationStep: () => void;
  handleSubmit: () => void;
  currentCreationStep?: number; // Add current step to get transition GIF
}

// GIF mappings for specific transitions
const getTransitionGif = (fromStep: number, isIntro: boolean, hasStartedCreation: boolean): string | undefined => {
  if (isIntro) {
    // Intro step transitions
    if (fromStep === 0) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/stove-top-cooking.gif";
    if (fromStep === 1) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/open-food.gif";
    if (fromStep === 2) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/making-dumplings.gif";
    if (fromStep === 3) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/dumpling-boiling.gif";
  } else if (hasStartedCreation) {
    // Creation step transitions  
    if (fromStep === 1) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/open-food.gif";
    if (fromStep === 3) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/making-dumplings.gif";
    if (fromStep === 4) return "https://ncvgpkzguvlypyxhfnuk.supabase.co/storage/v1/object/public/video-bucket/dumpling-boiling.gif";
  }
  return undefined;
};

export const useCreationNavigation = ({
  nextCreationStep,
  prevCreationStep,
  handleSubmit,
  currentCreationStep = 0
}: UseCreationNavigationProps) => {
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionGifUrl, setTransitionGifUrl] = useState<string>('');

  // Enhanced navigation handlers with GIF transition support
  const handleIntroNext = () => {
    const gifUrl = getTransitionGif(currentIntroStep, true, hasStartedCreation);
    
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

  // Updated to use the current creation step from props instead of parameter
  const handleCreationNext = () => {
    const gifUrl = getTransitionGif(currentCreationStep, false, hasStartedCreation);
    
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

  // Reset navigation to standby page
  const resetNavigation = () => {
    setCurrentIntroStep(0);
    setHasStartedCreation(false);
    setIsTransitioning(false);
    setTransitionGifUrl('');
  };

  // Backward compatibility methods
  const nextIntroStep = () => {
    handleIntroNext();
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
    transitionVariant: 'loading' as const,
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

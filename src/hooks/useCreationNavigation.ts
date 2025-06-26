
import { useState } from 'react';
import { introSteps } from "@/data/introSteps";
import { steps } from '@/data/creation';

interface UseCreationNavigationProps {
  nextCreationStep: () => void;
  prevCreationStep: () => void;
  handleSubmit: () => void;
  currentCreationStep?: number;
}

// GIF mappings for specific transitions
const getTransitionGif = (fromStep: number, isIntro: boolean, hasStartedCreation: boolean): string | undefined => {
  console.log('Getting transition GIF for:', { fromStep, isIntro, hasStartedCreation });
  
  if (isIntro) {
    // Intro step transitions (now starting from step 1, not 0)
    if (fromStep === 4) { // Quote Step -> Creation begins
      console.log('Returning 3d-kisson GIF for quote step transition');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//3d-kisson.gif";
    }
  } else if (hasStartedCreation) {
    // Creation step transitions
    if (fromStep === 1) { // Memory Question step
      console.log('Returning 01step GIF for creation step 1');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//01step.gif";
    }
    if (fromStep === 3) { // Emotional Ingredients step
      console.log('Returning 02step GIF for creation step 3');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//02step.gif";
    }
    if (fromStep === 5) { // Dedication Question step
      console.log('Returning 03step GIF for creation step 5');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//03step.gif";
    }
    if (fromStep === 6) { // Controls Step
      console.log('Returning 04step GIF for creation step 6');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//04step.gif";
    }
    if (fromStep === 7) { // Timeline Selection step - final step
      console.log('Returning 05step GIF for final timeline step');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//05step.gif";
    }
  }
  
  console.log('No GIF found for transition');
  return undefined;
};

export const useCreationNavigation = ({
  nextCreationStep,
  prevCreationStep,
  handleSubmit,
  currentCreationStep = 0
}: UseCreationNavigationProps) => {
  // Start intro at step 1 instead of 0 (skipping hero step)
  const [currentIntroStep, setCurrentIntroStep] = useState(1);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionGifUrl, setTransitionGifUrl] = useState<string>('');

  // Enhanced navigation handlers with GIF transition support
  const handleIntroNext = () => {
    console.log('HandleIntroNext called for step:', currentIntroStep);
    const gifUrl = getTransitionGif(currentIntroStep, true, hasStartedCreation);
    
    if (gifUrl) {
      console.log('Starting GIF transition with URL:', gifUrl);
      setTransitionGifUrl(gifUrl);
      setIsTransitioning(true);
    } else {
      console.log('No GIF for this transition, proceeding directly');
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
    // Don't allow going back to step 0 (hero step)
    if (currentIntroStep > 1) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  const handleCreationNext = () => {
    console.log('HandleCreationNext called for step:', currentCreationStep);
    
    // Check if we're at the last step (timeline step)
    if (currentCreationStep >= steps.length - 1) {
      console.log('At final step, triggering submission instead of next step');
      const gifUrl = getTransitionGif(currentCreationStep, false, hasStartedCreation);
      
      if (gifUrl) {
        console.log('Starting final GIF transition with URL:', gifUrl);
        setTransitionGifUrl(gifUrl);
        setIsTransitioning(true);
      } else {
        console.log('No final GIF, submitting directly');
        handleSubmit();
      }
      return;
    }
    
    const gifUrl = getTransitionGif(currentCreationStep, false, hasStartedCreation);
    
    if (gifUrl) {
      console.log('Starting GIF transition with URL:', gifUrl);
      setTransitionGifUrl(gifUrl);
      setIsTransitioning(true);
    } else {
      console.log('No GIF for this transition, proceeding directly');
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
    console.log('Completing transition');
    setIsTransitioning(false);
    setTransitionGifUrl('');
    
    // Complete the actual navigation step
    if (hasStartedCreation) {
      // Check if we were at the final step
      if (currentCreationStep >= steps.length - 1) {
        console.log('Final transition completed, submitting recipe');
        handleSubmit();
      } else {
        nextCreationStep();
      }
    } else {
      proceedToNextIntroStep();
    }
  };

  // Reset navigation to standby page
  const resetNavigation = () => {
    setCurrentIntroStep(1); // Reset to step 1 instead of 0
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


import { useState } from 'react';
import { introSteps } from "@/data/introSteps";
import { steps } from '@/data/creation';

interface UseCreationNavigationProps {
  nextCreationStep: () => void;
  prevCreationStep: () => void;
  handleSubmit: (timelineValue?: string) => void; // Updated to accept optional timeline value
  currentCreationStep?: number;
}

// Media file mappings for specific transitions (GIFs and MP4s)
const getTransitionMedia = (fromStep: number, isIntro: boolean, hasStartedCreation: boolean): string | undefined => {
  console.log('Getting transition media for:', { fromStep, isIntro, hasStartedCreation });
  
  if (isIntro) {
    // Intro step transitions (now starting from step 1, not 0)
    if (fromStep === 4) { // Quote Step -> Creation begins
      console.log('Returning 3d-kisson media for quote step transition');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/3d-kisson.mp4";
    }
  } else if (hasStartedCreation) {
    // Creation step transitions
    if (fromStep === 1) { // Memory Question step
      console.log('Returning 01step media for creation step 1');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/01step.mp4";
    }
    if (fromStep === 3) { // Emotional Ingredients step
      console.log('Returning 02step media for creation step 3');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/02step.mp4";
    }
    if (fromStep === 5) { // Dedication Question step
      console.log('Returning 03step media for creation step 5');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/03step.mp4";
    }
    if (fromStep === 6) { // Controls Step
      console.log('Returning 04step media for creation step 6');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/04step.mp4";
    }
    if (fromStep === 7) { // Timeline Selection step - final step
      console.log('Returning 05step media for final timeline step');
      return "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/05step.mp4";
    }
  }
  
  console.log('No media found for transition');
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
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Enhanced navigation handlers with media transition support
  const handleIntroNext = () => {
    console.log('HandleIntroNext called for step:', currentIntroStep);
    const mediaUrl = getTransitionMedia(currentIntroStep, true, hasStartedCreation);
    
    if (mediaUrl) {
      console.log('Starting transition with URL:', mediaUrl);
      setTransitionGifUrl(mediaUrl);
      setIsTransitioning(true);
    } else {
      console.log('No media for this transition, proceeding directly');
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
    
    // Check if we're at the last step (timeline step) - but don't submit yet
    if (currentCreationStep >= steps.length - 1) {
      console.log('At timeline step - this should be handled by timeline selection, not navigation');
      return; // Let the timeline handle its own submission
    }
    
    const mediaUrl = getTransitionMedia(currentCreationStep, false, hasStartedCreation);
    
    if (mediaUrl) {
      console.log('Starting transition with URL:', mediaUrl);
      setTransitionGifUrl(mediaUrl);
      setIsTransitioning(true);
    } else {
      console.log('No media for this transition, proceeding directly');
      nextCreationStep();
    }
  };

  const handleCreationPrev = () => {
    prevCreationStep();
  };

  // This is called specifically by the timeline selection
  const handleTimelineSubmission = (timelineValue?: string) => {
    console.log('Timeline selection completed, starting final submission with value:', timelineValue);
    
    const mediaUrl = getTransitionMedia(currentCreationStep, false, hasStartedCreation);
    
    if (mediaUrl) {
      console.log('Starting final transition with URL:', mediaUrl);
      setTransitionGifUrl(mediaUrl);
      setIsTransitioning(true);
      setPendingSubmission(true);
      // Pass the timeline value directly to handleSubmit
      setTimeout(() => {
        handleSubmit(timelineValue);
      }, 100);
    } else {
      console.log('No final media, submitting directly');
      // Pass the timeline value directly to handleSubmit
      setTimeout(() => {
        handleSubmit(timelineValue);
      }, 100);
    }
  };

  const handleCreationSubmit = () => {
    handleSubmit();
  };

  const completeTransition = () => {
    console.log('Completing transition, pendingSubmission:', pendingSubmission);
    setIsTransitioning(false);
    setTransitionGifUrl('');
    
    // Complete the actual navigation step
    if (hasStartedCreation) {
      // Check if we were at the final step with pending submission
      if (pendingSubmission) {
        console.log('Final transition completed, recipe submission should be in progress');
        setPendingSubmission(false);
        // Don't call handleSubmit again - it was already called
        // Don't advance step - we're done with navigation
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
    setPendingSubmission(false);
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
    handleTimelineSubmission, // New method for timeline-specific submission
    nextIntroStep,
    prevIntroStep,
    resetNavigation
  };
};

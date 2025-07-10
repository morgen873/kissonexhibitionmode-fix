import { useState } from 'react';
import { introSteps } from "@/data/introSteps";
import { steps } from '@/data/creation';

interface UseVideoNavigationProps {
  nextCreationStep: () => void;
  prevCreationStep: () => void;
  handleSubmit: () => void;
  currentCreationStep?: number;
}

// Default fallback URLs if dynamic loading fails
const DEFAULT_TRANSITION_VIDEOS = {
  intro: {
    4: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/3d-kisson.mp4",
  },
  creation: {
    1: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/01step.mp4",
    3: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/02step.mp4",
    5: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/03step.mp4",
    6: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/04step.mp4",
    7: "https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos/05step.mp4",
  }
};

// Video mappings for specific transitions
const getTransitionVideo = (
  fromStep: number, 
  isIntro: boolean, 
  hasStartedCreation: boolean
): string | undefined => {
  console.log('Getting transition video for:', { fromStep, isIntro, hasStartedCreation });
  
  if (isIntro) {
    // Intro step transitions
    if (fromStep === 4) { // Quote Step -> Creation begins
      return DEFAULT_TRANSITION_VIDEOS.intro[fromStep as keyof typeof DEFAULT_TRANSITION_VIDEOS.intro];
    }
  } else if (hasStartedCreation) {
    // Creation step transitions
    return DEFAULT_TRANSITION_VIDEOS.creation[fromStep as keyof typeof DEFAULT_TRANSITION_VIDEOS.creation];
  }
  
  console.log('No video found for transition');
  return undefined;
};

export const useVideoNavigation = ({
  nextCreationStep,
  prevCreationStep,
  handleSubmit,
  currentCreationStep = 0
}: UseVideoNavigationProps) => {
  // Start intro at step 1 instead of 0 (skipping hero step)
  const [currentIntroStep, setCurrentIntroStep] = useState(1);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionVideoUrl, setTransitionVideoUrl] = useState<string>('');
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Enhanced navigation handlers with video transition support
  const handleIntroNext = () => {
    console.log('HandleIntroNext called for step:', currentIntroStep);
    const videoUrl = getTransitionVideo(currentIntroStep, true, hasStartedCreation);
    
    if (videoUrl) {
      console.log('Starting video transition with URL:', videoUrl);
      setTransitionVideoUrl(videoUrl);
      setIsTransitioning(true);
    } else {
      console.log('No video for this transition, proceeding directly');
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
    
    const videoUrl = getTransitionVideo(currentCreationStep, false, hasStartedCreation);
    
    if (videoUrl) {
      console.log('Starting video transition with URL:', videoUrl);
      setTransitionVideoUrl(videoUrl);
      setIsTransitioning(true);
    } else {
      console.log('No video for this transition, proceeding directly');
      nextCreationStep();
    }
  };

  const handleCreationPrev = () => {
    prevCreationStep();
  };

  // This is called specifically by the timeline selection
  const handleTimelineSubmission = () => {
    console.log('Timeline selection completed, starting final submission');
    
    const videoUrl = getTransitionVideo(currentCreationStep, false, hasStartedCreation);
    
    if (videoUrl) {
      console.log('Starting final video transition with URL:', videoUrl);
      setTransitionVideoUrl(videoUrl);
      setIsTransitioning(true);
      setPendingSubmission(true);
      // Start recipe submission during video
      handleSubmit();
    } else {
      console.log('No final video, submitting directly');
      handleSubmit();
    }
  };

  const handleCreationSubmit = () => {
    handleSubmit();
  };

  const completeTransition = () => {
    console.log('Completing transition, pendingSubmission:', pendingSubmission);
    setIsTransitioning(false);
    setTransitionVideoUrl('');
    
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
    setTransitionVideoUrl('');
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
    transitionVideoUrl,
    transitionDirection: 'forward' as const,
    transitionVariant: 'video' as const,
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
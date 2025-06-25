
import React, { useState } from 'react';
import { useEnhancedTransition } from '@/hooks/useEnhancedTransition';
import { useVideoSelection } from '@/hooks/useVideoSelection';
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
  const { isTransitioning, transitionConfig, startTransition, startVideoTransition, completeTransition } = useEnhancedTransition();
  const { selectedVideoUrl, loadAvailableVideos, selectVideo, clearSelection } = useVideoSelection();
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  // Load videos on hook initialization
  React.useEffect(() => {
    loadAvailableVideos();
  }, [loadAvailableVideos]);

  // Transition handlers for intro steps
  const handleIntroNext = () => {
    if (selectedVideoUrl) {
      startVideoTransition(() => {
        if (currentIntroStep < introSteps.length - 1) {
          setCurrentIntroStep(currentIntroStep + 1);
        } else {
          setHasStartedCreation(true);
        }
      }, selectedVideoUrl, {
        onStart: () => console.log('Intro video transition started'),
        onComplete: () => console.log('Intro video transition completed')
      });
    } else {
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
    }
  };

  const handleIntroPrev = () => {
    if (selectedVideoUrl) {
      startVideoTransition(() => {
        if (currentIntroStep > 0) {
          setCurrentIntroStep(currentIntroStep - 1);
        }
      }, selectedVideoUrl, {
        onStart: () => console.log('Intro video transition (back) started'),
        onComplete: () => console.log('Intro video transition (back) completed')
      });
    } else {
      startTransition(() => {
        if (currentIntroStep > 0) {
          setCurrentIntroStep(currentIntroStep - 1);
        }
      }, {
        variant: 'geometric',
        direction: 'backward'
      });
    }
  };

  // Transition handlers for creation steps
  const handleCreationNext = () => {
    if (selectedVideoUrl) {
      startVideoTransition(() => {
        nextCreationStep();
      }, selectedVideoUrl, {
        onStart: () => console.log('Creation video transition started'),
        onComplete: () => console.log('Creation video transition completed')
      });
    } else {
      startTransition(() => {
        nextCreationStep();
      }, {
        variant: 'particle',
        direction: 'forward'
      });
    }
  };

  const handleCreationPrev = () => {
    if (selectedVideoUrl) {
      startVideoTransition(() => {
        prevCreationStep();
      }, selectedVideoUrl, {
        onStart: () => console.log('Creation video transition (back) started'),
        onComplete: () => console.log('Creation video transition (back) completed')
      });
    } else {
      startTransition(() => {
        prevCreationStep();
      }, {
        variant: 'wave',
        direction: 'backward'
      });
    }
  };

  const handleCreationSubmit = () => {
    if (selectedVideoUrl) {
      startVideoTransition(() => {
        handleSubmit();
      }, selectedVideoUrl, {
        duration: 3000,
        onStart: () => console.log('Final video transition started'),
        onComplete: () => console.log('Final video transition completed')
      });
    } else {
      startTransition(() => {
        handleSubmit();
      }, {
        variant: 'loading',
        direction: 'forward',
        duration: 1500
      });
    }
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
    transitionVideoUrl: transitionConfig.videoUrl,
    selectedVideoUrl,
    completeTransition,
    handleIntroNext,
    handleIntroPrev,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit,
    nextIntroStep,
    prevIntroStep,
    selectVideo,
    clearSelection
  };
};

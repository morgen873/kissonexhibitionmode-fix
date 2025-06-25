
import { useState } from 'react';

interface TransitionOptions {
  variant?: 'geometric' | 'particle' | 'wave' | 'minimal' | 'loading';
  duration?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export const useEnhancedTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (
    callback: () => void,
    options?: TransitionOptions
  ) => {
    console.log('Transition started with options:', options);
    setIsTransitioning(true);
    
    // Simulate transition duration
    const duration = options?.duration || 1000;
    
    options?.onStart?.();
    
    setTimeout(() => {
      setIsTransitioning(false);
      callback();
      options?.onComplete?.();
    }, duration);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    startTransition,
    completeTransition
  };
};

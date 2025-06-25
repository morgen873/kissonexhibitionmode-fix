
import { useState, useCallback, useRef, useEffect } from 'react';

export interface TransitionConfig {
  duration?: number;
  easing?: string;
  stagger?: number;
  direction?: 'forward' | 'backward';
  onStart?: () => void;
  onComplete?: () => void;
}

export const useEnhancedTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionConfig, setTransitionConfig] = useState<TransitionConfig>({});
  const callbackRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTransition = useCallback((
    callback: () => void,
    config: TransitionConfig = {}
  ) => {
    const defaultConfig: TransitionConfig = {
      duration: 300,
      easing: 'ease-out',
      direction: 'forward',
      ...config
    };

    setTransitionConfig(defaultConfig);
    setIsTransitioning(true);
    callbackRef.current = callback;

    // Call onStart if provided
    if (defaultConfig.onStart) {
      defaultConfig.onStart();
    }

    // Auto-complete transition after duration
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      completeTransition();
    }, defaultConfig.duration || 300);
  }, []);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
    
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = null;
    }

    if (transitionConfig.onComplete) {
      transitionConfig.onComplete();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [transitionConfig]);

  const cancelTransition = useCallback(() => {
    setIsTransitioning(false);
    callbackRef.current = null;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isTransitioning,
    transitionConfig,
    startTransition,
    completeTransition,
    cancelTransition
  };
};

// Animation timing utilities
export const ANIMATION_TIMINGS = {
  instant: 0,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800
} as const;

export const EASING_FUNCTIONS = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
} as const;

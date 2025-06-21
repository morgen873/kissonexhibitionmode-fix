
import { useState, useCallback, useRef } from 'react';

export const useTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const callbackRef = useRef<(() => void) | null>(null);

  const startTransition = useCallback((direction: 'forward' | 'backward', callback: () => void) => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    callbackRef.current = callback;
  }, []);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = null;
    }
  }, []);

  return {
    isTransitioning,
    transitionDirection,
    startTransition,
    completeTransition
  };
};

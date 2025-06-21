
import { useTransition } from '@/hooks/useTransition';

export const useCreationFlow = () => {
  const { isTransitioning, transitionDirection, startTransition, completeTransition } = useTransition();

  const handleCreationNext = (callback: () => void) => {
    startTransition('forward', callback);
  };

  const handleCreationPrev = (callback: () => void) => {
    startTransition('backward', callback);
  };

  const handleCreationSubmit = (callback: () => void) => {
    // No transition animation for recipe creation - it will show in background
    callback();
  };

  return {
    isTransitioning,
    transitionDirection,
    startTransition,
    completeTransition,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit
  };
};

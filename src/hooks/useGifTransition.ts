
import { useState } from 'react';

interface UseGifTransitionProps {
  gifUrl?: string;
  duration?: number;
}

export const useGifTransition = ({ 
  gifUrl = '', 
  duration = 3000 
}: UseGifTransitionProps = {}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = (onComplete?: () => void) => {
    if (!gifUrl) {
      console.warn('No GIF URL provided for transition');
      onComplete?.();
      return;
    }

    setIsTransitioning(true);
    
    // The GifTransition component will handle the timing and call this function
    const handleTransitionComplete = () => {
      setIsTransitioning(false);
      onComplete?.();
    };

    return handleTransitionComplete;
  };

  return {
    isTransitioning,
    startTransition,
    setIsTransitioning
  };
};

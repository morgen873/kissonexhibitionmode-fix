
import React, { useEffect } from 'react';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  variant?: 'geometric' | 'particle' | 'wave' | 'minimal' | 'loading';
  duration?: number;
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  variant = 'geometric',
  duration = 1000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-green-400 font-mono">
          Testing {variant} transition...
        </p>
      </div>
    </div>
  );
};

export default TransitionAnimation;

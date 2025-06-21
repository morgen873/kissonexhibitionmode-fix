
import React, { useEffect, useState } from 'react';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'forward' | 'backward';
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  direction = 'forward'
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'cycle' | 'exit'>('enter');

  // Image paths for the dumpling animation
  const images = [
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png'
  ];

  useEffect(() => {
    if (!isVisible) return;

    let timeouts: NodeJS.Timeout[] = [];

    // Enter phase - fade in first image
    timeouts.push(setTimeout(() => {
      setAnimationPhase('cycle');
    }, 300));

    // Cycle through images
    images.forEach((_, index) => {
      timeouts.push(setTimeout(() => {
        setCurrentImage(index);
      }, 300 + (index * 200)));
    });

    // Exit phase
    timeouts.push(setTimeout(() => {
      setAnimationPhase('exit');
    }, 300 + (images.length * 200)));

    // Complete animation
    timeouts.push(setTimeout(() => {
      onComplete();
    }, 600 + (images.length * 200)));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getTransform = () => {
    if (animationPhase === 'enter') {
      return direction === 'forward' 
        ? 'translateY(30px) scale(0.9)' 
        : 'translateY(-30px) scale(0.9)';
    }
    if (animationPhase === 'exit') {
      return direction === 'forward' 
        ? 'translateY(-30px) scale(1.1)' 
        : 'translateY(30px) scale(1.1)';
    }
    return 'translateY(0) scale(1)';
  };

  const getOpacity = () => {
    return animationPhase === 'cycle' ? '1' : '0';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-32 h-32 transition-all duration-300 ease-out"
        style={{
          transform: getTransform(),
          opacity: getOpacity()
        }}
      >
        <img
          src={images[currentImage]}
          alt="Dumpling transition"
          className="w-full h-full object-contain animate-pulse"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full animate-ping" />
      </div>
    </div>
  );
};

export default TransitionAnimation;

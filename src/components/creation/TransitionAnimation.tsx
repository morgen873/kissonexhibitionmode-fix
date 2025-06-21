
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

  // Your dumpling images
  const images = [
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png'
  ];

  useEffect(() => {
    if (!isVisible) return;

    let timeouts: NodeJS.Timeout[] = [];

    // Cycle through your dumpling images
    images.forEach((_, index) => {
      timeouts.push(setTimeout(() => {
        setCurrentImage(index);
      }, index * 150));
    });

    // Complete the animation
    timeouts.push(setTimeout(() => {
      onComplete();
    }, images.length * 150 + 300));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-32 h-32">
        <img
          src={images[currentImage]}
          alt="Dumpling"
          className="w-full h-full object-contain transition-opacity duration-150"
        />
      </div>
    </div>
  );
};

export default TransitionAnimation;

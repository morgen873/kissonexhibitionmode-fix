
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

  // Dumpling images - using the provided dumpling image path
  const images = [
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png',
    '/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png'
  ];

  useEffect(() => {
    if (!isVisible) return;

    console.log('TransitionAnimation: Starting animation with images:', images);
    let timeouts: NodeJS.Timeout[] = [];

    // Cycle through dumpling images
    images.forEach((imagePath, index) => {
      timeouts.push(setTimeout(() => {
        console.log(`TransitionAnimation: Showing image ${index}: ${imagePath}`);
        setCurrentImage(index);
      }, index * 500)); // 0.5 seconds per image as requested
    });

    // Complete the animation after all images have been shown
    timeouts.push(setTimeout(() => {
      console.log('TransitionAnimation: Animation complete');
      onComplete();
    }, images.length * 500 + 300));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  console.log('TransitionAnimation: Rendering image:', images[currentImage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-32 h-32">
        <img
          src={images[currentImage]}
          alt={`Dumpling ${currentImage + 1}`}
          className="w-full h-full object-contain transition-opacity duration-150"
          onLoad={() => console.log('TransitionAnimation: Image loaded successfully')}
          onError={(e) => console.error('TransitionAnimation: Image failed to load:', e)}
        />
      </div>
    </div>
  );
};

export default TransitionAnimation;


import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'forward' | 'backward';
  variant?: 'images' | 'loading' | 'minimal';
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  direction = 'forward',
  variant = 'images'
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Default dumpling images
  const images = [
    '/lovable-uploads/9e669733-5c8a-4971-926a-51a8a6711aca.png',
    '/lovable-uploads/504c7d32-e678-4269-92bd-2bcbb41ed83d.png',
    '/lovable-uploads/35e09118-6751-4e82-addf-f64a1c994622.png',
    '/lovable-uploads/630333bc-01ff-4495-b5d9-812404b6e842.png'
  ];

  useEffect(() => {
    if (!isVisible) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    console.log('TransitionAnimation: Starting enhanced transition');
    
    if (variant === 'minimal') {
      // Quick minimal transition
      setTimeout(() => {
        console.log('TransitionAnimation: Minimal transition complete');
        onComplete();
      }, 400);
      return;
    }

    if (variant === 'loading') {
      // Loading spinner transition
      setTimeout(() => {
        console.log('TransitionAnimation: Loading transition complete');
        onComplete();
      }, 800);
      return;
    }

    // Enhanced image sequence with better timing
    let timeouts: NodeJS.Timeout[] = [];
    const imageDisplayTime = 400; // Slightly faster than original
    const totalDuration = images.length * imageDisplayTime + 200;

    images.forEach((imagePath, index) => {
      timeouts.push(setTimeout(() => {
        console.log(`TransitionAnimation: Showing image ${index + 1}: ${imagePath}`);
        setCurrentImage(index);
      }, index * imageDisplayTime));
    });

    timeouts.push(setTimeout(() => {
      console.log('TransitionAnimation: Enhanced image transition complete');
      setIsAnimating(false);
      onComplete();
    }, totalDuration));

    return () => {
      timeouts.forEach(clearTimeout);
      setIsAnimating(false);
    };
  }, [isVisible, onComplete, variant]);

  if (!isVisible) return null;

  if (variant === 'minimal') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center animate-fade-in"
        style={{ zIndex: 9999 }}
      >
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-green-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (variant === 'loading') {
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center animate-fade-in"
        style={{ zIndex: 9999 }}
      >
        <LoadingSpinner size="lg" variant="spin" />
        <p className="text-white text-lg font-mono mt-4 animate-pulse">
          Preparing your experience...
        </p>
      </div>
    );
  }

  const currentImageUrl = images[currentImage];
  console.log('TransitionAnimation: Rendering enhanced image:', currentImageUrl);

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Enhanced image display with better animations */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={currentImageUrl}
          alt={`Transition ${currentImage + 1}`}
          className={`
            w-full h-full object-cover 
            transition-all duration-300 ease-out
            ${isAnimating ? 'animate-zoom-in' : ''}
          `}
          onLoad={() => console.log('TransitionAnimation: Enhanced image loaded successfully')}
          onError={(e) => console.error('TransitionAnimation: Enhanced image failed to load:', e)}
        />
        
        {/* Overlay gradient for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30"></div>
        
        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index <= currentImage ? 'bg-green-400 scale-125' : 'bg-white/30'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionAnimation;

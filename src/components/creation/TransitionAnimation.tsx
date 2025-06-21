
import React, { useEffect, useState } from 'react';

interface TransitionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  direction?: 'forward' | 'backward';
  backgroundMode?: boolean;
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({
  isVisible,
  onComplete,
  direction = 'forward',
  backgroundMode = false
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Using the new dumpling images you provided
  const images = [
    '/lovable-uploads/9e669733-5c8a-4971-926a-51a8a6711aca.png',
    '/lovable-uploads/504c7d32-e678-4269-92bd-2bcbb41ed83d.png',
    '/lovable-uploads/35e09118-6751-4e82-addf-f64a1c994622.png',
    '/lovable-uploads/630333bc-01ff-4495-b5d9-812404b6e842.png'
  ];

  useEffect(() => {
    if (!isVisible) return;

    console.log(`TransitionAnimation: Starting ${backgroundMode ? 'background' : 'full-screen'} animation with dumpling images:`, images);
    let timeouts: NodeJS.Timeout[] = [];

    if (backgroundMode) {
      // In background mode, cycle continuously at a slower pace
      const cycleDuration = 2000; // 2 seconds per image
      const startCycling = () => {
        images.forEach((imagePath, index) => {
          timeouts.push(setTimeout(() => {
            console.log(`TransitionAnimation: Background mode showing image ${index + 1}: ${imagePath}`);
            setCurrentImage(index);
          }, index * cycleDuration));
        });
        
        // Continue cycling
        timeouts.push(setTimeout(startCycling, images.length * cycleDuration));
      };
      
      startCycling();
    } else {
      // Normal transition mode - 0.5 seconds each for 2 second total
      images.forEach((imagePath, index) => {
        timeouts.push(setTimeout(() => {
          console.log(`TransitionAnimation: Showing full-screen image ${index + 1}: ${imagePath}`);
          setCurrentImage(index);
        }, index * 500)); // 0.5 seconds per image
      });

      // Complete the animation after all images have been shown
      timeouts.push(setTimeout(() => {
        console.log('TransitionAnimation: Full-screen animation complete');
        onComplete();
      }, images.length * 500 + 300));
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete, backgroundMode]);

  if (!isVisible) return null;

  console.log(`TransitionAnimation: Rendering ${backgroundMode ? 'background' : 'full-screen'} image:`, images[currentImage]);

  return (
    <div 
      className={`fixed top-0 left-0 w-screen h-screen ${backgroundMode ? 'bg-black/50' : 'bg-black'}`}
      style={{ zIndex: backgroundMode ? 1 : 9999 }}
    >
      <img
        src={images[currentImage]}
        alt={`Dumpling ${currentImage + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-150 ${backgroundMode ? 'opacity-30' : ''}`}
        onLoad={() => console.log(`TransitionAnimation: ${backgroundMode ? 'Background' : 'Full-screen'} image loaded successfully`)}
        onError={(e) => console.error(`TransitionAnimation: ${backgroundMode ? 'Background' : 'Full-screen'} image failed to load:`, e)}
      />
    </div>
  );
};

export default TransitionAnimation;

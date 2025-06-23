
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

  // Default dumpling images
  const images = [
    '/lovable-uploads/9e669733-5c8a-4971-926a-51a8a6711aca.png',
    '/lovable-uploads/504c7d32-e678-4269-92bd-2bcbb41ed83d.png',
    '/lovable-uploads/35e09118-6751-4e82-addf-f64a1c994622.png',
    '/lovable-uploads/630333bc-01ff-4495-b5d9-812404b6e842.png'
  ];

  useEffect(() => {
    if (!isVisible) return;

    console.log('TransitionAnimation: Starting transition with images:', images);
    
    let timeouts: NodeJS.Timeout[] = [];

    images.forEach((imagePath, index) => {
      timeouts.push(setTimeout(() => {
        console.log(`TransitionAnimation: Showing image ${index + 1}: ${imagePath}`);
        setCurrentImage(index);
      }, index * 500)); // 0.5 seconds per image
    });

    timeouts.push(setTimeout(() => {
      console.log('TransitionAnimation: Image transition complete');
      onComplete();
    }, images.length * 500 + 300));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const currentImageUrl = images[currentImage];
  console.log('TransitionAnimation: Rendering image:', currentImageUrl);

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black"
      style={{ zIndex: 9999 }}
    >
      <img
        src={currentImageUrl}
        alt={`Transition ${currentImage + 1}`}
        className="w-full h-full object-cover transition-opacity duration-150"
        onLoad={() => console.log('TransitionAnimation: Image loaded successfully')}
        onError={(e) => console.error('TransitionAnimation: Image failed to load:', e)}
      />
    </div>
  );
};

export default TransitionAnimation;

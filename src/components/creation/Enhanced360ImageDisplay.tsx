import React, { useState, useEffect, useRef } from 'react';

interface Enhanced360ImageDisplayProps {
  imageUrl: string;
  recipeTitle: string;
}

const Enhanced360ImageDisplay: React.FC<Enhanced360ImageDisplayProps> = ({ imageUrl, recipeTitle }) => {
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovering) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const mouseX = e.clientX;
    
    // Calculate rotation based on mouse position (-180 to 180 degrees)
    const maxRotation = 180;
    const relativeX = mouseX - centerX;
    const rotationValue = (relativeX / (rect.width / 2)) * maxRotation;
    
    setRotation(Math.max(-maxRotation, Math.min(maxRotation, rotationValue)));
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold font-mono">360° Interactive View</h3>
      <div className="w-full max-w-[250px] lg:max-w-[300px] relative group">
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={imageUrl}
            alt="360° Interactive Dumpling" 
            className="w-full aspect-square object-cover transition-transform duration-150 ease-out"
            style={{
              transform: isHovering 
                ? `scale(1.05) rotate(${rotation}deg)` 
                : `rotate(${rotation}deg)`
            }}
          />
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            360° Live View
          </div>
          <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded">
            Hover to control
          </div>
        </div>
        <p className="text-center text-sm text-white/70 mt-2">
          Hover over the image to control rotation
        </p>
      </div>
    </div>
  );
};

export default Enhanced360ImageDisplay;
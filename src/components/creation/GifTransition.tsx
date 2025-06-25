
import React, { useEffect, useState } from 'react';

interface GifTransitionProps {
  gifUrl: string;
  isVisible: boolean;
  onComplete: () => void;
  duration?: number; // How long to show the GIF
}

const GifTransition: React.FC<GifTransitionProps> = ({
  gifUrl,
  isVisible,
  onComplete,
  duration = 3000 // Default 3 seconds
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsLoading(true);
      setHasError(false);
      return;
    }

    // Preload the GIF
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      // Auto-complete the transition after the specified duration
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      // Still complete the transition even if GIF fails to load
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    img.src = gifUrl;
  }, [isVisible, gifUrl, onComplete, duration]);

  if (!isVisible) {
    return null;
  }

  if (hasError) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-green-400 font-mono">Loading transition...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-green-400 font-mono">Loading transition...</p>
          </div>
        </div>
      )}
      
      <img
        src={gifUrl}
        alt="Transition animation"
        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
    </div>
  );
};

export default GifTransition;

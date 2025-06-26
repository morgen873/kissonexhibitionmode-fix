
import React, { useEffect, useState } from 'react';

interface GifTransitionProps {
  gifUrl: string;
  isVisible: boolean;
  onComplete: () => void;
  duration?: number;
}

const GifTransition: React.FC<GifTransitionProps> = ({
  gifUrl,
  isVisible,
  onComplete,
  duration = 3000
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsLoading(true);
      setHasError(false);
      return;
    }

    console.log('GifTransition: Loading GIF:', gifUrl);

    // Preload the GIF
    const img = new Image();
    
    const handleLoad = () => {
      console.log('GIF loaded successfully');
      setIsLoading(false);
      setHasError(false);
      
      // Auto-complete the transition after the specified duration
      const timer = setTimeout(() => {
        console.log('GIF transition duration completed, calling onComplete');
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    };
    
    const handleError = () => {
      console.error('GIF failed to load:', gifUrl);
      setHasError(true);
      setIsLoading(false);
      
      // Still complete the transition even if GIF fails to load
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = gifUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, gifUrl, onComplete, duration]);

  if (!isVisible) {
    return null;
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
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <p className="text-red-400 font-mono">Failed to load transition</p>
            <p className="text-white/60 font-mono text-sm">Continuing...</p>
          </div>
        </div>
      )}
      
      {!isLoading && !hasError && (
        <img
          src={gifUrl}
          alt="Transition animation"
          className="w-screen h-screen object-cover"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100vw',
            height: '100vh'
          }}
        />
      )}
    </div>
  );
};

export default GifTransition;


import React, { useEffect, useState } from 'react';

interface GifTransitionProps {
  gifUrl: string;
  isVisible: boolean;
  onComplete: () => void;
  duration?: number;
  isCreatingRecipe?: boolean;
}

const GifTransition: React.FC<GifTransitionProps> = ({
  gifUrl,
  isVisible,
  onComplete,
  duration = 3000,
  isCreatingRecipe = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [gifCompleted, setGifCompleted] = useState(false);

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
      
      // Mark GIF as completed after the initial duration, but don't call onComplete yet
      const timer = setTimeout(() => {
        console.log('GIF initial duration completed');
        setGifCompleted(true);
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

  // Separate effect to handle completion when recipe is ready
  useEffect(() => {
    if (gifCompleted && !isCreatingRecipe && isVisible) {
      console.log('GIF completed and recipe ready, completing transition');
      onComplete();
    }
  }, [gifCompleted, isCreatingRecipe, isVisible, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {/* Show GIF immediately, even while loading */}
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
        onLoad={() => {
          console.log('GIF image element loaded');
          setIsLoading(false);
        }}
        onError={() => {
          console.error('GIF image element failed to load');
          setHasError(true);
          setIsLoading(false);
        }}
      />
      
      {/* Only show loading overlay if still loading or waiting for recipe */}
      {(isLoading || (gifCompleted && isCreatingRecipe)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-green-400 font-mono">
              {isLoading ? 'Loading transition...' : 'Creating your recipe...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Show error overlay if failed to load */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center space-y-4">
            <p className="text-red-400 font-mono">Failed to load transition</p>
            <p className="text-white/60 font-mono text-sm">URL: {gifUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GifTransition;

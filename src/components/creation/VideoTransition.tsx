
import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';

interface VideoTransitionProps {
  videoUrl: string;
  isVisible: boolean;
  onComplete: () => void;
  onError?: (error: string) => void;
  fallbackVariant?: 'geometric' | 'particle' | 'wave';
  duration?: number;
  isCreatingRecipe?: boolean;
}

const VideoTransition: React.FC<VideoTransitionProps> = ({
  videoUrl,
  isVisible,
  onComplete,
  onError,
  fallbackVariant = 'geometric',
  duration = 2000,
  isCreatingRecipe = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsLoading(true);
      setHasError(false);
      setShowFallback(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Video loaded successfully');
      setIsLoading(false);
      video.play().catch(error => {
        console.error('Video play error:', error);
        handleError('Failed to play transition video');
      });
    };

    const handleEnded = () => {
      console.log('Video playback completed');
      setVideoCompleted(true);
    };

    const handleError = (errorMessage: string) => {
      console.error('Video error:', errorMessage);
      setHasError(true);
      setShowFallback(true);
      onError?.(errorMessage);
      
      // Fallback to geometric animation after brief delay
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    const handleVideoError = () => {
      handleError('Video failed to load or play');
    };

    // Set up video event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleVideoError);

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      if (isLoading || hasError) {
        handleError('Video loading timeout');
      }
    }, 5000);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleVideoError);
      clearTimeout(timeoutId);
    };
  }, [isVisible, videoUrl, onComplete, onError, isLoading, hasError]);

  // Separate effect to handle completion when recipe is ready
  useEffect(() => {
    if (videoCompleted && !isCreatingRecipe && isVisible) {
      console.log('Video completed and recipe ready, completing transition');
      onComplete();
    }
  }, [videoCompleted, isCreatingRecipe, isVisible, onComplete]);

  if (!isVisible) return null;

  if (showFallback) {
    // Render geometric fallback animation
    return (
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-green-400 rotate-45 animate-spin"></div>
          <div className="absolute w-24 h-24 bg-green-400/20 rounded-full animate-pulse"></div>
          <div className="absolute w-40 h-40 border-2 border-emerald-500 rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {(isLoading || (videoCompleted && isCreatingRecipe)) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <LoadingSpinner size="lg" variant="spin" />
          <p className="text-white text-lg font-mono mt-4 animate-pulse text-center max-w-md">
            {isLoading ? 'Loading transition...' : 'Kisson is creating your recipe. be patient, it will take a while, but remember- memories last forever!'}
          </p>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        muted
        playsInline
        preload="auto"
        style={{ 
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default VideoTransition;

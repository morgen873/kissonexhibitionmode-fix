
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface RecipeVideoDisplayProps {
  videoUrl: string;
  recipeName: string;
}

const RecipeVideoDisplay: React.FC<RecipeVideoDisplayProps> = ({ videoUrl, recipeName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    console.log('✅ Recipe video loaded successfully');
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('❌ Failed to load recipe video');
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-lg font-semibold font-mono">Recipe Animation</h3>
        <div className="w-full max-w-[250px] lg:max-w-[300px] aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm text-center p-4">
            Video not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold font-mono">Recipe Animation</h3>
      <div className="w-full max-w-[250px] lg:max-w-[300px] relative group">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
          muted={isMuted}
          loop
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onEnded={handleVideoEnded}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
        
        {!isLoading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/50 rounded-full p-2 flex gap-2">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-green-400 transition-colors"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-green-400 transition-colors"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeVideoDisplay;

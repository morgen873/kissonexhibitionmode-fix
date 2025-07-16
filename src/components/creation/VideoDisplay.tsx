import React from 'react';

interface VideoDisplayProps {
  videoUrl: string;
  recipeTitle: string;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoUrl, recipeTitle }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold font-mono">360° Rotation Video</h3>
      <div className="w-full max-w-[300px] relative">
        <video 
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="rounded-lg shadow-lg w-full aspect-video object-cover"
          onError={(e) => {
            console.error('Video playback error:', e);
          }}
        >
          <p>Your browser doesn't support video playback.</p>
        </video>
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          360° View
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VideoLoadingSpinner: React.FC<VideoLoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Get the video URL from Supabase storage
  const { data } = supabase.storage.from('videos').getPublicUrl('hand-loop.mp4');
  
  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}>
      <video
        src={data.publicUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Video loading error:', e);
        }}
      />
    </div>
  );
};
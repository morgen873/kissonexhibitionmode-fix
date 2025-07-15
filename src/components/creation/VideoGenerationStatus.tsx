import React from 'react';
import { Loader2, Video, AlertCircle } from 'lucide-react';

interface VideoGenerationStatusProps {
  status: 'generating' | 'completed' | 'failed' | null;
  className?: string;
}

const VideoGenerationStatus: React.FC<VideoGenerationStatusProps> = ({ status, className = "" }) => {
  if (!status) return null;

  const statusConfig = {
    generating: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: "Generating video...",
      color: "text-blue-400"
    },
    completed: {
      icon: <Video className="w-4 h-4" />,
      text: "Video ready!",
      color: "text-green-400"
    },
    failed: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Video generation failed",
      color: "text-red-400"
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${config.color} ${className}`}>
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

export default VideoGenerationStatus;
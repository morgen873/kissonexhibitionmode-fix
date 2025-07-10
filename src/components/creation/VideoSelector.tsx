
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoRetriever, VideoFile } from '@/utils/videoRetriever';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';
import { Play, Trash2, RefreshCw, Film } from 'lucide-react';

interface VideoSelectorProps {
  onVideoSelect?: (videoUrl: string) => void;
  onTestTransition?: (videoUrl: string) => void;
  selectedVideoUrl?: string;
}

const VideoSelector: React.FC<VideoSelectorProps> = ({
  onVideoSelect,
  onTestTransition,
  selectedVideoUrl
}) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const availableVideos = await VideoRetriever.getAvailableVideos();
      setVideos(availableVideos);
      
      // Set selected video if URL matches
      if (selectedVideoUrl) {
        const matchingVideo = availableVideos.find(v => v.url === selectedVideoUrl);
        if (matchingVideo) {
          setSelectedVideo(matchingVideo);
        }
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVideos = async () => {
    setIsRefreshing(true);
    await loadVideos();
    setIsRefreshing(false);
  };

  const handleVideoSelect = (video: VideoFile) => {
    setSelectedVideo(video);
    onVideoSelect?.(video.url);
  };

  const handleDeleteVideo = async (video: VideoFile) => {
    if (window.confirm(`Are you sure you want to delete "${video.name}"?`)) {
      const success = await VideoRetriever.deleteVideo(video.name);
      if (success) {
        await loadVideos();
        if (selectedVideo?.name === video.name) {
          setSelectedVideo(null);
          onVideoSelect?.('');
        }
      }
    }
  };

  const handleTestTransition = () => {
    if (selectedVideo) {
      onTestTransition?.(selectedVideo.url);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <Card className="w-full bg-black/90 border-green-400/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 font-mono flex items-center">
            <Film className="w-5 h-5 mr-2" />
            Video Library
          </CardTitle>
          <Button
            onClick={refreshVideos}
            variant="outline"
            size="sm"
            className="border-green-400/50 text-green-400 hover:bg-green-400/10"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" variant="spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-green-400/70 font-mono">No videos found in library</p>
            <p className="text-green-400/50 font-mono text-sm mt-2">
              Upload videos to the "videos" bucket in Supabase
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {videos.map((video) => (
              <div
                key={video.name}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedVideo?.name === video.name
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-green-400/30 hover:border-green-400/50 hover:bg-green-400/5'
                }`}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-green-400 font-mono text-sm truncate">
                      {video.name}
                    </p>
                    <p className="text-green-400/70 font-mono text-xs">
                      {VideoRetriever.formatFileSize(video.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-red-400/50 text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedVideo && (
          <div className="mt-4 pt-4 border-t border-green-400/30">
            <div className="space-y-3">
              <div className="bg-green-400/10 p-3 rounded-lg">
                <p className="text-green-400 font-mono text-sm">Selected:</p>
                <p className="text-green-400 font-mono text-xs break-all">
                  {selectedVideo.name}
                </p>
              </div>
              
              <Button
                onClick={handleTestTransition}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-mono"
              >
                <Play className="w-4 h-4 mr-2" />
                Test as Transition
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoSelector;

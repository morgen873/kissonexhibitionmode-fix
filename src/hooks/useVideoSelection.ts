
import { useState, useCallback } from 'react';
import { VideoRetriever, VideoFile } from '@/utils/videoRetriever';

export const useVideoSelection = () => {
  const [availableVideos, setAvailableVideos] = useState<VideoFile[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const loadAvailableVideos = useCallback(async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await VideoRetriever.getAvailableVideos();
      setAvailableVideos(videos);
      return videos;
    } catch (error) {
      console.error('Failed to load videos:', error);
      return [];
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  const selectVideo = useCallback((videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVideoUrl(null);
  }, []);

  const getRandomVideo = useCallback(() => {
    if (availableVideos.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    return availableVideos[randomIndex];
  }, [availableVideos]);

  const selectRandomVideo = useCallback(() => {
    const randomVideo = getRandomVideo();
    if (randomVideo) {
      setSelectedVideoUrl(randomVideo.url);
      return randomVideo.url;
    }
    return null;
  }, [getRandomVideo]);

  return {
    availableVideos,
    selectedVideoUrl,
    isLoadingVideos,
    loadAvailableVideos,
    selectVideo,
    clearSelection,
    getRandomVideo,
    selectRandomVideo
  };
};

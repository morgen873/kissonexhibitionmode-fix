
import { useState, useCallback } from 'react';

export const useVideoUpload = () => {
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  const handleVideoUpload = useCallback((videoUrl: string) => {
    setUploadedVideos(prev => [...prev, videoUrl]);
    console.log('Video uploaded:', videoUrl);
  }, []);

  const handleVideoRemove = useCallback((videoUrl: string) => {
    setUploadedVideos(prev => prev.filter(url => url !== videoUrl));
    console.log('Video removed:', videoUrl);
  }, []);

  const clearAllVideos = useCallback(() => {
    // Clean up all object URLs
    uploadedVideos.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setUploadedVideos([]);
  }, [uploadedVideos]);

  return {
    uploadedVideos,
    handleVideoUpload,
    handleVideoRemove,
    clearAllVideos
  };
};

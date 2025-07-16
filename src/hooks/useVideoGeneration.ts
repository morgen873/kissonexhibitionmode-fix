import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  recipeId?: string;
  cost?: number;
  message?: string;
  error?: string;
}

export const useVideoGeneration = () => {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const checkVideoStatus = async (recipeId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('video_url')
        .eq('id', recipeId)
        .single();

      if (error) {
        console.error('Error checking video status:', error);
        return null;
      }

      return data?.video_url || null;
    } catch (error) {
      console.error('Error checking video status:', error);
      return null;
    }
  };

  const startPolling = (recipeId: string, onVideoReady: (videoUrl: string) => void) => {
    if (isPolling) return;
    
    setIsPolling(true);
    
    const pollInterval = setInterval(async () => {
      const videoUrl = await checkVideoStatus(recipeId);
      
      if (videoUrl) {
        console.log('✅ Video is ready:', videoUrl);
        setVideoUrl(videoUrl);
        setIsGeneratingVideo(false);
        setIsPolling(false);
        onVideoReady(videoUrl);
        clearInterval(pollInterval);
        toast.success('360° video is ready!');
      }
    }, 5000); // Check every 5 seconds

    // Stop polling after 10 minutes (video generation timeout)
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsGeneratingVideo(false);
      setIsPolling(false);
      toast.error('Video generation timed out. Please try again.');
    }, 600000); // 10 minutes
  };

  const generateVideo = async (imageUrl: string, recipeId: string, recipeTitle: string) => {
    setIsGeneratingVideo(true);
    
    try {
      console.log('🎬 Starting 360° video generation...');
      console.log('Image URL:', imageUrl);
      console.log('Recipe ID:', recipeId);

      const { data, error } = await supabase.functions.invoke('generate-360-video', {
        body: {
          imageUrl,
          recipeId,
          recipeTitle
        }
      });

      if (error) {
        console.error('❌ Video generation error:', error);
        throw new Error(error.message || 'Failed to generate video');
      }

      const response = data as VideoGenerationResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Video generation failed');
      }

      console.log('✅ Video generation started in background');
      toast.success('Video generation started! This may take a few minutes...');
      
      // Start polling for the video
      return new Promise<string>((resolve, reject) => {
        startPolling(recipeId, (videoUrl) => {
          resolve(videoUrl);
        });
        
        // Reject if polling times out (handled in startPolling)
        setTimeout(() => {
          reject(new Error('Video generation timed out'));
        }, 600000);
      });

    } catch (error) {
      console.error('❌ Error generating video:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
      setIsGeneratingVideo(false);
      setIsPolling(false);
      throw error;
    }
  };

  const resetVideo = () => {
    setVideoUrl(null);
    setIsGeneratingVideo(false);
    setIsPolling(false);
  };

  return {
    generateVideo,
    isGeneratingVideo,
    videoUrl,
    resetVideo,
    isPolling
  };
};
import { useState, useEffect, useRef } from 'react';
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
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const checkVideoStatus = async (recipeId: string): Promise<string | null> => {
    try {
      console.log('🔍 Checking video status for recipe:', recipeId);
      
      const { data, error } = await supabase
        .from('recipes')
        .select('video_url')
        .eq('id', recipeId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking video status:', error);
        return null;
      }

      console.log('📊 Video status check result:', data);
      
      // Check if video_url starts with ERROR to handle error cases
      if (data?.video_url && data.video_url.startsWith('ERROR')) {
        console.error('❌ Video generation failed:', data.video_url);
        toast.error('Video generation failed: ' + data.video_url.replace('ERROR: ', ''));
        return 'ERROR';
      }

      // Return the video URL if it exists and is a valid URL
      if (data?.video_url && data.video_url.startsWith('http')) {
        console.log('✅ Found valid video URL:', data.video_url);
        return data.video_url;
      }

      console.log('⏳ No video URL found yet');
      return null;
    } catch (error) {
      console.error('❌ Error checking video status:', error);
      return null;
    }
  };

  const startPolling = (recipeId: string, onVideoReady: (videoUrl: string) => void, onError: (error: string) => void) => {
    if (isPolling || pollInterval) return;
    
    console.log('🔄 Starting video polling for recipe:', recipeId);
    setIsPolling(true);
    
    const interval = setInterval(async () => {
      console.log('📡 Polling for video status...');
      const videoUrl = await checkVideoStatus(recipeId);
      
      if (videoUrl === 'ERROR') {
        // Error case - stop polling
        setIsGeneratingVideo(false);
        setIsPolling(false);
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        onError('Video generation failed');
        return;
      }
      
      if (videoUrl && videoUrl !== 'ERROR') {
        console.log('✅ Video is ready:', videoUrl);
        console.log('🚀 About to call onVideoReady with:', videoUrl);
        setVideoUrl(videoUrl);
        setIsGeneratingVideo(false);
        setIsPolling(false);
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        toast.success('360° video is ready!');
        console.log('🎯 Calling onVideoReady callback...');
        onVideoReady(videoUrl);
        console.log('✅ onVideoReady callback executed');
      } else {
        console.log('⏳ Video not ready yet, continuing to poll...');
      }
    }, 5000); // Check every 5 seconds

    setPollInterval(interval);

    // Stop polling after 10 minutes (video generation timeout)
    const timeout = setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      setIsGeneratingVideo(false);
      setIsPolling(false);
      onError('Video generation timed out. Please try again.');
    }, 600000); // 10 minutes
    
    // Store timeout for cleanup
    return timeout;
  };

  const generateVideo = async (imageUrl: string, recipeId: string, recipeTitle: string, imagePrompt?: string) => {
    setIsGeneratingVideo(true);
    
    try {
      console.log('🎬 Starting 360° video generation...');
      console.log('Image URL:', imageUrl);
      console.log('Recipe ID:', recipeId);

      const { data, error } = await supabase.functions.invoke('generate-360-video-replicate', {
        body: {
          imageUrl,
          recipeId,
          recipeTitle,
          imagePrompt
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
        console.log('🎯 Setting up Promise with resolve/reject callbacks');
        startPolling(recipeId, 
          (videoUrl) => {
            console.log('🎉 Promise resolve called with videoUrl:', videoUrl);
            resolve(videoUrl);
          },
          (error) => {
            console.log('❌ Promise reject called with error:', error);
            reject(new Error(error));
          }
        );
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
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setVideoUrl(null);
    setIsGeneratingVideo(false);
    setIsPolling(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  return {
    generateVideo,
    isGeneratingVideo,
    videoUrl,
    resetVideo,
    isPolling
  };
};
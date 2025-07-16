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

      console.log('✅ Video generated successfully:', response.videoUrl);
      setVideoUrl(response.videoUrl || null);
      
      toast.success('360° video generated successfully!');
      
      return response.videoUrl;

    } catch (error) {
      console.error('❌ Error generating video:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
      throw error;
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const resetVideo = () => {
    setVideoUrl(null);
    setIsGeneratingVideo(false);
  };

  return {
    generateVideo,
    isGeneratingVideo,
    videoUrl,
    resetVideo
  };
};
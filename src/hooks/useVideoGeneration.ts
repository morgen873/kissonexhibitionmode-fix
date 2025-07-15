
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoGenerationParams {
  imageUrl: string;
  recipeTitle: string;
  recipeId: string;
}

export const useVideoGeneration = () => {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const generateVideo = async ({ imageUrl, recipeTitle, recipeId }: VideoGenerationParams): Promise<string | null> => {
    setIsGeneratingVideo(true);
    setVideoError(null);

    try {
      console.log('🎬 Starting video generation for recipe:', recipeId);
      
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          imageUrl,
          recipeTitle,
          recipeId
        }
      });

      if (error) {
        console.error('❌ Video generation error:', error);
        setVideoError('Failed to generate video');
        return null;
      }

      if (data?.success && data?.videoUrl) {
        console.log('✅ Video generated successfully:', data.videoUrl);
        return data.videoUrl;
      } else {
        console.log('⏳ Video generation started but not completed');
        return null;
      }

    } catch (error) {
      console.error('❌ Video generation error:', error);
      setVideoError('Failed to generate video');
      return null;
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return {
    generateVideo,
    isGeneratingVideo,
    videoError
  };
};

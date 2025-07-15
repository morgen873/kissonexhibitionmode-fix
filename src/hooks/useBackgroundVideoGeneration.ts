import { useState, useEffect } from 'react';
import { useVideoGeneration } from './useVideoGeneration';

interface BackgroundVideoParams {
  recipeId: string;
  imageUrl: string;
  recipeTitle: string;
}

export const useBackgroundVideoGeneration = () => {
  const [backgroundVideoStatus, setBackgroundVideoStatus] = useState<{
    [recipeId: string]: 'generating' | 'completed' | 'failed' | null;
  }>({});
  const { generateVideo } = useVideoGeneration();

  const startBackgroundVideoGeneration = async ({ 
    recipeId, 
    imageUrl, 
    recipeTitle 
  }: BackgroundVideoParams): Promise<string | null> => {
    setBackgroundVideoStatus(prev => ({ ...prev, [recipeId]: 'generating' }));
    
    try {
      const videoUrl = await generateVideo({
        imageUrl,
        recipeTitle,
        recipeId
      });
      
      if (videoUrl) {
        setBackgroundVideoStatus(prev => ({ ...prev, [recipeId]: 'completed' }));
        return videoUrl;
      } else {
        setBackgroundVideoStatus(prev => ({ ...prev, [recipeId]: 'failed' }));
        return null;
      }
    } catch (error) {
      console.error('Background video generation failed:', error);
      setBackgroundVideoStatus(prev => ({ ...prev, [recipeId]: 'failed' }));
      return null;
    }
  };

  const getVideoStatus = (recipeId: string) => {
    return backgroundVideoStatus[recipeId] || null;
  };

  return {
    startBackgroundVideoGeneration,
    getVideoStatus,
    backgroundVideoStatus
  };
};
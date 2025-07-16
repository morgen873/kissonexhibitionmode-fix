import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { RecipeResult } from '@/types/creation';

interface VideoGenerationButtonProps {
  recipe: RecipeResult;
  recipeId: string;
  onVideoGenerated?: (videoUrl: string) => void;
}

const VideoGenerationButton: React.FC<VideoGenerationButtonProps> = ({ 
  recipe, 
  recipeId, 
  onVideoGenerated 
}) => {
  const { generateVideo, isGeneratingVideo } = useVideoGeneration();

  const handleGenerateVideo = async () => {
    try {
      const videoUrl = await generateVideo(recipe.imageUrl, recipeId, recipe.name);
      if (videoUrl && onVideoGenerated) {
        onVideoGenerated(videoUrl);
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error('Video generation failed:', error);
    }
  };

  return (
    <Button 
      onClick={handleGenerateVideo}
      disabled={isGeneratingVideo || recipe.imageUrl === '/placeholder.svg'}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
    >
      {isGeneratingVideo ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating 360° Video...
        </>
      ) : (
        <>
          <Video className="w-4 h-4" />
          Generate 360° Video
        </>
      )}
    </Button>
  );
};

export default VideoGenerationButton;
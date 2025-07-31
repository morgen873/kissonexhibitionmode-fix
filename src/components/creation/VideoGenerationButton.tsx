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
  const { generateVideo, isGeneratingVideo, isPolling } = useVideoGeneration();

  const isProcessing = isGeneratingVideo || isPolling;

  const handleGenerateVideo = async () => {
    try {
      console.log('🎬 VideoGenerationButton: Starting video generation process');
      // Extract image prompt from recipe data if available
      const imagePrompt = (recipe as any)?.imagePrompt;
      console.log('🎬 VideoGenerationButton: About to call generateVideo');
      const videoUrl = await generateVideo(recipe.imageUrl, recipeId, recipe.name, imagePrompt);
      console.log('🎬 VideoGenerationButton: generateVideo returned:', videoUrl);
      if (videoUrl) {
        // Open video in a pop-up window with video player
        console.log('🎬 VideoGenerationButton: Opening video in pop-up window:', videoUrl);
        const popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (popup) {
          popup.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>360° Recipe Video</title>
              <style>
                body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                video { max-width: 100%; max-height: 100%; border-radius: 8px; }
              </style>
            </head>
            <body>
              <video controls autoplay loop>
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </body>
            </html>
          `);
          popup.document.close();
        }
        if (onVideoGenerated) {
          onVideoGenerated(videoUrl);
        }
      } else {
        console.log('❌ VideoGenerationButton: No video URL returned');
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error('Video generation failed:', error);
    }
  };

  const getButtonText = () => {
    if (isGeneratingVideo) return 'Starting Generation...';
    if (isPolling) return 'Generating 360° Video...';
    return 'Generate 360° Video';
  };

  return (
    <Button 
      onClick={handleGenerateVideo}
      disabled={isProcessing || recipe.imageUrl === '/placeholder.svg'}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {getButtonText()}
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
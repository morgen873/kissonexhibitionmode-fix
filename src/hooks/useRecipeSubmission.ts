
import { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import { RecipeService } from '@/services/recipeService';
import { useVideoGeneration } from './useVideoGeneration';

export const useRecipeSubmission = () => {
  const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const { generateVideo, isGeneratingVideo } = useVideoGeneration();

  const handleSubmit = async (
    answers: { [key: number]: string | string[] },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } },
    timelineValue?: string
  ) => {
    setIsCreatingRecipe(true);
    
    try {
      const payload = RecipeService.processAnswers(answers, customAnswers, controlValues, timelineValue);
      const newRecipe = await RecipeService.generateRecipe(payload);
      const recipeUrl = RecipeService.createRecipeUrl(newRecipe.id);

      console.log("=== ✅ RECIPE GENERATION COMPLETE ===");
      console.log("📋 Recipe received:", newRecipe);

      const recipeResult: RecipeResult = {
        name: newRecipe.title,
        imageUrl: newRecipe.image_url || "/placeholder.svg",
        qrData: recipeUrl
      };

      // Try to generate video if we have a real image (not placeholder)
      if (newRecipe.image_url && newRecipe.image_url !== '/placeholder.svg') {
        console.log("🎬 Starting video generation...");
        
        try {
          const videoUrl = await generateVideo({
            imageUrl: newRecipe.image_url,
            recipeTitle: newRecipe.title,
            recipeId: newRecipe.id
          });

          if (videoUrl) {
            recipeResult.videoUrl = videoUrl;
            console.log("✅ Video generation completed:", videoUrl);
          } else {
            console.log("⏳ Video generation started but not completed immediately");
          }
        } catch (videoError) {
          console.error('⚠️ Video generation failed, continuing without video:', videoError);
          // Continue without video - this is not a critical failure
        }
      }

      setRecipeResult(recipeResult);

    } catch (error) {
      console.error('❌ Error creating recipe:', error);
    } finally {
      setIsCreatingRecipe(false);
    }
  };

  const resetRecipe = () => {
    setRecipeResult(null);
    setIsCreatingRecipe(false);
  };

  return {
    recipeResult,
    isCreatingRecipe: isCreatingRecipe || isGeneratingVideo,
    handleSubmit,
    resetRecipe
  };
};

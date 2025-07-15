
import { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import { RecipeService } from '@/services/recipeService';
import { useBackgroundVideoGeneration } from './useBackgroundVideoGeneration';

export const useRecipeSubmission = () => {
  const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const { startBackgroundVideoGeneration, getVideoStatus } = useBackgroundVideoGeneration();

  const handleSubmit = async (
    answers: { [key: number]: string | string[] },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } },
    timelineValue?: string
  ) => {
    setIsCreatingRecipe(true);
    
    try {
      console.log("🚀 Starting recipe generation...");
      const payload = RecipeService.processAnswers(answers, customAnswers, controlValues, timelineValue);
      const newRecipe = await RecipeService.generateRecipe(payload);
      const recipeUrl = RecipeService.createRecipeUrl(newRecipe.id);

      console.log("=== ✅ RECIPE GENERATION COMPLETE ===");
      console.log("📋 Recipe received:", newRecipe);

      const recipeResult: RecipeResult = {
        id: newRecipe.id,
        name: newRecipe.title,
        imageUrl: newRecipe.image_url || "/placeholder.svg",
        qrData: recipeUrl
      };

      // Show recipe immediately, start video generation in background
      setRecipeResult(recipeResult);
      setIsCreatingRecipe(false);

      // Background video generation (non-blocking)
      if (newRecipe.image_url && newRecipe.image_url !== '/placeholder.svg') {
        console.log("🎬 Starting background video generation...");
        
        // Don't await - let it run in background
        startBackgroundVideoGeneration({
          imageUrl: newRecipe.image_url,
          recipeTitle: newRecipe.title,
          recipeId: newRecipe.id
        }).then((videoUrl) => {
          if (videoUrl) {
            console.log("✅ Background video generation completed:", videoUrl);
            // Update the recipe result with video URL
            setRecipeResult(prev => prev ? { ...prev, videoUrl } : null);
          }
        }).catch((videoError) => {
          console.error('⚠️ Background video generation failed:', videoError);
          // Video generation failed, but recipe is still valid
        });
      }

    } catch (error) {
      console.error('❌ Error creating recipe:', error);
      setIsCreatingRecipe(false);
    }
  };

  const resetRecipe = () => {
    setRecipeResult(null);
    setIsCreatingRecipe(false);
  };

  return {
    recipeResult,
    isCreatingRecipe,
    handleSubmit,
    resetRecipe,
    getVideoStatus
  };
};

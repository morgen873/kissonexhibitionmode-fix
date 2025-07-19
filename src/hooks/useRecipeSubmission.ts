
import { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import { RecipeService } from '@/services/recipeService';
import { logImageGenerationResult } from '@/utils/imageGenerationMonitor';

export const useRecipeSubmission = () => {
  const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

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

      // Log successful image generation if image URL is present and not placeholder
      if (newRecipe.image_url && newRecipe.image_url !== "/placeholder.svg") {
        logImageGenerationResult(true, 'enhanced-system');
        console.log("✅ Image generation successful - logged to monitor");
      } else {
        logImageGenerationResult(false, 'enhanced-system', undefined, 'No image URL or placeholder used');
        console.log("❌ Image generation failed - logged to monitor");
      }

      setRecipeId(newRecipe.id);
      
      // Extract image prompt from recipe_data if available
      let imagePrompt: string | undefined;
      if (newRecipe.recipe_data && typeof newRecipe.recipe_data === 'object') {
        const recipeData = newRecipe.recipe_data as any;
        imagePrompt = recipeData.imagePrompt;
      }
      
      setRecipeResult({
        name: newRecipe.title,
        imageUrl: newRecipe.image_url || "/placeholder.svg",
        qrData: recipeUrl,
        imagePrompt
      });

    } catch (error) {
      console.error('❌ Error creating recipe:', error);
      logImageGenerationResult(false, 'enhanced-system', undefined, error.message);
    } finally {
      setIsCreatingRecipe(false);
    }
  };

  const resetRecipe = () => {
    setRecipeResult(null);
    setRecipeId(null);
    setIsCreatingRecipe(false);
  };

  return {
    recipeResult,
    recipeId,
    isCreatingRecipe,
    handleSubmit,
    resetRecipe
  };
};

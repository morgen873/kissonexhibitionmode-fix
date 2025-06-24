
import { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import { RecipeService } from '@/services/recipeService';

export const useRecipeSubmission = () => {
  const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

  const handleSubmit = async (
    answers: { [key: number]: string },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }
  ) => {
    setIsCreatingRecipe(true);
    
    try {
      const payload = RecipeService.processAnswers(answers, customAnswers, controlValues);
      const newRecipe = await RecipeService.generateRecipe(payload);
      const recipeUrl = RecipeService.createRecipeUrl(newRecipe.id);

      console.log("=== ✅ RECIPE GENERATION COMPLETE ===");
      console.log("📋 Recipe received:", newRecipe);

      setRecipeResult({
        name: newRecipe.title,
        imageUrl: newRecipe.image_url || "/placeholder.svg",
        qrData: recipeUrl
      });

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
    isCreatingRecipe,
    handleSubmit,
    resetRecipe
  };
};

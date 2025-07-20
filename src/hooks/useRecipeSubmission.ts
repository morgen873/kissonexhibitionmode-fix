
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
      console.log("=== ENHANCED RECIPE SUBMISSION PROCESS ===");
      console.log("📋 Processing form data...");
      
      const payload = RecipeService.processAnswers(answers, customAnswers, controlValues, timelineValue);
      console.log("✅ Payload processed successfully");
      console.log("📊 Payload summary:", {
        hasQuestions: !!payload.questions && Object.keys(payload.questions).length > 0,
        hasTimeline: !!payload.timeline && Object.keys(payload.timeline).length > 0,
        hasControls: !!payload.controls && Object.keys(payload.controls).length > 0
      });
      
      console.log("🚀 Calling recipe generation service...");
      const newRecipe = await RecipeService.generateRecipe(payload);
      console.log("✅ Recipe generation completed");
      
      const recipeUrl = RecipeService.createRecipeUrl(newRecipe.id);
      console.log("🔗 Recipe URL created:", recipeUrl);

      console.log("=== ✅ RECIPE GENERATION COMPLETE ===");
      console.log("📋 Recipe received:", {
        id: newRecipe.id,
        title: newRecipe.title,
        hasImageUrl: !!newRecipe.image_url,
        imageUrl: newRecipe.image_url,
        isPlaceholder: newRecipe.image_url === "/placeholder.svg"
      });

      // Enhanced image generation logging
      const imageGenerationSuccessful = newRecipe.image_url && newRecipe.image_url !== "/placeholder.svg";
      
      if (imageGenerationSuccessful) {
        logImageGenerationResult(true, 'enhanced-openai-system');
        console.log("✅ Image generation successful - logged to monitor");
        console.log("🖼️ Image URL:", newRecipe.image_url);
        
        // Test the image URL immediately
        try {
          const testResponse = await fetch(newRecipe.image_url, { method: 'HEAD' });
          console.log("🔍 Image URL test result:", {
            status: testResponse.status,
            ok: testResponse.ok,
            contentType: testResponse.headers.get('content-type')
          });
        } catch (testError) {
          console.log("⚠️ Image URL test failed:", testError.message);
        }
      } else {
        logImageGenerationResult(false, 'enhanced-openai-system', undefined, 'No image URL or placeholder used');
        console.log("❌ Image generation failed - logged to monitor");
        console.log("🔍 Debugging info:", {
          imageUrl: newRecipe.image_url,
          isNull: newRecipe.image_url === null,
          isUndefined: newRecipe.image_url === undefined,
          isPlaceholder: newRecipe.image_url === "/placeholder.svg"
        });
      }

      setRecipeId(newRecipe.id);
      
      // Extract image prompt from recipe_data if available
      let imagePrompt: string | undefined;
      if (newRecipe.recipe_data && typeof newRecipe.recipe_data === 'object') {
        const recipeData = newRecipe.recipe_data as any;
        imagePrompt = recipeData.imagePrompt;
        console.log("🎨 Image prompt extracted:", !!imagePrompt);
      }
      
      const finalResult: RecipeResult = {
        name: newRecipe.title,
        imageUrl: newRecipe.image_url || "/placeholder.svg",
        qrData: recipeUrl,
        imagePrompt
      };
      
      console.log("📋 Final recipe result:", {
        name: finalResult.name,
        imageUrl: finalResult.imageUrl,
        hasQrData: !!finalResult.qrData,
        hasImagePrompt: !!finalResult.imagePrompt
      });
      
      setRecipeResult(finalResult);

    } catch (error) {
      console.error('❌ ENHANCED ERROR HANDLING - Recipe creation failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      logImageGenerationResult(false, 'enhanced-openai-system', undefined, error.message);
      
      // User-friendly error handling
      console.log("🔄 Setting fallback recipe result due to error");
      setRecipeResult({
        name: 'Recipe Generation Failed',
        imageUrl: '/placeholder.svg',
        qrData: '',
        imagePrompt: undefined
      });
    } finally {
      setIsCreatingRecipe(false);
      console.log("🏁 Recipe submission process completed");
    }
  };

  const resetRecipe = () => {
    console.log("🔄 Resetting recipe state");
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

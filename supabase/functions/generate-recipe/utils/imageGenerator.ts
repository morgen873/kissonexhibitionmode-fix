
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildSimplifiedPrompt } from './simplifiedPromptBuilder.ts'
import { uploadImageToSupabase } from './imageUploader.ts'
import { generateImageWithEnhancedFallback } from './enhancedImageHandler.ts'
import { buildImageContext, ImageContext } from './imageContextBuilder.ts'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

interface SavedRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: any;
  cooking_recipe: string;
  recipe_data: any;
}

export async function generateAndUploadRecipeImage(
  payload: RecipePayload,
  savedRecipe: SavedRecipe,
  recipeId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string> {
  try {
    console.log("=== 🚀 ENHANCED IMAGE GENERATION SYSTEM ===");
    
    // Step 1: Build image context from payload and saved recipe
    const imageContext = buildImageContext(payload, savedRecipe);
    console.log("📊 Image context built:", {
      shape: imageContext.dumplingShape,
      flavor: imageContext.flavor,
      timeline: imageContext.timelineTheme
    });
    
    // Step 2: Generate simplified prompt with negative prompts
    console.log("📝 Building simplified prompt...");
    const { prompt, negativePrompt } = buildSimplifiedPrompt({
      dumplingShape: imageContext.dumplingShape,
      flavor: imageContext.flavor,
      timelineTheme: imageContext.timelineTheme,
      ingredientsList: imageContext.ingredientsList,
      recipeTitle: imageContext.recipeTitle
    });
    
    console.log("✅ Prompts generated:");
    console.log("- Main prompt length:", prompt.length);
    console.log("- Negative prompt elements:", negativePrompt.split(', ').length);
    console.log("- Main prompt preview:", prompt.substring(0, 150));
    
    // Step 2.5: Save the simplified prompt to the database
    try {
      const { updateRecipeWithImagePrompt } = await import('./databaseOperations.ts');
      await updateRecipeWithImagePrompt(supabaseAdmin, recipeId, prompt);
      console.log("✅ Simplified prompt saved to database");
    } catch (error) {
      console.error("❌ Failed to save prompt:", error);
      // Don't fail the whole process
    }
    
    // Step 3: Generate image with enhanced system
    console.log("🎨 Starting enhanced image generation...");
    const { imageData, usedModel, attempts } = await generateImageWithEnhancedFallback(
      prompt,
      negativePrompt,
      imageContext
    );
    
    console.log(`✅ Image generated successfully!`);
    console.log(`- Model used: ${usedModel.toUpperCase()}`);
    console.log(`- Total attempts: ${attempts}`);
    console.log(`- Image data size: ${imageData.length}`);
    
    // Step 4: Upload to Supabase
    console.log("📤 Uploading to Supabase...");
    const imageUrl = await uploadImageToSupabase(imageData, recipeId, supabaseAdmin);
    
    console.log("🎉 ENHANCED GENERATION COMPLETE!");
    console.log(`- Final URL: ${imageUrl}`);
    console.log(`- Model: ${usedModel.toUpperCase()}`);
    console.log(`- Attempts: ${attempts}`);
    
    return imageUrl || '/placeholder.svg';
    
  } catch (error) {
    console.error("❌ ENHANCED IMAGE GENERATION FAILED:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      recipeId: recipeId,
      recipeTitle: savedRecipe.title
    });
    
    // Log for monitoring
    console.error("ENHANCED_IMAGE_GENERATION_FAILURE", {
      recipeId,
      recipeTitle: savedRecipe.title,
      errorType: error.name,
      errorMessage: error.message,
      timestamp: new Date().toISOString()
    });
    
    return '/placeholder.svg';
  }
}

// Re-export for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateImagePrompt } from './imagePromptGenerator.ts'
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
    console.log("=== 🚀 TIME-PERIOD AWARE IMAGE GENERATION SYSTEM ===");
    
    // Step 1: Build image context from payload and saved recipe
    const imageContext = buildImageContext(payload, savedRecipe);
    console.log("📊 Image context built:", {
      shape: imageContext.dumplingShape,
      flavor: imageContext.flavor,
      timeline: imageContext.timelineTheme
    });
    
    // Step 2: Generate detailed time-period-specific prompt
    console.log("📝 Building time-period-specific prompt...");
    const prompt = generateImagePrompt({
      timelineTheme: imageContext.timelineTheme,
      emotionalContext: imageContext.emotionalContext,
      dumplingShape: imageContext.dumplingShape,
      flavor: imageContext.flavor,
      ingredientsList: imageContext.ingredientsList,
      recipeTitle: imageContext.recipeTitle
    });
    
    console.log("✅ Time-period-specific prompt generated:");
    console.log("- Prompt length:", prompt.length);
    console.log("- Timeline theme:", imageContext.timelineTheme);
    console.log("- Prompt preview:", prompt.substring(0, 200));
    
    // Step 2.5: Save the time-period-specific prompt to the database
    try {
      const { updateRecipeWithImagePrompt } = await import('./databaseOperations.ts');
      await updateRecipeWithImagePrompt(supabaseAdmin, recipeId, prompt);
      console.log("✅ Time-period-specific prompt saved to database");
    } catch (error) {
      console.error("❌ Failed to save prompt:", error);
      // Don't fail the whole process
    }
    
    // Step 3: Generate image with enhanced system using detailed prompt
    console.log("🎨 Starting enhanced image generation with time-period-specific prompt...");
    const { imageData, usedModel, attempts } = await generateImageWithEnhancedFallback(
      prompt,
      "text, writing, letters, words, labels, watermarks, logos, signatures, copyright, blurred, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, missing parts, duplicate, multiple dumplings, plate, bowl, utensils, background elements", // Standard negative prompt
      imageContext
    );
    
    console.log(`✅ Time-period-aware image generated successfully!`);
    console.log(`- Model used: ${usedModel.toUpperCase()}`);
    console.log(`- Total attempts: ${attempts}`);
    console.log(`- Image data size: ${imageData.length}`);
    console.log(`- Timeline: ${imageContext.timelineTheme}`);
    
    // Step 4: Upload to Supabase
    console.log("📤 Uploading to Supabase...");
    console.log("- Image data size:", imageData.length);
    console.log("- Recipe ID:", recipeId);
    
    const imageUrl = await uploadImageToSupabase(imageData, recipeId, supabaseAdmin);
    
    console.log("📤 Upload result:", imageUrl ? "SUCCESS" : "FAILED");
    console.log("- Returned URL:", imageUrl);
    
    if (!imageUrl) {
      console.error("❌ Upload failed - imageUrl is null/undefined");
      return '/placeholder.svg';
    }
    
    console.log("🎉 TIME-PERIOD-AWARE GENERATION COMPLETE!");
    console.log(`- Final URL: ${imageUrl}`);
    console.log(`- Model: ${usedModel.toUpperCase()}`);
    console.log(`- Timeline: ${imageContext.timelineTheme}`);
    console.log(`- Attempts: ${attempts}`);
    
    return imageUrl;
    
  } catch (error) {
    console.error("❌ TIME-PERIOD-AWARE IMAGE GENERATION FAILED:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      recipeId: recipeId,
      recipeTitle: savedRecipe.title
    });
    
    // Log for monitoring
    console.error("TIME_PERIOD_IMAGE_GENERATION_FAILURE", {
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

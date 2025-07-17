
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateImagePrompt } from './imagePromptGenerator.ts'
import { uploadImageToSupabase } from './imageUploader.ts'
import { generateImageWithFallback } from './imageModelHandler.ts'
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
    console.log("=== 🚀 IMAGE GENERATION WITH REPLICATE STABILITY AI ===");
    
    // Step 0: Check Replicate token immediately
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
    console.log("🔑 REPLICATE TOKEN CHECK:");
    console.log("- Token exists:", !!replicateToken);
    console.log("- Token length:", replicateToken ? replicateToken.length : 0);
    console.log("- Token starts with:", replicateToken ? replicateToken.substring(0, 8) + "..." : "N/A");
    
    if (!replicateToken) {
      console.error("❌ CRITICAL: REPLICATE_API_TOKEN not found in environment");
      throw new Error("REPLICATE_API_TOKEN is missing - cannot generate images");
    }
    
    // Step 1: Build image context from payload and saved recipe
    const imageContext = buildImageContext(payload, savedRecipe);
    
    // Step 2: Generate the prompt using our system
    console.log("📥 CALLING generateImagePrompt...");
    const imagePrompt = generateImagePrompt(imageContext);
    
    console.log("🔍 PROMPT VERIFICATION:");
    console.log("- Prompt length:", imagePrompt.length);
    console.log("- First 200 chars:", imagePrompt.substring(0, 200));
    
    // Step 2.5: Save the image prompt to the database for video generation
    try {
      const { updateRecipeWithImagePrompt } = await import('./databaseOperations.ts');
      await updateRecipeWithImagePrompt(supabaseAdmin, recipeId, imagePrompt);
      console.log("✅ Image prompt saved to database for video generation");
    } catch (error) {
      console.error("❌ Failed to save image prompt:", error);
      // Don't fail the whole process if this fails
    }
    
    // Step 3: Generate image with Replicate Stability AI fallback strategy
    console.log("🎯 STARTING REPLICATE IMAGE GENERATION...");
    const { imageData, usedModel } = await generateImageWithFallback(
      imagePrompt,
      imageContext
    );
    
    console.log(`✅ IMAGE GENERATED USING: ${usedModel.toUpperCase()}`);
    console.log("✅ IMAGE DATA EXTRACTED, LENGTH:", imageData.length);
    
    // Step 4: Upload to Supabase
    console.log("📤 UPLOADING TO SUPABASE...");
    const imageUrl = await uploadImageToSupabase(imageData, recipeId, supabaseAdmin);
    
    console.log("📥 UPLOAD RESULT:", imageUrl);
    console.log(`🎉 COMPLETE: Generated with ${usedModel.toUpperCase()}`);
    
    return imageUrl || '/placeholder.svg';
    
  } catch (error) {
    console.error("❌ CRITICAL IMAGE GENERATION ERROR:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // More detailed error logging
    if (error.message.includes('REPLICATE_API_TOKEN')) {
      console.error("🔑 TOKEN ISSUE: Check if REPLICATE_API_TOKEN is set in Supabase secrets");
    }
    if (error.message.includes('fetch')) {
      console.error("🌐 NETWORK ISSUE: Check if Replicate API is accessible");
    }
    
    return '/placeholder.svg';
  }
}

// Re-export for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

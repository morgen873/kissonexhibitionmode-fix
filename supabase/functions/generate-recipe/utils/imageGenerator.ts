import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { buildImageContext } from './imageContextBuilder.ts';
import { generateImagePrompt } from './imagePromptGenerator.ts';
import { generateImageWithEnhancedFallback } from './enhancedImageHandler.ts';
import { uploadImageToSupabase } from './imageUploader.ts';

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: string]: any };
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
  console.log("=== 🚀 TIME-PERIOD AWARE IMAGE GENERATION SYSTEM ===");
  console.log("📋 BUILDING IMAGE CONTEXT...");
  console.log("- Original user payload (questions, timeline, controls)");
  console.log("- SAVED recipe data from database (title, ingredients)");
  console.log("- Recipe ID:", recipeId);
  
  try {
    // Build comprehensive image context from both user input and saved recipe
    console.log("📊 Image context built: { shape: \"organic\", flavor: \"sweet\", timeline: \"Present\" }");
    const imageContext = buildImageContext(payload, savedRecipe);
    console.log("📋 FINAL IMAGE CONTEXT CREATED:");
    console.log(JSON.stringify(imageContext, null, 2));
    
    // Generate time-period specific prompt
    console.log("📝 Building time-period-specific prompt...");
    const imagePrompt = generateImagePrompt(imageContext);
    console.log("✅ Time-period-specific prompt generated:");
    console.log("- Timeline theme:", imageContext.timelineTheme);
    console.log("- Prompt length:", imagePrompt.length);
    console.log("- Prompt preview:", imagePrompt.substring(0, 200));
    
    // Save prompt to database for reference
    console.log("=== UPDATING RECIPE WITH IMAGE PROMPT ===");
    console.log("Recipe ID:", recipeId);
    console.log("Image prompt length:", imagePrompt.length);
    
    const { error: promptUpdateError } = await supabaseAdmin
      .from('recipes')
      .update({ 
        image_prompt: imagePrompt,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId);
    
    if (promptUpdateError) {
      console.log("⚠️ Failed to save image prompt to database:", promptUpdateError);
    } else {
      console.log("✅ Time-period-specific prompt saved to database");
      console.log("✅ Recipe successfully updated with image prompt");
    }
    
    // Generate image with enhanced fallback system
    console.log("🎨 Starting enhanced image generation with time-period-specific prompt...");
    console.log("🎯 About to call generateImageWithEnhancedFallback...");
    
    const generatedImageB64 = await generateImageWithEnhancedFallback(
      imagePrompt,
      imageContext,
      recipeId
    );
    
    if (!generatedImageB64) {
      console.log("❌ Image generation failed completely - all fallbacks exhausted");
      return '/placeholder.svg';
    }
    
    console.log("✅ Image generated successfully, proceeding to upload...");
    
    // Upload to Supabase storage
    const publicUrl = await uploadImageToSupabase(generatedImageB64, recipeId, supabaseAdmin);
    
    if (!publicUrl) {
      console.log("❌ Image upload failed");
      return '/placeholder.svg';
    }
    
    console.log("=== ✅ IMAGE GENERATION AND UPLOAD COMPLETED ===");
    console.log("Final image URL:", publicUrl);
    
    return publicUrl;
    
  } catch (error) {
    console.log("❌ Error in generateAndUploadRecipeImage:", error);
    return '/placeholder.svg';
  }
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';
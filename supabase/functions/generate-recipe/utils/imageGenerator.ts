
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateImagePrompt, extractIngredientsList } from './imagePromptGenerator.ts'
import { uploadImageToSupabase } from './imageUploader.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  openai: OpenAI,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string> {
  try {
    console.log("=== IMAGE GENERATION WITH COMPLETE SAVED DATA ===");
    
    // Extract timeline theme from original user input
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("✓ Timeline theme from user:", `"${timelineTheme}"`);
    
    // Extract emotional context from original user input
    const questionValues = Object.values(payload.questions);
    const emotionalContext = questionValues.length > 0 ? questionValues.join(', ') : 'comfort and warmth';
    console.log("✓ Emotional context from user:", `"${emotionalContext}"`);
    
    // Extract controls from original user input
    const controlValues = Object.values(payload.controls);
    const controls = controlValues.length > 0 ? controlValues[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    console.log("✓ Controls from user:", controls);
    
    // CRITICAL: Extract ingredients from BOTH saved recipe AND original enhancer
    console.log("=== INGREDIENT EXTRACTION FROM SAVED RECIPE + USER INPUT ===");
    
    // Get ingredients from SAVED recipe (this is now complete and final)
    const savedRecipeIngredients = extractIngredientsList(savedRecipe.ingredients);
    console.log("✓ Saved recipe ingredients:", savedRecipeIngredients);
    
    // Get ingredients from original enhancer field
    const enhancerIngredients: string[] = [];
    if (controls.enhancer && controls.enhancer.trim() !== '') {
      const enhancerParts = controls.enhancer.split(/[,&+\s]+/).filter(part => part.trim().length > 0);
      enhancerParts.forEach(part => {
        const cleanPart = part.trim().toLowerCase();
        if (cleanPart.length > 2) {
          enhancerIngredients.push(cleanPart);
        }
      });
    }
    console.log("✓ Enhancer ingredients from user:", enhancerIngredients);
    
    // Prioritize enhancer ingredients (user's specific color requests), then saved recipe ingredients
    const allIngredients = [...enhancerIngredients, ...savedRecipeIngredients];
    console.log("✓ FINAL combined ingredients (enhancer + saved recipe):", allIngredients);
    
    if (allIngredients.length === 0) {
      console.log("🚨 CRITICAL: NO INGREDIENTS FOUND FROM EITHER SOURCE!");
      console.log("Saved recipe ingredients data:", savedRecipe.ingredients);
      console.log("Enhancer field:", controls.enhancer);
    }
    
    // Generate image prompt with complete data
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: allIngredients,
      recipeTitle: savedRecipe.title
    });
    
    console.log("=== SENDING TO DALL-E WITH COMPLETE DATA ===");
    console.log("Final prompt:", imagePrompt);
    console.log("Using saved recipe title:", savedRecipe.title);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'natural',
      quality: 'hd',
    });
    
    console.log("✅ DALL-E response received");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // Upload to Supabase
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in image generation:", error);
    return '/placeholder.svg';
  }
}

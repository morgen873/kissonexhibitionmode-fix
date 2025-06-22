
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateImagePrompt, extractIngredientsList } from './imagePromptGenerator.ts'
import { uploadImageToSupabase } from './imageUploader.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export async function generateAndUploadRecipeImage(
  payload: RecipePayload,
  recipeContent: any,
  recipeId: string,
  openai: OpenAI,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string> {
  try {
    console.log("=== SIMPLIFIED IMAGE GENERATION FLOW ===");
    
    // Extract timeline theme
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("✓ Timeline theme:", `"${timelineTheme}"`);
    
    // Extract emotional context
    const questionValues = Object.values(payload.questions);
    const emotionalContext = questionValues.length > 0 ? questionValues.join(', ') : 'comfort and warmth';
    console.log("✓ Emotional context:", `"${emotionalContext}"`);
    
    // Extract controls
    const controlValues = Object.values(payload.controls);
    const controls = controlValues.length > 0 ? controlValues[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    console.log("✓ Controls extracted:", controls);
    
    // CRITICAL: Extract ingredients from BOTH recipe AND enhancer field
    console.log("=== INGREDIENT EXTRACTION FROM MULTIPLE SOURCES ===");
    
    // Get ingredients from AI recipe
    const recipeIngredients = extractIngredientsList(recipeContent.ingredients);
    console.log("✓ Recipe ingredients:", recipeIngredients);
    
    // Get ingredients from enhancer field (this is key!)
    const enhancerIngredients: string[] = [];
    if (controls.enhancer && controls.enhancer.trim() !== '') {
      // Split enhancer by common separators and clean up
      const enhancerParts = controls.enhancer.split(/[,&+\s]+/).filter(part => part.trim().length > 0);
      enhancerParts.forEach(part => {
        const cleanPart = part.trim().toLowerCase();
        if (cleanPart.length > 2) {
          enhancerIngredients.push(cleanPart);
        }
      });
    }
    console.log("✓ Enhancer ingredients:", enhancerIngredients);
    
    // Combine all ingredients with enhancer first (higher priority for colors)
    const allIngredients = [...enhancerIngredients, ...recipeIngredients];
    console.log("✓ Combined ingredients (enhancer priority):", allIngredients);
    
    if (allIngredients.length === 0) {
      console.log("🚨 CRITICAL: NO INGREDIENTS FOUND AT ALL!");
      console.log("Recipe content:", recipeContent);
      console.log("Enhancer field:", controls.enhancer);
    }
    
    // Generate image prompt
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: allIngredients,
      recipeTitle: recipeContent.title
    });
    
    console.log("=== SENDING TO DALL-E ===");
    console.log("Final prompt:", imagePrompt);
    
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
        console.log("✅ Image uploaded:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in image generation:", error);
    return '/placeholder.svg';
  }
}

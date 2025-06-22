
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
    console.log("=== IMAGE GENERATION DETAILED DEBUG ===");
    console.log("Payload received:", JSON.stringify(payload, null, 2));
    console.log("Recipe content:", JSON.stringify(recipeContent, null, 2));
    
    // Extract timeline theme with better debugging
    console.log("=== TIMELINE EXTRACTION ===");
    console.log("Timeline object:", payload.timeline);
    console.log("Timeline keys:", Object.keys(payload.timeline));
    console.log("Timeline values:", Object.values(payload.timeline));
    
    const timelineEntries = Object.values(payload.timeline);
    const timelineTheme = timelineEntries.length > 0 ? timelineEntries[0] : 'present day';
    console.log("Extracted timeline theme:", `"${timelineTheme}"`);
    
    // Extract emotional context with better debugging
    console.log("=== EMOTIONAL CONTEXT EXTRACTION ===");
    console.log("Questions object:", payload.questions);
    console.log("Questions keys:", Object.keys(payload.questions));
    console.log("Questions values:", Object.values(payload.questions));
    
    const questionAnswers = Object.values(payload.questions);
    const emotionalContext = questionAnswers.length > 0 ? questionAnswers.join(', ') : 'comfort and warmth';
    console.log("Extracted emotional context:", `"${emotionalContext}"`);
    
    // Extract control values with better debugging
    console.log("=== CONTROLS EXTRACTION ===");
    console.log("Controls object:", payload.controls);
    console.log("Controls keys:", Object.keys(payload.controls));
    console.log("Controls values:", Object.values(payload.controls));
    
    const controlEntries = Object.values(payload.controls);
    const controls = controlEntries.length > 0 ? controlEntries[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    console.log("Extracted controls:", controls);
    
    // Extract key ingredients for visual representation
    console.log("=== INGREDIENTS EXTRACTION ===");
    const ingredientsList = extractIngredientsList(recipeContent.ingredients);
    console.log("Final ingredients list for image:", ingredientsList);
    
    // Validation checks
    if (!timelineTheme || timelineTheme.trim() === '' || timelineTheme === 'present day') {
      console.warn("Timeline theme is missing or default - this may cause generic images");
      console.warn("Available timeline data:", payload.timeline);
    }
    if (!emotionalContext || emotionalContext.trim() === '') {
      console.warn("Emotional context is missing - this may cause generic images");
      console.warn("Available questions data:", payload.questions);
    }
    if (ingredientsList.length === 0) {
      console.warn("No ingredients extracted - this may cause generic images");
      console.warn("Available ingredients data:", recipeContent.ingredients);
    }
    
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: ingredientsList,
      recipeTitle: recipeContent.title
    });
    
    console.log("=== FINAL GENERATED IMAGE PROMPT ===");
    console.log(imagePrompt);
    console.log("==========================================");
    
    console.log("Sending to DALL-E with the following parameters:");
    console.log("- Timeline theme:", `"${timelineTheme}"`);
    console.log("- Emotional context:", `"${emotionalContext}"`);
    console.log("- Dumpling shape:", controls.shape);
    console.log("- Flavor:", controls.flavor);
    console.log("- Key ingredients:", ingredientsList.slice(0, 3));
    console.log("- Recipe title:", recipeContent.title);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'natural',
    });
    
    console.log("DALL-E image generated successfully");
    const imageB64 = imageResponse.data[0].b64_json;
    
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("Image uploaded and URL generated:", imageUrl);
        return imageUrl;
      }
    }
    
    console.log("Failed to generate/upload image, using placeholder");
    return '/placeholder.svg';
  } catch (error) {
    console.error("Error generating/uploading image:", error);
    return '/placeholder.svg';
  }
}

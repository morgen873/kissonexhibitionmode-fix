
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
    const dumplingShape = Object.values(payload.controls)[0]?.shape || 'classic';
    const flavor = Object.values(payload.controls)[0]?.flavor || 'mild';
    const timelineTheme = Object.values(payload.timeline)[0] || 'present';
    
    // Extract emotional context from user's answers
    const userAnswers = Object.values(payload.questions);
    const emotionalContext = userAnswers.join(', ');
    
    // Extract key ingredients for visual representation
    const ingredientsList = extractIngredientsList(recipeContent.ingredients);
    
    const imagePrompt = generateImagePrompt({
      timelineTheme,
      emotionalContext,
      dumplingShape,
      flavor,
      ingredientsList,
      recipeTitle: recipeContent.title
    });
    
    console.log("Generating emotionally resonant image with DALL-E...");
    console.log("Timeline theme:", timelineTheme);
    console.log("Emotional context:", emotionalContext);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'natural',
    });
    
    console.log("Image generated successfully");
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

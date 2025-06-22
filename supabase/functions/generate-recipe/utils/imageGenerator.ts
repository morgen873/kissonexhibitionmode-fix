
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
    console.log("=== IMAGE GENERATION DEBUG ===");
    console.log("Payload received:", JSON.stringify(payload, null, 2));
    console.log("Recipe content:", JSON.stringify(recipeContent, null, 2));
    
    // Extract control values - get the first (and likely only) control entry
    const controlEntries = Object.values(payload.controls);
    const controls = controlEntries.length > 0 ? controlEntries[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    
    console.log("Extracted controls:", controls);
    
    // Extract timeline theme - get the first timeline answer
    const timelineEntries = Object.values(payload.timeline);
    const timelineTheme = timelineEntries.length > 0 ? timelineEntries[0] : 'present';
    
    console.log("Extracted timeline theme:", timelineTheme);
    
    // Extract emotional context from user's answers - combine all question answers
    const questionAnswers = Object.values(payload.questions);
    const emotionalContext = questionAnswers.length > 0 ? questionAnswers.join(', ') : 'comfort and warmth';
    
    console.log("Extracted emotional context:", emotionalContext);
    
    // Extract key ingredients for visual representation
    const ingredientsList = extractIngredientsList(recipeContent.ingredients);
    console.log("Extracted ingredients list:", ingredientsList);
    
    // Ensure we have meaningful data
    if (!timelineTheme || timelineTheme.trim() === '') {
      console.warn("No timeline theme found, using default");
    }
    if (!emotionalContext || emotionalContext.trim() === '') {
      console.warn("No emotional context found, using default");
    }
    
    const imagePrompt = generateImagePrompt({
      timelineTheme,
      emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList,
      recipeTitle: recipeContent.title
    });
    
    console.log("=== GENERATED IMAGE PROMPT ===");
    console.log(imagePrompt);
    console.log("=============================");
    
    console.log("Generating emotionally resonant image with DALL-E...");
    console.log("Timeline theme:", timelineTheme);
    console.log("Emotional context:", emotionalContext);
    console.log("Dumpling shape:", controls.shape);
    console.log("Flavor:", controls.flavor);
    console.log("Enhancer:", controls.enhancer);
    
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

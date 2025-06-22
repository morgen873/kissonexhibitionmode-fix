
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { extractIngredientColors } from './colorExtractor.ts'
import { extractIngredientsList } from './ingredientParser.ts'
import { uploadImageToSupabase } from './imageUploader.ts'

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
    console.log("=== UNIFIED IMAGE GENERATION WITH SAME INSTRUCTIONS AS RECIPE ===");
    
    // Use the EXACT SAME prompt structure as the recipe generator
    const imagePrompt = generateUnifiedImagePrompt(payload, savedRecipe);
    
    console.log("=== SENDING UNIFIED PROMPT TO DALL-E ===");
    console.log("Unified image prompt:", imagePrompt);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'vivid',
      quality: 'hd',
    });
    
    console.log("✅ DALL-E response received for unified image");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // Upload to Supabase
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Unified image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in unified image generation:", error);
    return '/placeholder.svg';
  }
}

function generateUnifiedImagePrompt(payload: RecipePayload, savedRecipe: SavedRecipe): string {
  console.log("=== GENERATING UNIFIED PROMPT (SAME AS RECIPE GENERATOR) ===");
  
  // Use the EXACT SAME instruction structure as the recipe generator
  const basePrompt = `
    You are a creative chef specializing in "Memory KissOn" dumplings. A user has provided the following inputs to create a unique recipe.
    Your task is to generate a dumpling IMAGE that meticulously incorporates all the user's choices.

    User Inputs:
    - Questions & Answers: ${JSON.stringify(payload.questions, null, 2)}
    - Timeline selection: ${JSON.stringify(payload.timeline, null, 2)}
    - Control settings: ${JSON.stringify(payload.controls, null, 2)}

    **Crucial Instructions:**
    The "Timeline selection" is the most important input. It defines the entire theme of the dumpling.
    - If the timeline is futuristic (e.g., "Distant Future"), the dumpling must be avant-garde and futuristic looking. Use experimental visual elements like holographic effects, neon colors, or sci-fi aesthetics. The appearance should look futuristic.
    - If the timeline is historical (e.g., "Ancient Past"), the dumpling must look traditional, using visual elements authentic to that period.
    - All other inputs (questions, controls) should be interpreted through the lens of the selected timeline. For example, a "spicy" flavor in a futuristic context might be visualized with glowing red elements, while in a historical context it would be represented with traditional spice colors.

    Generated Recipe Details:
    - Title: "${savedRecipe.title}"
    - Description: "${savedRecipe.description}"
    - Ingredients: ${JSON.stringify(savedRecipe.ingredients, null, 2)}

    Create a vibrant artistic illustration of this dumpling that matches the recipe title "${savedRecipe.title}" and timeline theme. The image should be stylized digital art, not realistic food photography. Use bright, saturated colors and artistic rendering that reflects both the timeline theme and the emotional context of the user's answers.
  `;

  // Extract timeline theme for additional specific styling
  const timelineValues = Object.values(payload.timeline);
  const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
  const timelineLower = timelineTheme.toLowerCase();
  
  let styleAddition = '';
  if (timelineLower.includes('future') || timelineLower.includes('distant')) {
    styleAddition = " FUTURISTIC STYLE: Holographic effects, neon lighting, metallic surfaces, translucent materials, and sci-fi aesthetics. Glowing edges and digital art style.";
  } else if (timelineLower.includes('ancient') || timelineLower.includes('past')) {
    styleAddition = " HISTORICAL STYLE: Traditional artistic techniques, classic color palettes, and period-appropriate visual elements. Watercolor or classical painting style.";
  } else {
    styleAddition = " CONTEMPORARY STYLE: Modern digital art with clean lines, vibrant colors, and contemporary design elements.";
  }

  const finalPrompt = basePrompt + styleAddition + " Black background. Pure artistic illustration style, NOT realistic food photography.";

  console.log("=== UNIFIED PROMPT GENERATED ===");
  console.log("Timeline theme extracted:", timelineTheme);
  console.log("Recipe title:", savedRecipe.title);
  console.log("Final unified prompt length:", finalPrompt.length);
  
  return finalPrompt;
}

// Re-export for compatibility
export { extractIngredientsList } from './ingredientParser.ts';


import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateImagePrompt } from './imagePromptGenerator.ts'
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
    console.log("=== ENHANCED IMAGE GENERATION WITH SPECIALIZED PROMPTS ===");
    
    // Extract the user inputs from the payload
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    
    const questionValues = Object.values(payload.questions);
    const emotionalContext = questionValues.join(' and ');
    
    // Extract control values
    const controlValues = Object.values(payload.controls)[0] || {
      shape: 'round',
      flavor: 'savory',
      temperature: 200,
      enhancer: 'none'
    };
    
    console.log("=== EXTRACTED USER INPUTS FOR IMAGE ===");
    console.log("Timeline theme:", timelineTheme);
    console.log("Emotional context:", emotionalContext);
    console.log("Control values:", controlValues);
    console.log("Recipe title:", savedRecipe.title);
    
    // Use the specialized image prompt generator with BOTH user data AND saved recipe data
    const imagePrompt = generateImagePrompt({
      timelineTheme,
      emotionalContext,
      dumplingShape: controlValues.shape,
      flavor: controlValues.flavor,
      ingredientsList: extractIngredientsFromSavedRecipe(savedRecipe.ingredients),
      recipeTitle: savedRecipe.title
    });
    
    console.log("=== SENDING SPECIALIZED PROMPT TO DALL-E ===");
    console.log("Specialized image prompt:", imagePrompt);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'vivid',
      quality: 'hd',
    });
    
    console.log("✅ DALL-E response received for specialized image");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // Upload to Supabase
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Specialized image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in specialized image generation:", error);
    return '/placeholder.svg';
  }
}

function extractIngredientsFromSavedRecipe(ingredients: any): string[] {
  console.log("=== EXTRACTING INGREDIENTS FROM SAVED RECIPE FOR IMAGE ===");
  console.log("Raw saved recipe ingredients:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
    // Handle different possible structures of saved ingredients
    if (Array.isArray(ingredients)) {
      ingredients.forEach((item: any) => {
        if (typeof item === 'string') {
          const cleanIngredient = cleanIngredientName(item);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    } else {
      // If ingredients is an object with categories
      Object.values(ingredients).forEach((categoryItems: any) => {
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach((item: any) => {
            const itemStr = typeof item === 'string' ? item : String(item);
            const cleanIngredient = cleanIngredientName(itemStr);
            if (cleanIngredient.length > 2) {
              ingredientsList.push(cleanIngredient);
            }
          });
        } else if (typeof categoryItems === 'string') {
          const cleanIngredient = cleanIngredientName(categoryItems);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    }
  }
  
  console.log("Final extracted ingredients for image generation:", ingredientsList);
  return ingredientsList;
}

function cleanIngredientName(item: string): string {
  return item
    .replace(/^\d+[\s\w]*\s+/, '') // Remove leading numbers and measurements
    .split(',')[0] // Take only the first part before comma
    .split('(')[0] // Remove parenthetical info
    .trim()
    .toLowerCase();
}

// Re-export for compatibility
export { extractIngredientsList } from './ingredientParser.ts';

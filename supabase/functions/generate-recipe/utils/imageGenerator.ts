
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
    console.log("=== DALL-E IMAGE GENERATION WITH ENHANCED DEBUGGING ===");
    
    // Extract user context with detailed logging
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    
    const questionValues = Object.values(payload.questions);
    const fullEmotionalContext = questionValues.join(' and ');
    
    const controlValues = Object.values(payload.controls)[0] || {
      shape: 'round',
      flavor: 'savory',
      temperature: 200,
      enhancer: 'none'
    };
    
    console.log("=== CONTEXT EXTRACTION FOR VIVID IMAGE GENERATION ===");
    console.log("Timeline theme:", `"${timelineTheme}"`);
    console.log("Full emotional context:", `"${fullEmotionalContext}"`);
    console.log("Control values:", controlValues);
    console.log("Recipe title:", `"${savedRecipe.title}"`);
    
    // Extract ingredients from saved recipe
    const ingredientsList = extractIngredientsFromSavedRecipe(savedRecipe.ingredients);
    console.log("Extracted ingredients:", ingredientsList);
    
    // Create enhanced context for vivid imagery
    const imageContext = {
      timelineTheme,
      emotionalContext: fullEmotionalContext,
      dumplingShape: controlValues.shape,
      flavor: controlValues.flavor,
      ingredientsList,
      recipeTitle: savedRecipe.title,
      recipeDescription: savedRecipe.description
    };
    
    // Generate the image prompt
    const imagePrompt = generateImagePrompt(imageContext);
    
    console.log("=== DALL-E REQUEST DETAILS ===");
    console.log("Final prompt length:", imagePrompt.length);
    console.log("Full prompt being sent to DALL-E:");
    console.log(imagePrompt);
    console.log("DALL-E parameters:");
    console.log("- Model: dall-e-3");
    console.log("- Size: 1024x1024");
    console.log("- Quality: hd");
    console.log("- Style: vivid");
    console.log("- Response format: b64_json");
    
    // Call DALL-E with enhanced error handling
    let imageResponse;
    try {
      imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
        style: 'vivid',
        quality: 'hd',
      });
      
      console.log("✅ DALL-E response received successfully");
      console.log("Response data structure:", {
        hasData: !!imageResponse.data,
        dataLength: imageResponse.data?.length,
        hasB64: !!imageResponse.data?.[0]?.b64_json
      });
      
    } catch (dalleError) {
      console.error("❌ DALL-E API Error:", dalleError);
      console.error("Error details:", {
        message: dalleError.message,
        status: dalleError.status,
        code: dalleError.code
      });
      return '/placeholder.svg';
    }
    
    const imageB64 = imageResponse.data[0]?.b64_json;
    
    if (!imageB64) {
      console.error("❌ No base64 image data received from DALL-E");
      console.error("Response structure:", JSON.stringify(imageResponse, null, 2));
      return '/placeholder.svg';
    }
    
    console.log("✅ Base64 image data received:");
    console.log("- Base64 length:", imageB64.length);
    console.log("- Base64 preview (first 50 chars):", imageB64.substring(0, 50));
    
    // Upload to Supabase with comprehensive tracking
    console.log("=== UPLOADING TO SUPABASE ===");
    const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
    
    if (imageUrl && imageUrl !== '/placeholder.svg') {
      console.log("✅ Image upload successful!");
      console.log("Final image URL:", imageUrl);
      return imageUrl;
    } else {
      console.error("❌ Image upload failed or returned placeholder");
      return '/placeholder.svg';
    }
    
  } catch (error) {
    console.error("❌ Critical error in image generation pipeline:", error);
    console.error("Error stack:", error.stack);
    return '/placeholder.svg';
  }
}

function extractIngredientsFromSavedRecipe(ingredients: any): string[] {
  console.log("=== INGREDIENTS EXTRACTION ===");
  console.log("Raw ingredients:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
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
  
  console.log("Final ingredients list:", ingredientsList);
  return ingredientsList;
}

function cleanIngredientName(item: string): string {
  return item
    .replace(/^\d+[\s\w]*\s+/, '')
    .split(',')[0]
    .split('(')[0]
    .trim()
    .toLowerCase();
}

export { extractIngredientsList } from './ingredientParser.ts';

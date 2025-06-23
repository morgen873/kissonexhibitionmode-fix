
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
    console.log("=== 🚀 GPT-IMAGE-1 GENERATION PIPELINE ===");
    
    // Step 1: Extract timeline theme - this is the key piece
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("🕐 TIMELINE EXTRACTION:");
    console.log("- Raw timeline values:", timelineValues);
    console.log("- Selected timeline theme:", `"${timelineTheme}"`);
    
    // Step 2: Extract other context
    const questionValues = Object.values(payload.questions);
    const fullEmotionalContext = questionValues.join(' and ');
    
    const controlValues = Object.values(payload.controls)[0] || {
      shape: 'round',
      flavor: 'savory',
      temperature: 200,
      enhancer: 'none'
    };
    
    // Step 3: Extract ingredients
    const ingredientsList = extractIngredientsFromSavedRecipe(savedRecipe.ingredients);
    
    // Step 4: Create image context
    const imageContext = {
      timelineTheme,
      emotionalContext: fullEmotionalContext,
      dumplingShape: controlValues.shape,
      flavor: controlValues.flavor,
      ingredientsList,
      recipeTitle: savedRecipe.title
    };
    
    console.log("📋 IMAGE CONTEXT CREATED:");
    console.log(JSON.stringify(imageContext, null, 2));
    
    // Step 5: Generate the prompt using our system
    console.log("📥 CALLING generateImagePrompt...");
    const imagePrompt = generateImagePrompt(imageContext);
    
    console.log("🔍 PROMPT VERIFICATION:");
    console.log("- Prompt length:", imagePrompt.length);
    console.log("- First 200 chars:", imagePrompt.substring(0, 200));
    
    // Step 6: Call GPT-IMAGE-1 with optimized configuration
    console.log("📥 CALLING GPT-IMAGE-1 API...");
    const gptImageConfig = {
      model: 'gpt-image-1' as const,
      prompt: imagePrompt,
      size: '1024x1024' as const,
      quality: 'high' as const,
      output_format: 'png' as const,
      background: 'opaque' as const, // Ensure solid black background
      moderation: 'auto' as const
    };
    
    console.log("🎨 GPT-IMAGE-1 CONFIG:");
    console.log("- Model:", gptImageConfig.model);
    console.log("- Quality:", gptImageConfig.quality);  
    console.log("- Size:", gptImageConfig.size);
    console.log("- Output format:", gptImageConfig.output_format);
    console.log("- Background:", gptImageConfig.background);
    
    const imageResponse = await openai.images.generate(gptImageConfig);
    
    console.log("✅ GPT-IMAGE-1 RESPONSE RECEIVED");
    console.log("- Response data available:", !!imageResponse.data?.[0]);
    
    // Step 7: Extract image data (gpt-image-1 always returns base64)
    const imageB64 = imageResponse.data[0]?.b64_json;
    
    if (!imageB64) {
      console.error("❌ NO IMAGE DATA RECEIVED FROM GPT-IMAGE-1");
      return '/placeholder.svg';
    }
    
    console.log("✅ IMAGE DATA EXTRACTED, LENGTH:", imageB64.length);
    
    // Step 8: Upload to Supabase
    const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
    
    console.log("📥 UPLOAD RESULT:", imageUrl);
    
    return imageUrl || '/placeholder.svg';
    
  } catch (error) {
    console.error("❌ GPT-IMAGE-1 GENERATION ERROR:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return '/placeholder.svg';
  }
}

function extractIngredientsFromSavedRecipe(ingredients: any): string[] {
  console.log("🔍 EXTRACTING INGREDIENTS FROM:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
    if (Array.isArray(ingredients)) {
      ingredients.forEach((item: any) => {
        if (typeof item === 'string') {
          const cleaned = cleanIngredientName(item);
          if (cleaned.length > 2) {
            ingredientsList.push(cleaned);
          }
        }
      });
    } else {
      Object.entries(ingredients).forEach(([key, categoryItems]: [string, any]) => {
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach((item: any) => {
            const itemStr = typeof item === 'string' ? item : String(item);
            const cleaned = cleanIngredientName(itemStr);
            if (cleaned.length > 2) {
              ingredientsList.push(cleaned);
            }
          });
        } else if (typeof categoryItems === 'string') {
          const cleaned = cleanIngredientName(categoryItems);
          if (cleaned.length > 2) {
            ingredientsList.push(cleaned);
          }
        }
      });
    }
  }
  
  console.log("✅ FINAL INGREDIENTS LIST:", ingredientsList);
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

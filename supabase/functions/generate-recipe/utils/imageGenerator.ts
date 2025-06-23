
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
    console.log("=== 🚀 IMAGE GENERATION WITH FALLBACK STRATEGY ===");
    
    // Step 1: Extract timeline theme
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
    
    // Step 6: Try GPT-IMAGE-1 first, fallback to DALL-E 3
    let imageResponse;
    let usedModel = 'gpt-image-1';
    
    try {
      console.log("📥 ATTEMPTING GPT-IMAGE-1 GENERATION...");
      const gptImageConfig = {
        model: 'gpt-image-1' as const,
        prompt: imagePrompt,
        size: '1024x1024' as const,
        quality: 'high' as const,
        output_format: 'png' as const,
        background: 'opaque' as const,
        moderation: 'auto' as const
      };
      
      console.log("🎨 GPT-IMAGE-1 CONFIG:");
      console.log("- Model:", gptImageConfig.model);
      console.log("- Quality:", gptImageConfig.quality);  
      console.log("- Size:", gptImageConfig.size);
      
      imageResponse = await openai.images.generate(gptImageConfig);
      console.log("✅ GPT-IMAGE-1 SUCCESS");
      
    } catch (gptError) {
      console.log("⚠️ GPT-IMAGE-1 FAILED, TRYING DALL-E 3 FALLBACK...");
      console.log("GPT-IMAGE-1 Error:", gptError.message);
      
      // Check if it's an organization verification error
      if (gptError.message && gptError.message.includes('organization must be verified')) {
        console.log("🔄 ORGANIZATION NOT YET VERIFIED - USING DALL-E 3 FALLBACK");
      }
      
      // Fallback to DALL-E 3 with a simplified prompt
      const dallePrompt = createDallePrompt(imageContext);
      console.log("🎨 DALL-E 3 FALLBACK PROMPT:");
      console.log("- Length:", dallePrompt.length);
      console.log("- Content:", dallePrompt);
      
      const dalleConfig = {
        model: 'dall-e-3' as const,
        prompt: dallePrompt,
        size: '1024x1024' as const,
        quality: 'hd' as const,
        style: 'vivid' as const,
        n: 1
      };
      
      imageResponse = await openai.images.generate(dalleConfig);
      usedModel = 'dall-e-3';
      console.log("✅ DALL-E 3 FALLBACK SUCCESS");
    }
    
    console.log(`✅ IMAGE GENERATED USING: ${usedModel.toUpperCase()}`);
    console.log("- Response data available:", !!imageResponse.data?.[0]);
    
    if (!imageResponse.data?.[0]) {
      console.error("❌ NO IMAGE DATA RECEIVED");
      return '/placeholder.svg';
    }
    
    // Step 7: Extract image data
    let imageData;
    if (usedModel === 'gpt-image-1') {
      // GPT-IMAGE-1 returns base64
      imageData = imageResponse.data[0].b64_json;
      if (!imageData) {
        console.error("❌ NO BASE64 IMAGE DATA IN GPT-IMAGE-1 RESPONSE");
        return '/placeholder.svg';
      }
    } else {
      // DALL-E 3 returns URL, need to fetch and convert
      const imageUrl = imageResponse.data[0].url;
      if (!imageUrl) {
        console.error("❌ NO URL IN DALL-E 3 RESPONSE");
        return '/placeholder.svg';
      }
      
      console.log("📥 FETCHING DALL-E 3 IMAGE FROM URL...");
      const fetchResponse = await fetch(imageUrl);
      if (!fetchResponse.ok) {
        console.error("❌ FAILED TO FETCH DALL-E 3 IMAGE");
        return '/placeholder.svg';
      }
      
      const arrayBuffer = await fetchResponse.arrayBuffer();
      imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }
    
    console.log("✅ IMAGE DATA EXTRACTED, LENGTH:", imageData.length);
    
    // Step 8: Upload to Supabase
    console.log("📤 UPLOADING TO SUPABASE...");
    const imageUrl = await uploadImageToSupabase(imageData, recipeId, supabaseAdmin);
    
    console.log("📥 UPLOAD RESULT:", imageUrl);
    console.log(`🎉 COMPLETE: Generated with ${usedModel.toUpperCase()}`);
    
    return imageUrl || '/placeholder.svg';
    
  } catch (error) {
    console.error("❌ CRITICAL IMAGE GENERATION ERROR:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return '/placeholder.svg';
  }
}

function createDallePrompt(imageContext: any): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // Create a DALL-E 3 optimized prompt (under 4000 characters)
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 5).join(', ') : 'traditional ingredients';
  
  const prompt = `Professional food photography of ${dumplingShape}-shaped dumplings with ${flavor} flavor, ${timelineTheme.toLowerCase()} style. Ingredients: ${ingredientsText}. Studio lighting, black background, hyper-realistic, appetizing presentation, shallow depth of field, commercial photography quality.`;
  
  console.log("🔄 DALL-E 3 PROMPT CREATED:");
  console.log("- Length:", prompt.length);
  console.log("- Content:", prompt);
  
  return prompt;
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

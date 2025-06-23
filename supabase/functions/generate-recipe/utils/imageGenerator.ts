
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
    console.log("=== 🚀 COMPREHENSIVE IMAGE GENERATION PIPELINE TRACING ===");
    
    // Step 1: Extract and trace user context
    console.log("📥 STEP 1: EXTRACTING USER CONTEXT FROM PAYLOAD");
    console.log("Raw payload received:", JSON.stringify(payload, null, 2));
    
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("🕐 Timeline extraction:");
    console.log("- Timeline values array:", timelineValues);
    console.log("- Selected timeline theme:", `"${timelineTheme}"`);
    
    const questionValues = Object.values(payload.questions);
    const fullEmotionalContext = questionValues.join(' and ');
    console.log("💭 Questions extraction:");
    console.log("- Question values array:", questionValues);
    console.log("- Combined emotional context:", `"${fullEmotionalContext}"`);
    
    const controlValues = Object.values(payload.controls)[0] || {
      shape: 'round',
      flavor: 'savory',
      temperature: 200,
      enhancer: 'none'
    };
    console.log("🎛️ Control values extraction:");
    console.log("- Raw controls:", payload.controls);
    console.log("- Extracted control values:", controlValues);
    
    // Step 2: Extract ingredients from saved recipe
    console.log("📥 STEP 2: EXTRACTING INGREDIENTS FROM SAVED RECIPE");
    console.log("Saved recipe ingredients raw:", JSON.stringify(savedRecipe.ingredients, null, 2));
    const ingredientsList = extractIngredientsFromSavedRecipe(savedRecipe.ingredients);
    console.log("Final extracted ingredients list:", ingredientsList);
    
    // Step 3: Create image context
    console.log("📥 STEP 3: CREATING IMAGE CONTEXT OBJECT");
    const imageContext = {
      timelineTheme,
      emotionalContext: fullEmotionalContext,
      dumplingShape: controlValues.shape,
      flavor: controlValues.flavor,
      ingredientsList,
      recipeTitle: savedRecipe.title,
      recipeDescription: savedRecipe.description
    };
    console.log("📋 Complete image context object:", JSON.stringify(imageContext, null, 2));
    
    // Step 4: Generate the image prompt
    console.log("📥 STEP 4: GENERATING IMAGE PROMPT");
    console.log("Calling generateImagePrompt with context...");
    const imagePrompt = generateImagePrompt(imageContext);
    console.log("✅ Image prompt generated successfully");
    console.log("📏 Final prompt length:", imagePrompt.length);
    console.log("📋 Final prompt text being sent to OpenAI:");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(imagePrompt);
    console.log("═══════════════════════════════════════════════════════════");
    
    // Step 5: Prepare DALL-E request
    console.log("📥 STEP 5: PREPARING DALL-E REQUEST");
    const dalleConfig = {
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024' as const,
      response_format: 'b64_json' as const,
      style: 'vivid' as const,
      quality: 'hd' as const,
    };
    console.log("🎨 DALL-E configuration object:", dalleConfig);
    console.log("🔍 Configuration validation:");
    console.log("- Model:", dalleConfig.model);
    console.log("- Prompt length:", dalleConfig.prompt.length);
    console.log("- Size:", dalleConfig.size);
    console.log("- Response format:", dalleConfig.response_format);
    console.log("- Style:", dalleConfig.style);
    console.log("- Quality:", dalleConfig.quality);
    
    // Step 6: Call DALL-E with detailed monitoring
    console.log("📥 STEP 6: CALLING DALL-E API");
    console.log("🔄 Making request to OpenAI images.generate...");
    
    let imageResponse;
    try {
      console.log("⏱️ Request timestamp:", new Date().toISOString());
      imageResponse = await openai.images.generate(dalleConfig);
      console.log("✅ DALL-E API call completed successfully");
      console.log("📊 Response analysis:");
      console.log("- Response exists:", !!imageResponse);
      console.log("- Has data property:", !!imageResponse.data);
      console.log("- Data is array:", Array.isArray(imageResponse.data));
      console.log("- Data length:", imageResponse.data?.length);
      console.log("- First item exists:", !!imageResponse.data?.[0]);
      console.log("- Has b64_json:", !!imageResponse.data?.[0]?.b64_json);
      
      if (imageResponse.data?.[0]?.revised_prompt) {
        console.log("🔄 DALL-E REVISED PROMPT DETECTED:");
        console.log("Original prompt length:", imagePrompt.length);
        console.log("Revised prompt:", imageResponse.data[0].revised_prompt);
        console.log("🚨 THIS MIGHT BE THE ISSUE - DALL-E CHANGED OUR PROMPT!");
      }
      
    } catch (dalleError) {
      console.error("❌ DALL-E API Error:", dalleError);
      console.error("🔍 Error analysis:");
      console.error("- Error message:", dalleError.message);
      console.error("- Error status:", dalleError.status);
      console.error("- Error code:", dalleError.code);
      console.error("- Full error object:", JSON.stringify(dalleError, null, 2));
      return '/placeholder.svg';
    }
    
    // Step 7: Extract and validate image data
    console.log("📥 STEP 7: EXTRACTING IMAGE DATA");
    const imageB64 = imageResponse.data[0]?.b64_json;
    
    if (!imageB64) {
      console.error("❌ NO BASE64 IMAGE DATA RECEIVED");
      console.error("Response structure:", JSON.stringify(imageResponse, null, 2));
      return '/placeholder.svg';
    }
    
    console.log("✅ Base64 image data extracted:");
    console.log("- Base64 length:", imageB64.length);
    console.log("- Base64 preview (first 100 chars):", imageB64.substring(0, 100));
    console.log("- Base64 appears valid:", imageB64.startsWith('iVBOR') || imageB64.startsWith('/9j/') || imageB64.startsWith('UklGR'));
    
    // Step 8: Upload to Supabase with tracking
    console.log("📥 STEP 8: UPLOADING TO SUPABASE");
    console.log("🔄 Calling uploadImageToSupabase with recipe ID:", recipeId);
    const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
    
    console.log("📥 STEP 9: FINAL URL ANALYSIS");
    console.log("- Upload function returned:", imageUrl);
    console.log("- Is placeholder:", imageUrl === '/placeholder.svg');
    console.log("- URL structure valid:", imageUrl && imageUrl.includes('supabase'));
    
    if (imageUrl && imageUrl !== '/placeholder.svg') {
      console.log("✅ IMAGE GENERATION PIPELINE COMPLETED SUCCESSFULLY!");
      console.log("🎯 Final image URL:", imageUrl);
      return imageUrl;
    } else {
      console.error("❌ IMAGE UPLOAD FAILED OR RETURNED PLACEHOLDER");
      return '/placeholder.svg';
    }
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR IN IMAGE GENERATION PIPELINE:", error);
    console.error("🔍 Error details:");
    console.error("- Error name:", error.name);
    console.error("- Error message:", error.message);
    console.error("- Error stack:", error.stack);
    return '/placeholder.svg';
  }
}

function extractIngredientsFromSavedRecipe(ingredients: any): string[] {
  console.log("🔍 DETAILED INGREDIENTS EXTRACTION");
  console.log("Raw ingredients input:", JSON.stringify(ingredients, null, 2));
  console.log("Ingredients type:", typeof ingredients);
  console.log("Is array:", Array.isArray(ingredients));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
    if (Array.isArray(ingredients)) {
      console.log("Processing as array...");
      ingredients.forEach((item: any, index: number) => {
        console.log(`Array item ${index}:`, item, typeof item);
        if (typeof item === 'string') {
          const cleanIngredient = cleanIngredientName(item);
          console.log(`Cleaned ingredient ${index}:`, cleanIngredient);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    } else {
      console.log("Processing as object...");
      Object.entries(ingredients).forEach(([key, categoryItems]: [string, any]) => {
        console.log(`Object category "${key}":`, categoryItems);
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach((item: any, index: number) => {
            console.log(`Category ${key}, item ${index}:`, item);
            const itemStr = typeof item === 'string' ? item : String(item);
            const cleanIngredient = cleanIngredientName(itemStr);
            console.log(`Cleaned ingredient from ${key}[${index}]:`, cleanIngredient);
            if (cleanIngredient.length > 2) {
              ingredientsList.push(cleanIngredient);
            }
          });
        } else if (typeof categoryItems === 'string') {
          console.log(`String category item "${key}":`, categoryItems);
          const cleanIngredient = cleanIngredientName(categoryItems);
          console.log(`Cleaned string ingredient:`, cleanIngredient);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    }
  }
  
  console.log("✅ Final extracted ingredients list:", ingredientsList);
  return ingredientsList;
}

function cleanIngredientName(item: string): string {
  const cleaned = item
    .replace(/^\d+[\s\w]*\s+/, '')
    .split(',')[0]
    .split('(')[0]
    .trim()
    .toLowerCase();
  console.log(`Cleaning "${item}" -> "${cleaned}"`);
  return cleaned;
}

export { extractIngredientsList } from './ingredientParser.ts';

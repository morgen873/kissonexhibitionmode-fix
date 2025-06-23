
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
    console.log("=== 🚀 STREAMLINED IMAGE GENERATION PIPELINE ===");
    
    // Step 1: Extract timeline theme - this is the key piece
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("🕐 TIMELINE EXTRACTION:");
    console.log("- Raw timeline values:", timelineValues);
    console.log("- Selected timeline theme:", `"${timelineTheme}"`);
    console.log("- Timeline theme type:", typeof timelineTheme);
    
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
    
    // Step 4: Create image context - simplified
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
    
    // Step 5: Generate the prompt using our new system
    console.log("📥 CALLING generateImagePrompt...");
    const imagePrompt = generateImagePrompt(imageContext);
    
    // Step 6: Verify prompt content
    const promptLower = imagePrompt.toLowerCase();
    const containsFuturisticTerms = ['neon', 'futuristic', 'cyberpunk', 'holographic', 'sci-fi'].some(term => promptLower.includes(term));
    
    console.log("🔍 PROMPT VERIFICATION:");
    console.log("- Contains futuristic terms:", containsFuturisticTerms);
    console.log("- Prompt length:", imagePrompt.length);
    console.log("- First 200 chars:", imagePrompt.substring(0, 200));
    
    // Step 7: Call DALL-E with the exact prompt
    console.log("📥 CALLING DALL-E API...");
    const dalleConfig = {
      model: 'dall-e-3' as const,
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024' as const,
      response_format: 'b64_json' as const,
      style: 'vivid' as const,
      quality: 'hd' as const,
    };
    
    console.log("🎨 DALL-E CONFIG:");
    console.log("- Model:", dalleConfig.model);
    console.log("- Style:", dalleConfig.style);
    console.log("- Quality:", dalleConfig.quality);
    
    const imageResponse = await openai.images.generate(dalleConfig);
    
    console.log("✅ DALL-E RESPONSE RECEIVED");
    if (imageResponse.data?.[0]?.revised_prompt) {
      console.log("🔄 DALL-E REVISED THE PROMPT:");
      console.log("ORIGINAL:", imagePrompt.substring(0, 100) + "...");
      console.log("REVISED:", imageResponse.data[0].revised_prompt);
    }
    
    // Step 8: Extract image data
    const imageB64 = imageResponse.data[0]?.b64_json;
    
    if (!imageB64) {
      console.error("❌ NO IMAGE DATA RECEIVED");
      return '/placeholder.svg';
    }
    
    console.log("✅ IMAGE DATA EXTRACTED, LENGTH:", imageB64.length);
    
    // Step 9: Upload to Supabase
    const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
    
    console.log("📥 UPLOAD RESULT:", imageUrl);
    
    return imageUrl || '/placeholder.svg';
    
  } catch (error) {
    console.error("❌ IMAGE GENERATION ERROR:", error);
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

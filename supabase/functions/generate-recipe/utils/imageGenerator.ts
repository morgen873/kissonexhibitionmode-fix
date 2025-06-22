
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { extractIngredientColors } from './colorExtractor.ts'
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts'
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
    console.log("=== ARTISTIC STYLE IMAGE GENERATION ===");
    
    // Extract timeline theme from original user input
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("✓ Timeline theme:", `"${timelineTheme}"`);
    
    // Extract emotional context from original user input
    const questionValues = Object.values(payload.questions);
    const emotionalContext = questionValues.length > 0 ? questionValues.join(', ') : 'comfort and warmth';
    console.log("✓ Emotional context:", `"${emotionalContext}"`);
    
    // Extract controls from original user input
    const controlValues = Object.values(payload.controls);
    const controls = controlValues.length > 0 ? controlValues[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    console.log("✓ Controls from user:", controls);
    
    // Extract ingredients from SAVED RECIPE DATA
    console.log("=== EXTRACTING INGREDIENTS FROM SAVED RECIPE ===");
    const recipeIngredients = extractIngredientsList(savedRecipe.ingredients);
    console.log("✓ Ingredients extracted from SAVED RECIPE:", recipeIngredients);
    
    // Use saved recipe ingredients as the source of truth
    const finalIngredients = recipeIngredients.length > 0 ? recipeIngredients : ['colorful vegetables'];
    console.log("✓ FINAL ingredients for image generation:", finalIngredients);
    
    // Generate image prompt with ARTISTIC STYLE FOCUS
    const imagePrompt = generateArtisticImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: finalIngredients,
      recipeTitle: savedRecipe.title
    });
    
    console.log("=== SENDING ARTISTIC PROMPT TO DALL-E ===");
    console.log("Final artistic prompt:", imagePrompt);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'vivid',  // Use 'vivid' style for more artistic results
      quality: 'hd',
    });
    
    console.log("✅ DALL-E response received for artistic image");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // Upload to Supabase
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Artistic image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in artistic image generation:", error);
    return '/placeholder.svg';
  }
}

function generateArtisticImagePrompt(params: {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== ARTISTIC PROMPT GENERATION WITH SPECIFIC STYLE ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Ingredients from saved recipe:", ingredientsList);
  
  // Enhanced timeline classification
  const timelineLower = timelineTheme.toLowerCase();
  const isFuturistic = timelineLower.includes('future') || 
                       timelineLower.includes('distant') || 
                       timelineLower.includes('tomorrow') ||
                       timelineLower.includes('advanced') ||
                       timelineLower.includes('cyber') ||
                       timelineLower.includes('space');

  const isHistorical = timelineLower.includes('ancient') || 
                       timelineLower.includes('past') || 
                       timelineLower.includes('medieval') ||
                       timelineLower.includes('traditional') ||
                       timelineLower.includes('old') ||
                       timelineLower.includes('historic');

  console.log("Timeline classification:");
  console.log("- Is Futuristic:", isFuturistic);
  console.log("- Is Historical:", isHistorical);
  
  // Extract colors from saved recipe ingredients
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("Color extraction from saved recipe:");
  console.log("- Colors found:", colors);
  console.log("- Number of colors:", colors.length);
  
  const promptParams = {
    timelineTheme,
    emotionalContext,
    dumplingShape,
    flavor,
    ingredientsList,
    recipeTitle,
    colors,
    descriptions,
    effects
  };

  let finalPrompt = '';
  
  if (isFuturistic) {
    console.log("🚀 Using SPECIFIC FUTURISTIC artistic prompt");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using SPECIFIC HISTORICAL artistic prompt");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using SPECIFIC CONTEMPORARY artistic prompt");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  // Add VERY EXPLICIT artistic style requirements
  finalPrompt = finalPrompt + " CRITICAL REQUIREMENTS: This MUST be a stylized artistic illustration with vibrant colors and smooth gradients, similar to digital artwork or cartoon illustration. ABSOLUTELY NO realistic food photography. ABSOLUTELY NO photorealistic textures. Pure artistic style only.";
  
  console.log("=== FINAL ARTISTIC PROMPT WITH EXPLICIT STYLE ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Prompt:", finalPrompt);
  
  return finalPrompt;
}

// Re-export for compatibility
export { extractIngredientsList } from './ingredientParser.ts';

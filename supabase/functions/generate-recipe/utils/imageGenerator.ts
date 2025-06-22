
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { extractIngredientColors } from './colorExtractor.ts'
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts'
import { extractIngredientsList } from './ingredientParser.ts'

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
    console.log("=== IMAGE GENERATION FROM SAVED RECIPE DATA ===");
    
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
    
    // CRITICAL FIX: Extract ingredients from SAVED RECIPE DATA, not user input
    console.log("=== EXTRACTING INGREDIENTS FROM SAVED RECIPE ===");
    console.log("Saved recipe ingredients structure:", JSON.stringify(savedRecipe.ingredients, null, 2));
    
    // Use the ingredient parser to extract from the saved recipe data
    const recipeIngredients = extractIngredientsList(savedRecipe.ingredients);
    console.log("✓ Ingredients extracted from SAVED RECIPE:", recipeIngredients);
    console.log("✓ Number of ingredients from saved recipe:", recipeIngredients.length);
    
    // Use saved recipe ingredients as the source of truth
    const finalIngredients = recipeIngredients.length > 0 ? recipeIngredients : ['colorful vegetables'];
    console.log("✓ FINAL ingredients for image generation:", finalIngredients);
    
    // Generate image prompt with data from saved recipe
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: finalIngredients,
      recipeTitle: savedRecipe.title
    });
    
    console.log("=== SENDING TO DALL-E WITH SAVED RECIPE DATA ===");
    console.log("Final prompt:", imagePrompt);
    console.log("Ingredients used from saved recipe:", finalIngredients);
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'natural',
      quality: 'hd',
    });
    
    console.log("✅ DALL-E response received");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // Upload to Supabase
    if (imageB64) {
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in image generation:", error);
    return '/placeholder.svg';
  }
}

function generateImagePrompt(params: {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== IMAGE PROMPT FROM SAVED RECIPE DATA ===");
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
    console.log("🚀 Using FUTURISTIC prompt with saved recipe data");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using HISTORICAL prompt with saved recipe data");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using CONTEMPORARY prompt with saved recipe data");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  // Add explicit artistic style instructions
  finalPrompt = finalPrompt + " IMPORTANT: This should be an artistic illustration or digital art, NOT realistic food photography. Stylized and colorful like the provided reference images.";
  
  console.log("=== FINAL PROMPT FROM SAVED RECIPE ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Prompt:", finalPrompt);
  
  return finalPrompt;
}

// Re-export for compatibility
export { extractIngredientsList } from './ingredientParser.ts';

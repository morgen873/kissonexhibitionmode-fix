
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { extractIngredientColors } from './colorExtractor.ts'
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts'

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
    console.log("=== FIXED IMAGE GENERATION FLOW ===");
    
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
    
    // CRITICAL FIX: Extract ingredients DIRECTLY from enhancer field
    console.log("=== DIRECT INGREDIENT EXTRACTION FROM ENHANCER ===");
    const directIngredients: string[] = [];
    
    if (controls.enhancer && controls.enhancer.trim() !== '') {
      // Split enhancer by common separators and clean up
      const enhancerParts = controls.enhancer.split(/[,&+\s]+/).filter(part => part.trim().length > 2);
      enhancerParts.forEach(part => {
        const cleanPart = part.trim().toLowerCase();
        directIngredients.push(cleanPart);
      });
    }
    
    console.log("✓ DIRECT ingredients from enhancer:", directIngredients);
    console.log("✓ Number of direct ingredients:", directIngredients.length);
    
    // Use direct ingredients as primary source
    const finalIngredients = directIngredients.length > 0 ? directIngredients : ['beetroot', 'colorful vegetables'];
    console.log("✓ FINAL ingredients for color extraction:", finalIngredients);
    
    // Generate image prompt with enhanced data
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: finalIngredients,
      recipeTitle: savedRecipe.title
    });
    
    console.log("=== SENDING TO DALL-E WITH DIRECT INGREDIENT DATA ===");
    console.log("Final prompt:", imagePrompt);
    console.log("Direct ingredients used:", finalIngredients);
    
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
  
  console.log("=== SIMPLIFIED IMAGE PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Ingredients list:", ingredientsList);
  
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
  
  // Extract colors with enhanced vibrant mapping
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("FIXED color extraction results:");
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
    console.log("🚀 Using FIXED FUTURISTIC prompt");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using FIXED HISTORICAL prompt");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using FIXED CONTEMPORARY prompt");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  // Add explicit artistic style instructions
  finalPrompt = finalPrompt + " IMPORTANT: This should be an artistic illustration or digital art, NOT realistic food photography. Stylized and colorful like the provided reference images.";
  
  console.log("=== FINAL FIXED PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Prompt:", finalPrompt);
  
  return finalPrompt;
}

// Re-export for compatibility
export { extractIngredientsList } from './ingredientParser.ts';

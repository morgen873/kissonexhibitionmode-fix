
import { extractIngredientColors } from './colorExtractor.ts';
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts';
import { extractIngredientsList } from './ingredientParser.ts';

interface ImagePromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function generateImagePrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== VIBRANT ARTISTIC IMAGE PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Flavor:", flavor);
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
  console.log("VIBRANT color extraction results:");
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
    console.log("🚀 Using VIBRANT FUTURISTIC prompt");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using VIBRANT HISTORICAL prompt");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using VIBRANT CONTEMPORARY prompt");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  // Add explicit artistic style instructions to ensure we don't get realistic food photography
  finalPrompt = finalPrompt + " IMPORTANT: This should be an artistic illustration or digital art, NOT realistic food photography. Stylized and colorful.";
  
  console.log("=== FINAL VIBRANT ARTISTIC PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Prompt:", finalPrompt);
  
  return finalPrompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

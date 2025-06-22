
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
  
  console.log("=== SIMPLIFIED IMAGE PROMPT GENERATION ===");
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
  
  // Extract colors with detailed logging
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("Color extraction results:");
  console.log("- Colors found:", colors);
  console.log("- Number of colors:", colors.length);
  
  if (colors.length === 0) {
    console.log("🚨 CRITICAL: NO COLORS EXTRACTED!");
    console.log("This explains why dumplings are plain!");
    console.log("Ingredient list was:", ingredientsList);
  }
  
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
    console.log("🚀 Using SIMPLIFIED FUTURISTIC prompt");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using SIMPLIFIED HISTORICAL prompt");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using SIMPLIFIED CONTEMPORARY prompt");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  console.log("=== FINAL SIMPLIFIED PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Prompt:", finalPrompt);
  
  return finalPrompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

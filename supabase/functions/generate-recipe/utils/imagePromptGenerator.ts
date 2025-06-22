
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
  
  console.log("=== ENHANCED IMAGE PROMPT GENERATION ===");
  console.log("Timeline theme received:", timelineTheme);
  console.log("Emotional context received:", emotionalContext);
  console.log("Dumpling shape received:", dumplingShape);
  console.log("Flavor received:", flavor);
  console.log("Ingredients list received:", ingredientsList);
  console.log("Recipe title received:", recipeTitle);
  
  // Extract enhanced colors and effects from ingredients
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  
  // Timeline classification with enhanced detection
  const timelineLower = timelineTheme.toLowerCase();
  const isFuturistic = timelineLower.includes('future') || 
                       timelineLower.includes('distant') || 
                       timelineLower.includes('tomorrow') ||
                       timelineLower.includes('advanced') ||
                       timelineLower.includes('cyber') ||
                       timelineLower.includes('space') ||
                       timelineLower.includes('2050') ||
                       timelineLower.includes('sci-fi') ||
                       timelineLower.includes('tech');

  const isHistorical = timelineLower.includes('ancient') || 
                       timelineLower.includes('past') || 
                       timelineLower.includes('medieval') ||
                       timelineLower.includes('traditional') ||
                       timelineLower.includes('old') ||
                       timelineLower.includes('historic') ||
                       timelineLower.includes('vintage') ||
                       timelineLower.includes('classic');

  console.log("Enhanced timeline classification - Futuristic:", isFuturistic, "Historical:", isHistorical);
  console.log("Enhanced ingredient effects found:", effects.length, "effects");
  
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

  if (isFuturistic) {
    return buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    return buildHistoricalPrompt(promptParams);
  } else {
    return buildContemporaryPrompt(promptParams);
  }
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

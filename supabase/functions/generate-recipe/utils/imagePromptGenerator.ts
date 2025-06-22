
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
  
  console.log("=== FIXED IMAGE PROMPT GENERATION ===");
  console.log("PRIORITY 1 - Timeline theme:", `"${timelineTheme}"`);
  console.log("PRIORITY 2 - Emotional context:", `"${emotionalContext}"`);
  console.log("PRIORITY 3 - Physical attributes:", { dumplingShape, flavor });
  console.log("PRIORITY 4 - Ingredients for color:", ingredientsList);
  console.log("PRIORITY 5 - Recipe title:", `"${recipeTitle}"`);
  
  // Enhanced timeline classification - this is the MOST IMPORTANT factor
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

  console.log("Timeline classification results:");
  console.log("- Is Futuristic:", isFuturistic);
  console.log("- Is Historical:", isHistorical);
  console.log("- Timeline theme used:", `"${timelineTheme}"`);
  
  // Extract enhanced colors and effects from ingredients
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("Color extraction results:");
  console.log("- Colors found:", colors);
  console.log("- Visual effects:", effects);
  
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
    console.log("🚀 Using FUTURISTIC prompt builder");
    finalPrompt = buildFuturisticPrompt(promptParams);
  } else if (isHistorical) {
    console.log("🏛️ Using HISTORICAL prompt builder");
    finalPrompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🎨 Using CONTEMPORARY prompt builder");
    finalPrompt = buildContemporaryPrompt(promptParams);
  }
  
  console.log("=== FINAL PROMPT GENERATED ===");
  console.log("Prompt builder used:", isFuturistic ? "FUTURISTIC" : isHistorical ? "HISTORICAL" : "CONTEMPORARY");
  console.log("Final prompt length:", finalPrompt.length);
  
  return finalPrompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

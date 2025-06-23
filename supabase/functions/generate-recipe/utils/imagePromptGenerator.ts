
import { extractIngredientColors } from './colorExtractor.ts';
import { extractIngredientsList } from './ingredientParser.ts';
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts';

export interface ImagePromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function generateImagePrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== 🔍 TIME-PERIOD AWARE PROMPT GENERATION ===");
  console.log("📊 INPUT PARAMETERS:");
  console.log("- Timeline theme:", `"${timelineTheme}"`);
  console.log("- Emotional context:", `"${emotionalContext}"`);
  console.log("- Dumpling shape:", dumplingShape);
  console.log("- Flavor:", flavor);
  console.log("- Recipe title:", `"${recipeTitle}"`);
  console.log("- Ingredients list:", ingredientsList);
  
  // Extract colors from ingredients for the prompt builders
  const colors = extractIngredientColors(ingredientsList);
  const descriptions = ingredientsList.map(ingredient => `rich ${ingredient}`);
  const effects = ['glossy', 'appetizing', 'detailed'];
  
  // Build the parameters object for prompt builders
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
  
  let prompt: string;
  
  // Determine which prompt builder to use based on timeline theme
  const timelineLower = timelineTheme.toLowerCase();
  
  if (timelineLower.includes('future') || timelineLower.includes('distant') && timelineLower.includes('future')) {
    console.log("🚀 USING FUTURISTIC PROMPT BUILDER");
    prompt = buildFuturisticPrompt(promptParams);
  } else if (timelineLower.includes('past') || timelineLower.includes('distant') && timelineLower.includes('past')) {
    console.log("🏛️ USING HISTORICAL PROMPT BUILDER");
    prompt = buildHistoricalPrompt(promptParams);
  } else {
    console.log("🏙️ USING CONTEMPORARY PROMPT BUILDER (Present Day)");
    prompt = buildContemporaryPrompt(promptParams);
  }
  
  console.log("=== 📤 TIME-PERIOD SPECIFIC PROMPT OUTPUT ===");
  console.log("🎯 PROMPT TYPE:", timelineLower.includes('future') ? 'FUTURISTIC' : timelineLower.includes('past') ? 'HISTORICAL' : 'CONTEMPORARY');
  console.log("🎯 PROMPT LENGTH:", prompt.length);
  console.log("🎯 FIRST 200 CHARS:", prompt.substring(0, 200));
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

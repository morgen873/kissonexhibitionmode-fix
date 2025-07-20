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
  
  // Enhanced timeline detection logic with flexible matching
  console.log("🔍 TIMELINE ANALYSIS:");
  console.log("- Timeline:", `"${timelineTheme}"`);
  
  const timelineLower = timelineTheme.toLowerCase();
  
  // Check for future-related keywords
  if (timelineLower.includes('future') || 
      timelineLower.includes('2050') || 
      timelineLower.includes('tomorrow') ||
      timelineLower.includes('space') ||
      timelineLower.includes('cyber') ||
      timelineLower.includes('tech')) {
    console.log("🚀 USING FUTURISTIC PROMPT BUILDER");
    prompt = buildFuturisticPrompt(promptParams);
  } 
  // Check for past-related keywords
  else if (timelineLower.includes('past') || 
           timelineLower.includes('historical') ||
           timelineLower.includes('ancient') ||
           timelineLower.includes('traditional') ||
           timelineLower.includes('vintage') ||
           timelineLower.includes('old') ||
           timelineLower.includes('1900') ||
           timelineLower.includes('medieval') ||
           timelineLower.includes('dynasty')) {
    console.log("🏛️ USING HISTORICAL PROMPT BUILDER");
    prompt = buildHistoricalPrompt(promptParams);
  } 
  // Check for present/current day
  else if (timelineLower.includes('present') || 
           timelineLower.includes('today') ||
           timelineLower.includes('current') ||
           timelineLower.includes('now') ||
           timelineLower.includes('2024') ||
           timelineLower.includes('2025') ||
           timelineLower.includes('modern')) {
    console.log("🏙️ USING CONTEMPORARY PROMPT BUILDER (Present)");
    prompt = buildContemporaryPrompt(promptParams);
  }
  // Default fallback to contemporary for any unrecognized timeline
  else {
    console.log("🏙️ USING CONTEMPORARY PROMPT BUILDER (Default Fallback)");
    console.log("⚠️ Timeline not specifically recognized, using contemporary as fallback");
    prompt = buildContemporaryPrompt(promptParams);
  }
  
  console.log("=== 📤 TIME-PERIOD SPECIFIC PROMPT OUTPUT ===");
  console.log("🎯 TIMELINE DETECTED:", timelineTheme);
  console.log("🎯 PROMPT TYPE:", 
    (timelineLower.includes('future') || timelineLower.includes('2050') || timelineLower.includes('space')) ? 'FUTURISTIC' : 
    (timelineLower.includes('past') || timelineLower.includes('historical') || timelineLower.includes('ancient')) ? 'HISTORICAL' : 
    'CONTEMPORARY'
  );
  console.log("🎯 PROMPT LENGTH:", prompt.length);
  console.log("🎯 FIRST 200 CHARS:", prompt.substring(0, 200));
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';
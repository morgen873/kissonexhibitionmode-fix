
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
  
  // Enhanced timeline detection logic with specific checks - case insensitive
  const timelineLower = timelineTheme.toLowerCase();
  
  console.log("🔍 TIMELINE ANALYSIS:");
  console.log("- Original timeline:", `"${timelineTheme}"`);
  console.log("- Lowercase timeline:", `"${timelineLower}"`);
  
  // Check for future timelines
  if (timelineLower.includes('distant future') || timelineLower.includes('near future') || timelineLower.includes('far future')) {
    console.log("🚀 USING FUTURISTIC PROMPT BUILDER");
    prompt = buildFuturisticPrompt(promptParams);
  } 
  // Check for past timelines - FIXED: Added more specific matching
  else if (timelineLower.includes('distant past') || timelineLower.includes('recent past') || timelineLower === 'distant past' || timelineLower === 'recent past') {
    console.log("🏛️ USING HISTORICAL PROMPT BUILDER");
    prompt = buildHistoricalPrompt(promptParams);
  } 
  // Check for present day specifically
  else if (timelineLower.includes('present day') || timelineLower.includes('present') || timelineLower === 'present day') {
    console.log("🏙️ USING CONTEMPORARY PROMPT BUILDER (Present Day - Explicit Match)");
    prompt = buildContemporaryPrompt(promptParams);
  }
  // Default fallback to contemporary
  else {
    console.log("🏙️ USING CONTEMPORARY PROMPT BUILDER (Default Fallback)");
    prompt = buildContemporaryPrompt(promptParams);
  }
  
  console.log("=== 📤 TIME-PERIOD SPECIFIC PROMPT OUTPUT ===");
  console.log("🎯 TIMELINE DETECTED:", timelineTheme);
  console.log("🎯 PROMPT TYPE:", 
    (timelineLower.includes('distant future') || timelineLower.includes('near future') || timelineLower.includes('far future')) ? 'FUTURISTIC' : 
    (timelineLower.includes('distant past') || timelineLower.includes('recent past') || timelineLower === 'distant past' || timelineLower === 'recent past') ? 'HISTORICAL' : 
    'CONTEMPORARY'
  );
  console.log("🎯 PROMPT LENGTH:", prompt.length);
  console.log("🎯 FIRST 200 CHARS:", prompt.substring(0, 200));
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

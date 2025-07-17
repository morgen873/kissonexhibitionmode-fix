
interface PromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
  colors: string[];
  descriptions: string[];
  effects: string[];
}

export function buildFuturisticPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING PROFESSIONAL FUTURISTIC PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'modern ingredients';
  
  const prompt = `Professional food photography of ${dumplingShape}-shaped ${flavor} dumplings from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Modern futuristic presentation:
- Clean, minimalist dumpling arrangement
- Sleek contemporary food styling
- High-quality food photography standards

Professional food photography, modern culinary presentation, clean white background, well-lit, appetizing, restaurant-quality presentation`;

  console.log("Generated professional futuristic prompt optimized for SDXL");
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING PROFESSIONAL HISTORICAL PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional ingredients';
  
  const prompt = `Traditional food photography of ${dumplingShape}-shaped ${flavor} dumplings from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Historical culinary presentation:
- Authentic traditional dumpling arrangement
- Classic food styling techniques
- Heritage cooking presentation

Professional food photography, traditional culinary presentation, neutral background, well-lit, appetizing, authentic historical cooking style`;

  console.log("Generated professional historical prompt optimized for SDXL");
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING PROFESSIONAL CONTEMPORARY PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'modern artisanal ingredients';
  
  const prompt = `Contemporary food photography of ${dumplingShape}-shaped ${flavor} dumplings from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Modern culinary presentation:
- Contemporary dumpling plating
- Professional food styling
- Clean modern aesthetics

Professional food photography, contemporary culinary presentation, clean background, well-lit, appetizing, modern restaurant-style presentation`;

  console.log("Generated professional contemporary prompt optimized for SDXL");
  return prompt;
}


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
  
  const prompt = `Professional food photography of a single ${dumplingShape}-shaped ${flavor} dumpling from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Modern futuristic presentation:
- Single dumpling as focal point
- Clean, minimalist arrangement
- Pure matte black background
- Centered composition
- High-quality food photography standards

Professional food photography, single dumpling focus, pure solid matte black background, well-lit, appetizing, restaurant-quality presentation, centered dumpling, no extras, clean composition`;

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
  
  const prompt = `Traditional food photography of a single ${dumplingShape}-shaped ${flavor} dumpling from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Historical culinary presentation:
- Single dumpling as focal point
- Authentic traditional arrangement
- Pure matte black background
- Centered composition
- Classic food styling techniques

Professional food photography, single dumpling focus, pure solid matte black background, well-lit, appetizing, authentic historical cooking style, centered dumpling, no extras, clean composition`;

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
  
  const prompt = `Contemporary food photography of a single ${dumplingShape}-shaped ${flavor} dumpling from "${recipeTitle}" in ${timelineTheme} style, featuring ${ingredientsText}

Modern culinary presentation:
- Single dumpling as focal point
- Contemporary plating
- Pure matte black background
- Centered composition
- Professional food styling

Professional food photography, single dumpling focus, pure solid matte black background, well-lit, appetizing, modern restaurant-style presentation, centered dumpling, no extras, clean composition`;

  console.log("Generated professional contemporary prompt optimized for SDXL");
  return prompt;
}

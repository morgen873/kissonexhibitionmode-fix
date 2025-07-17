
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
  
  console.log("=== BUILDING WILD FUTURISTIC PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'quantum nano-ingredients';
  
  const prompt = `ULTIMATE ARTISTIC FREEDOM: speculative masterpiece, wildly experimental, ultra surreal, consciousness-expanding food art, the central dumpling (${dumplingShape}-shaped, ${flavor} essence) as the sacred focal point of cosmic "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM CREATIVE LIBERATION STYLE:
- DUMPLING AS COSMIC EPICENTER: artistic dumpling creation, unique and one-off design;

ABSOLUTE CREATIVE PARAMETERS: ultra modern futuristic;

  console.log("Generated WILD FUTURISTIC SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING WILD HISTORICAL SPECULATIVE PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'mythical ancient ingredients';
  
  const prompt = `ULTIMATE HISTORICAL ARTISTIC LIBERATION: speculative historical masterpiece, wildly experimental, ritualistic food art, the sacred dumpling (${dumplingShape}-shaped, ${flavor} essence) as the divine center of mystical "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM ANCIENT CREATIVE FREEDOM: historical connected to traditions;

ABSOLUTE HISTORICAL PARAMETERS: historical dumpling as cosmic center, pure matt black void background, sacred dumpling focus, ancient presentation, centered on the dumpling artifact, historical realism, pure artistic historical speculation with dumpling reverence`;

  console.log("Generated WILD HISTORICAL SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING WILD CONTEMPORARY SPECULATIVE PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'avant-garde artisanal ingredients';
  
  const prompt = `ULTIMATE CONTEMPORARY ARTISTIC FREEDOM: speculative contemporary masterpiece, wildly experimental, avant-garde food art, the central dumpling (${dumplingShape}-shaped, ${flavor} essence) as the technological focal point of revolutionary "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM MODERN CREATIVE LIBERATION:
- modern culinary transcendence

ABSOLUTE CONTEMPORARY PARAMETERS: reality-pushing contemporary dumpling as tech universe center, pure artistic void background, tech-enhanced composition with dumpling focus, consciousness-expanding modern presentation of food technology, centered on the dumpling interface, contemporary realism, pure artistic modern speculation with dumpling as digital deity`;

  console.log("Generated WILD CONTEMPORARY SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

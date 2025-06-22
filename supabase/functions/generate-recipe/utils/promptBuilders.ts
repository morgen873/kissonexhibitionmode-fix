
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
  const { dumplingShape, ingredientsList, colors } = params;
  
  // Build direct color specifications
  let colorInstructions = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 2);
    colorInstructions = `The dumpling wrapper must be ${primaryColors.join(' and ')} colored. `;
  }
  
  // Key ingredients for color emphasis
  const keyIngredients = ingredientsList.slice(0, 2);
  
  const prompt = `A single ${dumplingShape} dumpling on black background. ${colorInstructions}The dumpling has a translucent, glowing wrapper with visible ${keyIngredients.join(' and ')} creating bright color patterns inside. Futuristic holographic effects. Studio lighting. Professional food photography. Ultra-realistic. No text, no plates, no utensils.`;

  console.log("Generated SIMPLIFIED FUTURISTIC prompt:", prompt);
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { dumplingShape, ingredientsList, colors } = params;
  
  // Build direct color specifications
  let colorInstructions = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 2);
    colorInstructions = `The dumpling wrapper is naturally colored ${primaryColors.join(' and ')} from the ingredients. `;
  }
  
  // Key ingredients for color emphasis
  const keyIngredients = ingredientsList.slice(0, 2);
  
  const prompt = `A single handmade ${dumplingShape} dumpling on black background. ${colorInstructions}Traditional preparation with ${keyIngredients.join(' and ')} naturally coloring the dough. Rustic, artisanal appearance. Warm lighting. Professional food photography. Ultra-realistic. No text, no plates, no utensils.`;

  console.log("Generated SIMPLIFIED HISTORICAL prompt:", prompt);
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { dumplingShape, ingredientsList, colors } = params;
  
  // Build direct color specifications
  let colorInstructions = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 2);
    colorInstructions = `The dumpling wrapper is vibrant ${primaryColors.join(' and ')} colored. `;
  }
  
  // Key ingredients for color emphasis
  const keyIngredients = ingredientsList.slice(0, 2);
  
  const prompt = `A single artisanal ${dumplingShape} dumpling on black background. ${colorInstructions}Modern culinary artistry with ${keyIngredients.join(' and ')} creating beautiful color effects in the wrapper. Contemporary food styling. Professional studio lighting. Ultra-realistic. No text, no plates, no utensils.`;

  console.log("Generated SIMPLIFIED CONTEMPORARY prompt:", prompt);
  return prompt;
}

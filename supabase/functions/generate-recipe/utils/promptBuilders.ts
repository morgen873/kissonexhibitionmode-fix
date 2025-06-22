
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
  const { dumplingShape, colors, ingredientsList } = params;
  
  // Build vibrant color specifications
  let colorSpec = 'vibrant neon colors';
  if (colors.length > 0) {
    colorSpec = `bright glowing ${colors.slice(0, 2).join(' and ')} colors`;
  }
  
  const prompt = `A single artistic ${dumplingShape} dumpling with ${colorSpec} in a futuristic style. The dumpling wrapper is translucent and glowing with bright ${colors.join(', ')} hues. Holographic rainbow effects. Neon lighting. Digital art style. Ultra-vibrant colors. Black background. No text.`;

  console.log("Generated VIBRANT FUTURISTIC prompt:", prompt);
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { dumplingShape, colors, ingredientsList } = params;
  
  // Build vibrant color specifications
  let colorSpec = 'rich earthy colors';
  if (colors.length > 0) {
    colorSpec = `deep ${colors.slice(0, 2).join(' and ')} colors`;
  }
  
  const prompt = `A single artistic ${dumplingShape} dumpling with ${colorSpec} in a traditional artistic style. The wrapper is beautifully colored with rich ${colors.join(', ')} tones. Hand-painted illustration style. Watercolor effect. Artistic rendering, not photorealistic. Black background. No text.`;

  console.log("Generated VIBRANT HISTORICAL prompt:", prompt);
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { dumplingShape, colors, ingredientsList } = params;
  
  // Build vibrant color specifications
  let colorSpec = 'bright artistic colors';
  if (colors.length > 0) {
    colorSpec = `vivid ${colors.slice(0, 2).join(' and ')} colors`;
  }
  
  const prompt = `A single stylized ${dumplingShape} dumpling with ${colorSpec} in a modern artistic style. The wrapper features bold ${colors.join(', ')} coloring. Contemporary food art style. Artistic illustration, not realistic photography. Vibrant and colorful. Black background. No text.`;

  console.log("Generated VIBRANT CONTEMPORARY prompt:", prompt);
  return prompt;
}

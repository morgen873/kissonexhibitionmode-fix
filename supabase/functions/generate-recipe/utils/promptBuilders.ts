
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
  const { dumplingShape, colors } = params;
  
  // Use the first 2 most vibrant colors or default to neon
  const primaryColor = colors[0] || 'electric blue';
  const secondaryColor = colors[1] || 'bright pink';
  
  const prompt = `A single ${dumplingShape} dumpling in bright ${primaryColor} and ${secondaryColor} colors. ARTISTIC STYLE: Exactly like a vibrant digital illustration with smooth gradients, glowing effects, and stylized cartoon-like rendering. The dumpling should have a translucent wrapper with bright neon coloring. Holographic rainbow lighting effects. Ultra-vibrant saturated colors. Digital art style with smooth shading. Black background. NO photorealism, NO realistic textures. Pure artistic illustration style.`;

  console.log("Generated SPECIFIC FUTURISTIC prompt:", prompt);
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { dumplingShape, colors } = params;
  
  // Use the first 2 most vibrant colors or default to earth tones
  const primaryColor = colors[0] || 'deep red';
  const secondaryColor = colors[1] || 'golden yellow';
  
  const prompt = `A single ${dumplingShape} dumpling in rich ${primaryColor} and ${secondaryColor} colors. ARTISTIC STYLE: Exactly like a vibrant watercolor painting with soft gradients and artistic brush strokes. The dumpling should have beautiful hand-painted coloring with smooth artistic shading. Traditional illustration style with painterly effects. Watercolor technique with vivid pigments. Black background. NO photorealism, NO photography. Pure artistic painting style.`;

  console.log("Generated SPECIFIC HISTORICAL prompt:", prompt);
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { dumplingShape, colors } = params;
  
  // Use the first 2 most vibrant colors or default to modern colors
  const primaryColor = colors[0] || 'vibrant purple';
  const secondaryColor = colors[1] || 'electric orange';
  
  const prompt = `A single ${dumplingShape} dumpling in bright ${primaryColor} and ${secondaryColor} colors. ARTISTIC STYLE: Exactly like a modern digital artwork with clean vector-style illustration, smooth gradients, and vibrant flat design elements. The dumpling should have bold stylized coloring with contemporary graphic design aesthetics. Modern illustration style with clean lines and vivid colors. Flat design with gradient effects. Black background. NO photorealism, NO realistic food photography. Pure modern graphic illustration style.`;

  console.log("Generated SPECIFIC CONTEMPORARY prompt:", prompt);
  return prompt;
}

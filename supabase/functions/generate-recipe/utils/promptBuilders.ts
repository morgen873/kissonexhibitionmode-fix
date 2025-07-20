
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
  
  console.log("=== BUILDING FUTURISTIC PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'futuristic dumpling ingredients';
  
  const prompt = `masterpiece, best quality, ultra detailed, professional food photography, single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

SDXL optimized futuristic culinary style:
- hyper-realistic food photography, exactly one perfectly sealed dumpling, futuristic presentation
- advanced molecular gastronomy techniques, dumpling wrapper completely closed and sealed
- VIBRANT FUTURISTIC DUMPLING COLORS: electric blue wrapper, neon purple accents, holographic silver details, iridescent teal shimmer, glowing cyan edges
- holographic iridescent dumpling wrapper with shifting blue-purple-pink spectrum on the dumpling surface
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background
- studio lighting with neon edge lighting highlighting the colorful dumpling, cinematic composition
- dumpling wrapper 100% opaque with holographic color shifts, no visible filling, no transparent effects
- no openings tears gaps, completely sealed package appearance with futuristic shimmer
- high-tech food preparation aesthetics, authentic edible appearance with color-changing effects
- single dumpling centered composition, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- gourmet presentation, futuristic culinary innovation, sci-fi food styling
- MAXIMUM DUMPLING COLOR SATURATION: vibrant electric blues, purples, teals, holographic rainbow effects ON THE DUMPLING ONLY

Technical specifications: single dumpling only, pure solid matte black background, sealed wrapper with color-shifting effects, futuristic lighting, commercial quality, centered composition, hyper-realistic, COLORFUL DUMPLING on black background, no duplicates, no extras, no distractions`;

  console.log("Generated FUTURISTIC prompt optimized for SDXL");
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING HISTORICAL PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional historical ingredients';
  
  const prompt = `masterpiece, best quality, ultra detailed, professional food photography, single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

SDXL optimized historical culinary style:
- hyper-realistic food photography, exactly one perfectly sealed dumpling, traditional historical preparation
- traditional handcrafted appearance, slightly rustic texture, artisanal preparation
- VIBRANT HISTORICAL DUMPLING COLORS: warm golden yellow wrapper, rich amber tones, deep russet brown accents, earthy terracotta details, traditional spice coloring
- authentic historical cooking methods, surface texture with golden-brown finish on dumpling
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background
- warm natural lighting highlighting the golden dumpling colors, heritage photography style
- dumpling wrapper completely closed and sealed with warm golden-brown coloring
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance with traditional golden cooking colors
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- authentic historical appearance with rich traditional colors ON THE DUMPLING
- MAXIMUM DUMPLING WARMTH: golden yellows, amber tones, russet browns, traditional spice colors ON THE DUMPLING ONLY

Technical specifications: single dumpling only, pure solid matte black background, sealed wrapper with golden-brown heritage colors, historical authenticity, commercial quality, centered composition, hyper-realistic, COLORFUL DUMPLING on black background, no duplicates, no extras, no distractions`;

  console.log("Generated HISTORICAL prompt optimized for SDXL");
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING CONTEMPORARY PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'contemporary dumpling ingredients';
  
  const prompt = `masterpiece, best quality, ultra detailed, professional food photography, single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

SDXL optimized contemporary culinary style:
- hyper-realistic food photography, exactly one perfectly sealed dumpling, modern culinary presentation
- clean professional preparation, contemporary cooking techniques
- VIBRANT CONTEMPORARY DUMPLING COLORS: fresh green wrapper, bright orange accents, modern coral details, sleek white highlights, trendy mint tones, bold lime edges
- modern aesthetic with bright fresh colors on the dumpling, attention to visual appeal
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background
- professional studio lighting highlighting the bright dumpling colors, contemporary food photography standards
- dumpling wrapper completely closed and sealed with fresh contemporary colors
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance with modern fresh coloring
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- contemporary food presentation with bright modern colors ON THE DUMPLING
- MAXIMUM DUMPLING FRESHNESS: bright greens, vibrant oranges, fresh whites, modern coral tones ON THE DUMPLING ONLY

Technical specifications: single dumpling only, pure solid matte black background, sealed wrapper with contemporary bright colors, modern aesthetics, commercial quality, centered composition, hyper-realistic, COLORFUL DUMPLING on black background, no duplicates, no extras, no distractions`;

  console.log("Generated CONTEMPORARY prompt optimized for SDXL");
  return prompt;
}

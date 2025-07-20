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
- VIBRANT FUTURISTIC COLORS: electric blue, neon purple, holographic silver, iridescent teal, glowing cyan accents
- holographic iridescent dumpling wrapper with shifting blue-purple-pink spectrum, neon accent lighting
- futuristic gradient background: deep space blue to electric purple, subtle technological grid patterns
- studio lighting with neon edge lighting, cinematic sci-fi composition
- dumpling wrapper 100% opaque with holographic color shifts, no visible filling, no transparent effects
- no openings tears gaps, completely sealed package appearance with futuristic shimmer
- high-tech food preparation aesthetics, authentic edible appearance with color-changing effects
- single dumpling centered composition, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- gourmet presentation, futuristic culinary innovation, sci-fi food styling
- MAXIMUM COLOR SATURATION: vibrant electric blues, purples, teals, holographic rainbow effects

Technical specifications: single dumpling only, futuristic colored background, sealed wrapper with color-shifting effects, futuristic lighting, commercial quality, centered composition, hyper-realistic, FULL COLOR, no duplicates, no extras, no distractions`;

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
- VIBRANT HISTORICAL COLORS: warm golden yellow, rich amber, deep russet brown, earthy terracotta, traditional spice tones
- authentic historical cooking methods, surface texture with golden-brown finish
- warm heritage background: rich amber to deep golden gradient, vintage parchment textures, traditional patterns
- warm natural candlelight lighting, golden hour tones, heritage photography style
- dumpling wrapper completely closed and sealed with warm golden-brown coloring
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance with traditional golden cooking colors
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- authentic historical appearance with rich traditional colors
- MAXIMUM WARMTH: golden yellows, amber tones, russet browns, traditional spice colors

Technical specifications: single dumpling only, warm colored background, sealed wrapper with golden-brown heritage colors, historical authenticity, commercial quality, centered composition, hyper-realistic, FULL COLOR, no duplicates, no extras, no distractions`;

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
- VIBRANT CONTEMPORARY COLORS: fresh green, bright orange, modern coral, sleek white, trendy mint, bold lime
- modern aesthetic with bright fresh colors, attention to visual appeal
- clean modern background: fresh white to soft mint gradient, minimalist contemporary design
- professional studio lighting with bright modern illumination, contemporary food photography standards
- dumpling wrapper completely closed and sealed with fresh contemporary colors
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance with modern fresh coloring
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- contemporary food presentation with bright modern colors
- MAXIMUM FRESHNESS: bright greens, vibrant oranges, fresh whites, modern coral tones

Technical specifications: single dumpling only, fresh colored background, sealed wrapper with contemporary bright colors, modern aesthetics, commercial quality, centered composition, hyper-realistic, FULL COLOR, no duplicates, no extras, no distractions`;

  console.log("Generated CONTEMPORARY prompt optimized for SDXL");
  return prompt;
}
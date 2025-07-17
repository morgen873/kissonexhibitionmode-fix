// SAFESPOT BACKUP - Original promptBuilders.ts before artistic enhancement
// Created on: 2025-07-17
// Purpose: Backup for reverting if artistic changes don't work

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
- vibrant holographic iridescent effects, neon accent lighting, blue purple pink tones
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background, studio lighting, cinematic composition
- dumpling wrapper 100% opaque and solid, no visible filling, no transparent effects
- no openings tears gaps, completely sealed package appearance
- high-tech food preparation aesthetics, authentic edible appearance
- single dumpling centered composition, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- gourmet presentation, futuristic culinary innovation, sci-fi food styling
- vibrant colorful presentation, luminous effects, technological aesthetics

Technical specifications: single dumpling only, pure solid matte black background, no textures, no patterns, no gradients, completely black void background, sealed wrapper, futuristic lighting, commercial quality, centered composition, hyper-realistic, no duplicates, no extras, no distractions`;

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
- authentic historical cooking methods, surface texture steamed boiled pan-fried finish
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background, warm natural lighting, golden tones
- dumpling wrapper completely closed and sealed, 100% opaque and solid
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance, traditional food preparation techniques
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- authentic historical appearance, traditional cooking environments
- warm colorful presentation, artisanal craftsmanship, heritage cooking methods

Technical specifications: single dumpling only, pure solid matte black background, no textures, no patterns, no gradients, completely black void background, sealed wrapper, historical authenticity, commercial quality, centered composition, hyper-realistic, no duplicates, no extras, no distractions`;

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
- modern aesthetic, attention to visual appeal, vibrant colors
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background, professional studio lighting, modern food photography standards
- dumpling wrapper completely closed and sealed, 100% opaque and solid
- no visible filling, no transparent translucent effects, no openings tears gaps
- completely sealed package appearance, current culinary trends
- single dumpling centered composition, close-up focused, commercial photography quality
- 8k resolution, highly detailed texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- contemporary food presentation, modern cooking aesthetics
- vibrant colorful presentation, clean minimalist styling, current trends

Technical specifications: single dumpling only, pure solid matte black background, no textures, no patterns, no gradients, completely black void background, sealed wrapper, contemporary aesthetics, commercial quality, centered composition, hyper-realistic, no duplicates, no extras, no distractions`;

  console.log("Generated CONTEMPORARY prompt optimized for SDXL");
  return prompt;
}
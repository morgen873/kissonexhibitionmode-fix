
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
  
  const prompt = `Professional food photography of a single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}.

ONE DUMPLING ONLY - no multiple dumplings, no duplicates, just one single dumpling centered in the frame.

Ingredients visible in composition: ${ingredientsText}

CRITICAL BACKGROUND REQUIREMENT: Pure solid black background (#000000) with NO textures, NO gradients, NO surfaces, NO tables, NO plates - completely flat matte black void.

Futuristic culinary style:
- Hyper-realistic food photography of exactly one dumpling with futuristic presentation
- Advanced molecular gastronomy techniques visible in the dumpling's appearance
- Subtle holographic or iridescent effects on the dumpling wrapper
- The dumpling appears to float against the pure black void
- Studio lighting with subtle neon accent lighting (blue/purple tones)
- Close-up centered composition focusing on the single dumpling
- Emphasis on high-tech food preparation aesthetics while maintaining authentic food appearance
- The dumpling should look real and edible, just prepared with futuristic techniques
- Only one dumpling visible in the entire image
- ABSOLUTELY NO background elements - pure black void only

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, surfaces, or any objects beyond the single dumpling
- Pure solid black background (#000000) - no variations, no textures
- Commercial food photography style with futuristic elements
- IMPORTANT: Show only one single dumpling floating against pure black void`;

  console.log("Generated FUTURISTIC prompt for authentic future food presentation");
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
  
  const prompt = `Professional food photography of a single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}.

ONE DUMPLING ONLY - no multiple dumplings, no duplicates, just one single dumpling centered in the frame.

Ingredients visible in composition: ${ingredientsText}

CRITICAL BACKGROUND REQUIREMENT: Pure solid black background (#000000) with NO textures, NO gradients, NO surfaces, NO tables, NO plates - completely flat matte black void.

Historical culinary style:
- Hyper-realistic food photography of exactly one perfectly sealed dumpling with traditional historical preparation
- Completely closed dumpling wrapper with no visible filling inside - wrapper must be fully opaque and sealed
- Traditional handcrafted appearance with slightly rustic texture showing artisanal preparation
- Authentic historical cooking methods visible in surface texture (steamed, boiled, or pan-fried finish)
- The dumpling appears to float against the pure black void
- Warm, natural lighting reminiscent of traditional cooking environments
- Close-up centered composition focusing on the single intact dumpling
- Emphasis on traditional food preparation techniques and authentic historical appearance
- The dumpling wrapper must be completely sealed and opaque, showing no internal filling
- Only one dumpling visible in the entire image
- ABSOLUTELY NO background elements - pure black void only

Critical requirements:
- Dumpling wrapper must be completely closed and sealed
- No transparent or translucent wrapper effects
- No visible filling or internal ingredients
- Wrapper should be solid and opaque
- Traditional, rustic appearance appropriate for historical period

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, surfaces, or any objects beyond the single dumpling
- Pure solid black background (#000000) - no variations, no textures
- Commercial food photography style with historical authenticity
- IMPORTANT: Show only one single dumpling floating against pure black void`;

  console.log("Generated HISTORICAL prompt for authentic traditional food presentation");
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
  
  const prompt = `Professional food photography of a single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}.

ONE DUMPLING ONLY - no multiple dumplings, no duplicates, just one single dumpling centered in the frame.

Ingredients visible in composition: ${ingredientsText}

CRITICAL BACKGROUND REQUIREMENT: Pure solid black background (#000000) with NO textures, NO gradients, NO surfaces, NO tables, NO plates - completely flat matte black void.

Contemporary culinary style:
- Hyper-realistic food photography of exactly one perfectly sealed dumpling with modern culinary presentation
- Completely closed dumpling wrapper with no visible filling inside - wrapper must be fully opaque and sealed
- Clean, professional preparation with contemporary cooking techniques
- Modern aesthetic with attention to visual appeal
- The dumpling appears to float against the pure black void
- Professional studio lighting with modern food photography standards
- Close-up centered composition focusing on the single intact dumpling
- Emphasis on current culinary trends and contemporary food presentation
- The dumpling wrapper must be completely sealed and opaque, showing no internal filling
- Only one dumpling visible in the entire image
- ABSOLUTELY NO background elements - pure black void only

Critical requirements:
- Dumpling wrapper must be completely closed and sealed
- No transparent or translucent wrapper effects
- No visible filling or internal ingredients
- Wrapper should be solid and opaque

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, surfaces, or any objects beyond the single dumpling
- Pure solid black background (#000000) - no variations, no textures
- Commercial food photography style with contemporary aesthetics
- IMPORTANT: Show only one single dumpling floating against pure black void`;

  console.log("Generated CONTEMPORARY prompt for authentic modern food presentation");
  return prompt;
}

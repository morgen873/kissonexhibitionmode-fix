
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

Futuristic culinary style:
- Hyper-realistic food photography of exactly one dumpling with futuristic presentation
- Advanced molecular gastronomy techniques visible in the dumpling's appearance
- Subtle holographic or iridescent effects on the dumpling wrapper
- Clean, minimalist plating on a sleek modern surface
- Studio lighting with subtle neon accent lighting (blue/purple tones)
- Solid matte black background, no textures or gradients
- Close-up centered composition focusing on the single dumpling
- Emphasis on high-tech food preparation aesthetics while maintaining authentic food appearance
- The dumpling should look real and edible, just prepared with futuristic techniques
- Only one dumpling visible in the entire image

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, or additional objects beyond minimal modern presentation
- Pure black background (#000000)
- Commercial food photography style with futuristic elements
- IMPORTANT: Show only one single dumpling, no multiples`;

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

Historical culinary style:
- Hyper-realistic food photography of exactly one dumpling with traditional historical preparation
- Rustic, handcrafted appearance with slight imperfections that show artisanal preparation
- Traditional cooking methods visible in texture (steamed, boiled, or pan-fried appearance)
- Authentic historical presentation on simple, traditional surface
- Warm, natural lighting reminiscent of historical cooking environments
- Solid matte black background, no textures or gradients
- Close-up centered composition focusing on the single dumpling
- Emphasis on traditional food preparation techniques and authentic historical appearance
- The dumpling should look exactly as it would have been prepared in the historical period
- Only one dumpling visible in the entire image

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, or additional objects beyond minimal traditional presentation
- Pure black background (#000000)
- Commercial food photography style with historical authenticity
- IMPORTANT: Show only one single dumpling, no multiples`;

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

Contemporary culinary style:
- Hyper-realistic food photography of exactly one dumpling with modern culinary presentation
- Clean, professional preparation with contemporary cooking techniques
- Modern plating aesthetic with attention to visual appeal
- Restaurant-quality presentation on contemporary surface
- Professional studio lighting with modern food photography standards
- Solid matte black background, no textures or gradients
- Close-up centered composition focusing on the single dumpling
- Emphasis on current culinary trends and contemporary food presentation
- The dumpling should look as it would be served in a modern restaurant today
- Only one dumpling visible in the entire image

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, or additional objects beyond minimal modern presentation
- Pure black background (#000000)
- Commercial food photography style with contemporary aesthetics
- IMPORTANT: Show only one single dumpling, no multiples`;

  console.log("Generated CONTEMPORARY prompt for authentic modern food presentation");
  return prompt;
}

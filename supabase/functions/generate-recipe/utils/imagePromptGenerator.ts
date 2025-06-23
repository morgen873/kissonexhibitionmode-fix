
import { extractIngredientColors } from './colorExtractor.ts';
import { extractIngredientsList } from './ingredientParser.ts';

interface ImagePromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function generateImagePrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== SIMPLIFIED DIRECT IMAGE PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Emotional context:", `"${emotionalContext}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Recipe title:", `"${recipeTitle}"`);
  console.log("Ingredients list:", ingredientsList);
  
  // Check if this is a futuristic timeline
  const isFuturistic = timelineTheme.toLowerCase().includes('future') || 
                      timelineTheme.toLowerCase().includes('distant') ||
                      timelineTheme.toLowerCase().includes('advanced') ||
                      timelineTheme.toLowerCase().includes('tomorrow');
  
  let finalPrompt;
  
  if (isFuturistic) {
    console.log("🚀 GENERATING SIMPLIFIED FUTURISTIC PROMPT");
    finalPrompt = generateSimpleFuturisticPrompt(params);
  } else {
    console.log("📜 GENERATING SIMPLIFIED ARTISTIC PROMPT");
    finalPrompt = generateSimpleArtisticPrompt(params);
  }
  
  console.log("=== FINAL SIMPLIFIED PROMPT FOR DALL-E ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Full prompt:", finalPrompt);
  
  return finalPrompt;
}

function generateSimpleFuturisticPrompt(params: ImagePromptParams): string {
  const { dumplingShape, recipeTitle } = params;
  
  console.log("🔮 Creating SIMPLE futuristic dumpling prompt");
  
  // Ultra-simple, direct futuristic prompt
  let prompt = `A futuristic sci-fi dumpling that glows with neon light. `;
  prompt += `The dumpling is ${dumplingShape}-shaped and has a translucent, glowing wrapper. `;
  prompt += `Bright electric blue and pink neon colors shine through the translucent skin. `;
  prompt += `The dumpling hovers and emits colorful light beams. `;
  prompt += `Digital art style, not realistic food photography. `;
  prompt += `Cyberpunk aesthetic with glowing effects. `;
  prompt += `Black background. `;
  prompt += `Pure illustration, not a photograph.`;
  
  console.log("Generated SIMPLE futuristic prompt:", prompt);
  return prompt;
}

function generateSimpleArtisticPrompt(params: ImagePromptParams): string {
  const { timelineTheme, dumplingShape, recipeTitle } = params;
  
  console.log("🎨 Creating simple artistic dumpling prompt");
  
  let prompt = `An artistic illustrated dumpling inspired by ${timelineTheme}. `;
  prompt += `The dumpling is ${dumplingShape}-shaped with beautiful artistic coloring. `;
  prompt += `Painted illustration style, not realistic photography. `;
  prompt += `Vibrant colors and artistic brush strokes. `;
  prompt += `Black background. `;
  prompt += `Digital painting, not a photograph.`;
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

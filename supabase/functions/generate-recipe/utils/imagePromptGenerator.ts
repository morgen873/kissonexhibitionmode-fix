
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
  
  console.log("=== 🔍 GPT-IMAGE-1 OPTIMIZED PROMPT GENERATION ===");
  console.log("📊 INPUT PARAMETERS:");
  console.log("- Timeline theme:", `"${timelineTheme}"`);
  console.log("- Emotional context:", `"${emotionalContext}"`);
  console.log("- Dumpling shape:", dumplingShape);
  console.log("- Flavor:", flavor);
  console.log("- Recipe title:", `"${recipeTitle}"`);
  console.log("- Ingredients list:", ingredientsList);
  
  // Extract ingredients text for the prompt
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional dumpling ingredients';
  
  // Generate optimized prompt for GPT-IMAGE-1 (no automatic rewriting)
  const prompt = `Professional food photography of ${dumplingShape}-shaped dumplings with ${flavor} flavor profile, inspired by ${timelineTheme} aesthetic.

Ingredients visible in composition: ${ingredientsText}

Visual style:
- Hyper-realistic food photography
- Studio lighting with soft overhead illumination
- Solid matte black background, no textures or gradients
- Close-up centered composition
- Shallow depth of field focusing on the dumplings
- Emphasis on texture, gloss, and appetizing presentation
- ${timelineTheme.toLowerCase().includes('future') ? 'Futuristic plating with clean geometric arrangement' : 'Traditional elegant plating'}

Technical specifications:
- High resolution, professional food photography quality
- No text, logos, or graphic elements
- No utensils, plates, or additional objects
- Pure black background (#000000)
- Realistic lighting that enhances food textures
- Commercial food photography style`;
  
  console.log("=== 📤 GPT-IMAGE-1 OPTIMIZED PROMPT OUTPUT ===");
  console.log("🎯 PROMPT TYPE: GPT-IMAGE-1 PROFESSIONAL FOOD PHOTOGRAPHY");
  console.log("🎯 PROMPT LENGTH:", prompt.length);
  console.log("🎯 FULL PROMPT:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(prompt);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

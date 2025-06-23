
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
  
  console.log("=== 🔍 HYPER-REALISTIC FOOD PHOTOGRAPHY PROMPT GENERATION ===");
  console.log("📊 INPUT PARAMETERS:");
  console.log("- Timeline theme:", `"${timelineTheme}"`);
  console.log("- Emotional context:", `"${emotionalContext}"`);
  console.log("- Dumpling shape:", dumplingShape);
  console.log("- Flavor:", flavor);
  console.log("- Recipe title:", `"${recipeTitle}"`);
  console.log("- Ingredients list:", ingredientsList);
  
  // Extract ingredients text for the prompt
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional dumpling ingredients';
  
  // Generate the hyper-realistic food photography prompt using the user's exact template
  const prompt = `Create a hyper-realistic food photography image of a single dumpling dish, based strictly on the recipe that the system created.

– Time Period: ${timelineTheme}
– Ingredients: ${ingredientsText}
– Preparation Style: ${dumplingShape}-shaped dumpling with ${flavor} flavor
– Presentation: food photography, realistic HD
– Background: **Solid black only. No textures, no shadows, no objects.**
– Lighting: Soft overhead light, food photography style, emphasize texture and gloss.
– Composition: Close-up, centered, realistic depth of field.

Strict rules:
- Do **not** add ingredients or visual elements not explicitly described, no text, no sketches, no lines.
- Do **not** render generic dumplings.
- Do **not** change the time period aesthetic.
- The image must look like a professional food photograph.
- The image must have a **solid black background** with no gradients or noise.

This is not conceptual art. This is a literal, historical or futuristic dumpling based on the given inputs.`;
  
  console.log("=== 📤 FINAL PROMPT OUTPUT ===");
  console.log("🎯 PROMPT TYPE: HYPER-REALISTIC FOOD PHOTOGRAPHY");
  console.log("🎯 PROMPT LENGTH:", prompt.length);
  console.log("🎯 FULL PROMPT:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(prompt);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

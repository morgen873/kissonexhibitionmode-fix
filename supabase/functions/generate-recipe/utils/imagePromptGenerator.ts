
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
  
  console.log("=== 🔍 DETAILED PROMPT GENERATION TRACING ===");
  console.log("📊 INPUT PARAMETERS RECEIVED:");
  console.log("- Timeline theme:", `"${timelineTheme}"`);
  console.log("- Emotional context:", `"${emotionalContext}"`);
  console.log("- Dumpling shape:", dumplingShape);
  console.log("- Flavor:", flavor);
  console.log("- Recipe title:", `"${recipeTitle}"`);
  console.log("- Ingredients list:", ingredientsList);
  console.log("- Ingredients list length:", ingredientsList.length);
  console.log("- Timeline theme type:", typeof timelineTheme);
  console.log("- Timeline theme toLowerCase():", timelineTheme.toLowerCase());
  
  // Check if timeline contains futuristic keywords
  const futuristicKeywords = ['future', 'distant', 'advanced', 'tomorrow', 'sci-fi', 'cyberpunk', 'space', 'robot', 'ai', 'technology'];
  const isFuturistic = futuristicKeywords.some(keyword => timelineTheme.toLowerCase().includes(keyword));
  
  console.log("🔍 FUTURISTIC DETECTION:");
  console.log("- Futuristic keywords:", futuristicKeywords);
  console.log("- Is futuristic detected:", isFuturistic);
  console.log("- Timeline analysis:", timelineTheme.toLowerCase());
  
  const finalPrompt = generateHyperRealisticFoodPrompt(params);
  
  console.log("=== 📤 FINAL PROMPT BEING SENT TO DALL-E ===");
  console.log("🎯 PROMPT LENGTH:", finalPrompt.length);
  console.log("🎯 CHARACTER COUNT:", finalPrompt.length);
  console.log("🎯 WORD COUNT:", finalPrompt.split(' ').length);
  console.log("🎯 FULL PROMPT TEXT:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(finalPrompt);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Validate prompt contains expected elements
  const promptLower = finalPrompt.toLowerCase();
  console.log("🔍 PROMPT VALIDATION:");
  console.log("- Contains 'futuristic':", promptLower.includes('futuristic'));
  console.log("- Contains 'sci-fi':", promptLower.includes('sci-fi'));
  console.log("- Contains 'neon':", promptLower.includes('neon'));
  console.log("- Contains 'glowing':", promptLower.includes('glowing'));
  console.log("- Contains timeline theme:", promptLower.includes(timelineTheme.toLowerCase()));
  console.log("- Contains dumpling shape:", promptLower.includes(dumplingShape.toLowerCase()));
  
  return finalPrompt;
}

function generateHyperRealisticFoodPrompt(params: ImagePromptParams): string {
  const { timelineTheme, dumplingShape, ingredientsList } = params;
  
  console.log("🍽️ HYPER-REALISTIC PROMPT GENERATION STARTED");
  console.log("📋 PROMPT BUILDING INPUTS:");
  console.log("- Timeline theme for prompt:", `"${timelineTheme}"`);
  console.log("- Shape for prompt:", dumplingShape);
  console.log("- Ingredients for prompt:", ingredientsList);
  
  // Convert ingredients array to a readable string
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional dumpling ingredients';
  console.log("- Final ingredients text:", `"${ingredientsText}"`);
  
  let prompt = `Create a hyper-realistic food photography image of a single dumpling dish, based strictly on the following recipe.

– Time Period: ${timelineTheme}
– Ingredients: ${ingredientsText}
– Preparation Style: ${dumplingShape}-shaped dumpling
– Presentation: food photography, realistic HD
– Background: **Solid black only. No textures, no shadows, no objects.**
– Lighting: Soft overhead light, food photography style, emphasize texture and gloss.
– Composition: Close-up, centered, realistic depth of field.

Strict rules:
- Do **not** add ingredients or visual elements not explicitly described.
- Do **not** render generic dumplings.
- Do **not** change the time period aesthetic.
- The image must look like a professional food photograph.
- The image must have a **solid black background** with no gradients or noise.

This is not conceptual art. This is a literal, historical or futuristic dumpling based on the given inputs.`;
  
  console.log("✅ PROMPT CONSTRUCTION COMPLETE");
  console.log("📏 Generated prompt length:", prompt.length);
  console.log("📝 Generated prompt preview (first 200 chars):", prompt.substring(0, 200) + "...");
  
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

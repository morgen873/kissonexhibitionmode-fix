
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
  
  console.log("=== 🔍 NEW SIMPLIFIED PROMPT GENERATION ===");
  console.log("📊 INPUT PARAMETERS:");
  console.log("- Timeline theme:", `"${timelineTheme}"`);
  console.log("- Emotional context:", `"${emotionalContext}"`);
  console.log("- Dumpling shape:", dumplingShape);
  console.log("- Flavor:", flavor);
  console.log("- Recipe title:", `"${recipeTitle}"`);
  console.log("- Ingredients list:", ingredientsList);
  
  // Check if timeline contains futuristic keywords with expanded detection
  const futuristicKeywords = [
    'future', 'distant', 'advanced', 'tomorrow', 'sci-fi', 'cyberpunk', 
    'space', 'robot', 'ai', 'technology', 'neon', 'holographic', 'digital',
    'virtual', 'synthetic', 'quantum', 'nano', 'cyber', 'techno'
  ];
  
  const timelineLower = timelineTheme.toLowerCase();
  const isFuturistic = futuristicKeywords.some(keyword => timelineLower.includes(keyword));
  
  console.log("🔍 FUTURISTIC DETECTION:");
  console.log("- Timeline text:", timelineLower);
  console.log("- Is futuristic detected:", isFuturistic);
  
  let finalPrompt: string;
  
  if (isFuturistic) {
    finalPrompt = generateFuturisticPrompt(params);
  } else {
    finalPrompt = generateHistoricalPrompt(params);
  }
  
  console.log("=== 📤 FINAL PROMPT OUTPUT ===");
  console.log("🎯 PROMPT TYPE:", isFuturistic ? "FUTURISTIC" : "HISTORICAL");
  console.log("🎯 PROMPT LENGTH:", finalPrompt.length);
  console.log("🎯 FULL PROMPT:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(finalPrompt);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  return finalPrompt;
}

function generateFuturisticPrompt(params: ImagePromptParams): string {
  const { timelineTheme, dumplingShape, ingredientsList, recipeTitle } = params;
  
  console.log("🚀 GENERATING FUTURISTIC PROMPT");
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'advanced synthetic ingredients';
  
  const prompt = `Create a stunning futuristic sci-fi dumpling image:

SUBJECT: A single ${dumplingShape}-shaped dumpling with incredible futuristic design
TIME PERIOD: ${timelineTheme} - fully embrace this futuristic aesthetic
INGREDIENTS: ${ingredientsText} but rendered with futuristic technology
VISUAL STYLE: Cyberpunk, neon-lit, holographic, sci-fi food art

MANDATORY FUTURISTIC ELEMENTS:
- Glowing neon colors (electric blue, hot pink, acid green)
- Holographic textures and translucent materials
- Digital circuit patterns or data streams
- Metallic chrome or iridescent surfaces
- Floating particles or energy fields
- LED-like glowing edges
- Futuristic plating on high-tech surfaces

TECHNICAL SPECS:
- Ultra-sharp 4K digital art quality
- Dramatic neon lighting
- Solid black background
- Close-up centered composition
- Maximum visual impact and excitement

DO NOT make this look like regular food photography. This must be visually striking futuristic sci-fi art that would fit in a cyberpunk movie.`;

  console.log("✅ FUTURISTIC PROMPT GENERATED");
  return prompt;
}

function generateHistoricalPrompt(params: ImagePromptParams): string {
  const { timelineTheme, dumplingShape, ingredientsList } = params;
  
  console.log("🏛️ GENERATING HISTORICAL PROMPT");
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'traditional dumpling ingredients';
  
  const prompt = `Create a realistic historical dumpling photograph:

SUBJECT: A single ${dumplingShape}-shaped dumpling
TIME PERIOD: ${timelineTheme} - authentic to this historical era
INGREDIENTS: ${ingredientsText}
VISUAL STYLE: Period-accurate food photography

HISTORICAL STYLING:
- Authentic ingredients and preparation methods from ${timelineTheme}
- Traditional serving vessels and utensils
- Period-appropriate lighting and atmosphere
- Historically accurate colors and textures

TECHNICAL SPECS:
- Professional food photography
- Realistic lighting
- Solid black background
- Centered composition
- High detail and texture emphasis

This should look like an authentic representation of food from ${timelineTheme}.`;

  console.log("✅ HISTORICAL PROMPT GENERATED");
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

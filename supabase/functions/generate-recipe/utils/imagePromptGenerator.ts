
import { extractIngredientColors } from './colorExtractor.ts';
import { buildFuturisticPrompt, buildHistoricalPrompt, buildContemporaryPrompt } from './promptBuilders.ts';
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
  
  console.log("=== ULTRA-FORCEFUL ARTISTIC IMAGE PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Emotional context:", `"${emotionalContext}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Recipe title:", `"${recipeTitle}"`);
  console.log("Ingredients list:", ingredientsList);
  
  // Enhanced timeline classification with more nuanced detection
  const timelineLower = timelineTheme.toLowerCase();
  const emotionalLower = emotionalContext.toLowerCase();
  
  const isFuturistic = timelineLower.includes('future') || 
                       timelineLower.includes('distant') || 
                       timelineLower.includes('tomorrow') ||
                       timelineLower.includes('advanced') ||
                       timelineLower.includes('cyber') ||
                       timelineLower.includes('space') ||
                       timelineLower.includes('2030') ||
                       timelineLower.includes('2040') ||
                       timelineLower.includes('2050') ||
                       timelineLower.includes('tech') ||
                       emotionalLower.includes('digital') ||
                       emotionalLower.includes('virtual');

  const isHistorical = timelineLower.includes('ancient') || 
                       timelineLower.includes('past') || 
                       timelineLower.includes('medieval') ||
                       timelineLower.includes('traditional') ||
                       timelineLower.includes('old') ||
                       timelineLower.includes('historic') ||
                       timelineLower.includes('vintage') ||
                       timelineLower.includes('classic') ||
                       timelineLower.includes('1800') ||
                       timelineLower.includes('1900') ||
                       timelineLower.includes('century') ||
                       emotionalLower.includes('heritage') ||
                       emotionalLower.includes('ancestral');

  console.log("Timeline classification:");
  console.log("- Is Futuristic:", isFuturistic);
  console.log("- Is Historical:", isHistorical);
  
  // Extract colors with enhanced vibrant mapping
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("Color extraction results:");
  console.log("- Colors found:", colors);
  console.log("- Descriptions:", descriptions);
  console.log("- Effects:", effects);
  
  // Create ULTRA-FORCEFUL artistic context
  const comprehensiveContext = {
    timelineTheme,
    emotionalContext,
    dumplingShape,
    flavor,
    ingredientsList,
    recipeTitle,
    colors,
    descriptions,
    effects,
    emotionalDescriptors: extractEmotionalDescriptors(emotionalContext),
    timelineAtmosphere: extractTimelineAtmosphere(timelineTheme)
  };

  let finalPrompt = '';
  
  if (isFuturistic) {
    console.log("🚀 Using ULTRA-FORCEFUL FUTURISTIC artistic prompt");
    finalPrompt = buildUltraForcefulFuturisticPrompt(comprehensiveContext);
  } else if (isHistorical) {
    console.log("🏛️ Using ULTRA-FORCEFUL HISTORICAL artistic prompt");
    finalPrompt = buildUltraForcefulHistoricalPrompt(comprehensiveContext);
  } else {
    console.log("🎨 Using ULTRA-FORCEFUL CONTEMPORARY artistic prompt");
    finalPrompt = buildUltraForcefulContemporaryPrompt(comprehensiveContext);
  }
  
  console.log("=== FINAL ULTRA-FORCEFUL ARTISTIC PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Full prompt:", finalPrompt);
  
  return finalPrompt;
}

function extractEmotionalDescriptors(emotionalContext: string): string[] {
  const descriptors: string[] = [];
  const context = emotionalContext.toLowerCase();
  
  // Map emotional keywords to visual descriptors
  if (context.includes('love') || context.includes('heart')) {
    descriptors.push('heart-shaped patterns', 'warm glowing aura', 'romantic ambiance');
  }
  if (context.includes('memory') || context.includes('remember')) {
    descriptors.push('nostalgic glow', 'ethereal mist', 'dreamlike quality');
  }
  if (context.includes('hope') || context.includes('future')) {
    descriptors.push('bright radiance', 'upward energy', 'luminous trail');
  }
  if (context.includes('joy') || context.includes('happy')) {
    descriptors.push('sparkling effects', 'vibrant energy', 'celebratory atmosphere');
  }
  if (context.includes('peace') || context.includes('calm')) {
    descriptors.push('serene glow', 'gentle waves', 'tranquil energy');
  }
  if (context.includes('strength') || context.includes('power')) {
    descriptors.push('bold presence', 'dynamic energy', 'powerful aura');
  }
  if (context.includes('sadness') || context.includes('bittersweet')) {
    descriptors.push('melancholic glow', 'gentle tears of light', 'poignant shimmer');
  }
  if (context.includes('cherish') || context.includes('treasure')) {
    descriptors.push('precious luminescence', 'treasured gleam', 'cherished radiance');
  }
  
  return descriptors.length > 0 ? descriptors : ['meaningful glow', 'significant presence', 'emotional depth'];
}

function extractTimelineAtmosphere(timelineTheme: string): string {
  const theme = timelineTheme.toLowerCase();
  
  if (theme.includes('future') || theme.includes('advanced') || theme.includes('distant')) {
    return 'holographic environment with floating particles, digital effects, and cyberpunk aesthetics';
  }
  if (theme.includes('ancient') || theme.includes('traditional')) {
    return 'classical setting with ornate patterns and timeless elements';
  }
  if (theme.includes('medieval')) {
    return 'medieval atmosphere with stone textures and heraldic elements';
  }
  if (theme.includes('space') || theme.includes('cosmic')) {
    return 'cosmic setting with stellar backgrounds and space phenomena';
  }
  
  return 'contemporary setting with modern artistic elements';
}

function buildUltraForcefulFuturisticPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'electric blue';
  const secondaryColor = colors[1] || 'bright pink';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `ARTISTIC ILLUSTRATION ONLY - NO PHOTOGRAPHY: Create a vibrant futuristic digital art illustration of a ${dumplingShape}-shaped dumpling called "${recipeTitle}". Style: Pure digital art with neon ${primaryColor} and ${secondaryColor} colors, holographic effects, glowing translucent wrapper, cyberpunk aesthetics. The dumpling embodies ${emotionalContext} with ${emotionalEffects}. Ingredients: ${ingredientsList.join(', ')}. Setting: ${timelineAtmosphere}. CRITICAL: This must be a stylized cartoon-like digital illustration with bright neon colors, NOT realistic food photography. Vector art style with smooth gradients, glowing effects, and futuristic elements. Pure black background. Absolutely NO photorealism, NO realistic textures, NO food photography. Only vibrant digital artwork.`;

  console.log("Generated ULTRA-FORCEFUL FUTURISTIC prompt:", prompt);
  return prompt;
}

function buildUltraForcefulHistoricalPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'deep red';
  const secondaryColor = colors[1] || 'golden yellow';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `ARTISTIC PAINTING ONLY - NO PHOTOGRAPHY: Create a beautiful historical watercolor painting of a ${dumplingShape}-shaped dumpling called "${recipeTitle}". Style: Traditional watercolor art with rich ${primaryColor} and ${secondaryColor} pigments, artistic brush strokes, ornate decorative elements. The dumpling embodies ${emotionalContext} with ${emotionalEffects}. Ingredients: ${ingredientsList.join(', ')}. Setting: ${timelineAtmosphere}. CRITICAL: This must be a stylized watercolor painting with artistic coloring, NOT realistic food photography. Hand-painted illustration style with painterly effects and classical ornamentation. Pure black background. Absolutely NO photorealism, NO realistic textures, NO food photography. Only artistic painted illustration.`;

  console.log("Generated ULTRA-FORCEFUL HISTORICAL prompt:", prompt);
  return prompt;
}

function buildUltraForcefulContemporaryPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'vibrant purple';
  const secondaryColor = colors[1] || 'electric orange';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `ARTISTIC GRAPHIC DESIGN ONLY - NO PHOTOGRAPHY: Create a modern graphic design illustration of a ${dumplingShape}-shaped dumpling called "${recipeTitle}". Style: Contemporary vector art with bold ${primaryColor} and ${secondaryColor} colors, clean geometric design, modern graphic elements. The dumpling embodies ${emotionalContext} with ${emotionalEffects}. Ingredients: ${ingredientsList.join(', ')}. Setting: ${timelineAtmosphere}. CRITICAL: This must be a stylized vector graphic illustration with flat design aesthetics, NOT realistic food photography. Modern digital art style with clean lines, vivid colors, and contemporary design elements. Pure black background. Absolutely NO photorealism, NO realistic textures, NO food photography. Only graphic design illustration.`;

  console.log("Generated ULTRA-FORCEFUL CONTEMPORARY prompt:", prompt);
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

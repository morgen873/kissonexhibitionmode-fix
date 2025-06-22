
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
  
  console.log("=== ENHANCED IMAGE PROMPT GENERATION WITH FULL CONTEXT ===");
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

  console.log("Enhanced timeline classification:");
  console.log("- Is Futuristic:", isFuturistic);
  console.log("- Is Historical:", isHistorical);
  console.log("- Timeline theme analysis:", timelineTheme);
  console.log("- Emotional context analysis:", emotionalContext);
  
  // Extract colors with enhanced vibrant mapping
  const { colors, descriptions, effects } = extractIngredientColors(ingredientsList);
  console.log("ENHANCED color extraction results:");
  console.log("- Colors found:", colors);
  console.log("- Descriptions:", descriptions);
  console.log("- Effects:", effects);
  
  // Create comprehensive context for image generation
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
    // Add derived emotional descriptors
    emotionalDescriptors: extractEmotionalDescriptors(emotionalContext),
    // Add timeline atmosphere
    timelineAtmosphere: extractTimelineAtmosphere(timelineTheme)
  };

  let finalPrompt = '';
  
  if (isFuturistic) {
    console.log("🚀 Using ENHANCED FUTURISTIC prompt with full emotional context");
    finalPrompt = buildEnhancedFuturisticPrompt(comprehensiveContext);
  } else if (isHistorical) {
    console.log("🏛️ Using ENHANCED HISTORICAL prompt with full emotional context");
    finalPrompt = buildEnhancedHistoricalPrompt(comprehensiveContext);
  } else {
    console.log("🎨 Using ENHANCED CONTEMPORARY prompt with full emotional context");
    finalPrompt = buildEnhancedContemporaryPrompt(comprehensiveContext);
  }
  
  console.log("=== FINAL ENHANCED ARTISTIC PROMPT ===");
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
  
  return descriptors.length > 0 ? descriptors : ['meaningful glow', 'significant presence', 'emotional depth'];
}

function extractTimelineAtmosphere(timelineTheme: string): string {
  const theme = timelineTheme.toLowerCase();
  
  if (theme.includes('future') || theme.includes('advanced')) {
    return 'holographic environment with floating particles and digital effects';
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

function buildEnhancedFuturisticPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'electric blue';
  const secondaryColor = colors[1] || 'bright pink';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `Create a stunning futuristic artistic illustration of a ${dumplingShape}-shaped dumpling representing "${recipeTitle}". The dumpling embodies the essence of ${emotionalContext} in a ${timelineTheme} setting. Visual elements: ${emotionalEffects}, ${timelineAtmosphere}. The dumpling features ${flavor} characteristics with ingredients ${ingredientsList.join(', ')} expressed through ${primaryColor} and ${secondaryColor} coloring. ARTISTIC STYLE: Vibrant digital illustration with holographic effects, neon glows, translucent surfaces, and futuristic lighting. Smooth gradients with cyberpunk aesthetics. The dumpling should have a translucent wrapper showing internal ingredient colors. Holographic rainbow lighting effects around the dumpling. Ultra-vibrant saturated colors with electric glows. Digital art style with clean vector lines and smooth shading. Pure black background for dramatic contrast. NO photorealism, NO realistic food photography. Pure artistic futuristic illustration style with sci-fi elements.`;

  console.log("Generated ENHANCED FUTURISTIC prompt:", prompt);
  return prompt;
}

function buildEnhancedHistoricalPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'deep red';
  const secondaryColor = colors[1] || 'golden yellow';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `Create a beautiful historical artistic illustration of a ${dumplingShape}-shaped dumpling representing "${recipeTitle}". The dumpling embodies the essence of ${emotionalContext} in a ${timelineTheme} setting. Visual elements: ${emotionalEffects}, ${timelineAtmosphere}. The dumpling features ${flavor} characteristics with ingredients ${ingredientsList.join(', ')} expressed through rich ${primaryColor} and ${secondaryColor} coloring. ARTISTIC STYLE: Classical watercolor painting with ornate details, traditional brush strokes, and vintage aesthetics. The dumpling should have beautiful hand-painted coloring with artistic shading and classical ornamentation. Traditional illustration style with painterly effects and rich pigments. Watercolor technique with vivid colors and artistic textures. Ornate decorative elements surrounding the dumpling. Pure black background for dramatic presentation. NO photorealism, NO modern photography. Pure artistic historical painting style with classical elements.`;

  console.log("Generated ENHANCED HISTORICAL prompt:", prompt);
  return prompt;
}

function buildEnhancedContemporaryPrompt(context: any): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, emotionalDescriptors, timelineAtmosphere } = context;
  
  const primaryColor = colors[0] || 'vibrant purple';
  const secondaryColor = colors[1] || 'electric orange';
  const emotionalEffects = emotionalDescriptors.join(', ');
  
  const prompt = `Create a modern artistic illustration of a ${dumplingShape}-shaped dumpling representing "${recipeTitle}". The dumpling embodies the essence of ${emotionalContext} in a ${timelineTheme} setting. Visual elements: ${emotionalEffects}, ${timelineAtmosphere}. The dumpling features ${flavor} characteristics with ingredients ${ingredientsList.join(', ')} expressed through bright ${primaryColor} and ${secondaryColor} coloring. ARTISTIC STYLE: Contemporary digital artwork with clean vector-style illustration, bold graphic design elements, and modern aesthetics. The dumpling should have stylized coloring with contemporary graphic design principles. Modern illustration style with clean lines, vivid colors, and artistic flair. Flat design with gradient effects and modern artistic elements. Geometric patterns and contemporary visual effects around the dumpling. Pure black background for modern contrast. NO photorealism, NO realistic food photography. Pure modern graphic illustration style with contemporary design elements.`;

  console.log("Generated ENHANCED CONTEMPORARY prompt:", prompt);
  return prompt;
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

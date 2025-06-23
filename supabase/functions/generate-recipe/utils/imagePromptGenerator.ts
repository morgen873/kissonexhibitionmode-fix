
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
  
  console.log("=== ENHANCED FUTURISTIC IMAGE PROMPT GENERATION ===");
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
    console.log("🚀 GENERATING ULTRA-FUTURISTIC SCI-FI PROMPT");
    finalPrompt = generateUltraFuturisticPrompt({
      timelineTheme,
      emotionalContext,
      dumplingShape,
      flavor,
      ingredientsList,
      recipeTitle
    });
  } else {
    console.log("📜 GENERATING STANDARD ARTISTIC PROMPT");
    finalPrompt = generateStandardArtisticPrompt({
      timelineTheme,
      emotionalContext,
      dumplingShape,
      flavor,
      ingredientsList,
      recipeTitle
    });
  }
  
  console.log("=== FINAL PROMPT FOR DALL-E ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Full prompt:", finalPrompt);
  
  return finalPrompt;
}

function generateUltraFuturisticPrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("🔮 Creating ULTRA-FUTURISTIC sci-fi dumpling prompt");
  
  // Build the most futuristic, glowing, translucent dumpling possible
  let prompt = "ULTRA-FUTURISTIC HOLOGRAPHIC DUMPLING: A mind-blowing, translucent dumpling that looks like pure alien technology from 3000 years in the future. ";
  
  // Core futuristic appearance - TRANSLUCENT AND GLOWING
  prompt += "The dumpling has a COMPLETELY TRANSLUCENT, CRYSTAL-CLEAR wrapper that glows with intense neon bioluminescence. ";
  prompt += "BRIGHT ELECTRIC COLORS pulse through the translucent shell - blazing neon blues, hot plasma pinks, acid greens, and electric purples. ";
  
  // Enhanced shape with sci-fi geometry
  const futuristicShape = getUltraFuturisticShape(dumplingShape);
  prompt += `${futuristicShape} `;
  
  // Maximum holographic and energy effects
  prompt += "SPECTACULAR holographic rainbow patterns spiral around the dumpling like DNA helixes. ";
  prompt += "Bright particle beams and energy wisps shoot out from the surface in all directions. ";
  prompt += "Glowing circuit patterns run through the translucent wrapper like living technology. ";
  
  // Ingredient-based sci-fi lighting effects
  const sciFiLighting = getSciFiIngredientLighting(ingredientsList);
  prompt += `${sciFiLighting} `;
  
  // Timeline-specific futuristic enhancements
  const timelineEnhancement = getFuturisticTimelineEnhancement(timelineTheme);
  prompt += `${timelineEnhancement} `;
  
  // Emotional intensity through plasma effects
  const plasmaEffects = getPlasmaEmotionalEffects(emotionalContext);
  prompt += `${plasmaEffects} `;
  
  // MAXIMUM sci-fi styling requirements
  prompt += "ARTISTIC STYLE: Ultra-vibrant digital sci-fi art with MAXIMUM neon saturation and glow effects. ";
  prompt += "Cyberpunk hologram aesthetic with translucent materials, plasma energy, and rainbow particle effects. ";
  prompt += "The dumpling should look like a glowing alien artifact or advanced food technology. ";
  prompt += "Pure black void background (#000000) to make the neon colors pop. ";
  prompt += "NO realistic food photography - pure futuristic digital art with intense glowing effects. ";
  prompt += "Think holographic display, alien technology, bioluminescent organism, and neon cyberpunk combined.";
  
  console.log("Generated ULTRA-FUTURISTIC prompt:", prompt);
  return prompt;
}

function generateStandardArtisticPrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("🎨 Creating standard artistic dumpling prompt");
  
  let prompt = `Beautiful artistic ${dumplingShape} dumpling inspired by ${timelineTheme} and ${emotionalContext}. `;
  prompt += `The dumpling incorporates ${ingredientsList.slice(0, 3).join(', ')} with ${flavor} characteristics. `;
  prompt += `This represents "${recipeTitle}". `;
  
  // Standard artistic styling
  prompt += "ARTISTIC STYLE: Vibrant digital illustration with smooth gradients and artistic shading. ";
  prompt += "Beautiful hand-painted appearance with rich colors and artistic brush effects. ";
  prompt += "Pure black background. Clean, stylized food art illustration.";
  
  return prompt;
}

function getUltraFuturisticShape(dumplingShape: string): string {
  switch (dumplingShape.toLowerCase()) {
    case 'round':
      return "The dumpling forms a perfect GLOWING SPHERE with geometric holographic seams that pulse with circuit-like neon patterns.";
    case 'crescent':
      return "The dumpling curves into a sleek CRESCENT like a futuristic spacecraft wing with razor-sharp glowing edges that emit particle trails.";
    case 'square':
      return "The dumpling has precise CUBIC geometry with holographic corner joints and digital grid patterns that glow with electric energy.";
    case 'triangular':
      return "The dumpling forms a sharp TRIANGULAR pyramid with crystalline facets that refract brilliant neon light in all directions.";
    case 'flower':
      return "The dumpling blooms like a DIGITAL FLOWER with translucent petal-segments that pulse with rainbow bioluminescent energy.";
    default:
      return "The dumpling has a futuristic bio-engineered form with glowing geometric pleats and translucent tech-organic curves.";
  }
}

function getSciFiIngredientLighting(ingredientsList: string[]): string {
  const lightingEffects: string[] = [];
  
  ingredientsList.forEach(ingredient => {
    const ing = ingredient.toLowerCase();
    
    if (ing.includes('herb') || ing.includes('basil') || ing.includes('cilantro') || ing.includes('parsley')) {
      lightingEffects.push("Microscopic green bio-lights pulse through the wrapper like living neural networks");
    }
    if (ing.includes('spice') || ing.includes('pepper') || ing.includes('chili')) {
      lightingEffects.push("Red plasma energy crackles across the surface with electric spice particle bursts");
    }
    if (ing.includes('chocolate') || ing.includes('cocoa')) {
      lightingEffects.push("Dark matter quantum swirls create bronze-purple energy vortexes inside the translucent core");
    }
    if (ing.includes('cheese') || ing.includes('cream')) {
      lightingEffects.push("Liquid gold nano-particles flow like molten starlight through the bio-tech wrapper");
    }
    if (ing.includes('mushroom')) {
      lightingEffects.push("Alien spore-lights create purple bioluminescent networks that pulse like living circuitry");
    }
    if (ing.includes('seafood') || ing.includes('shrimp') || ing.includes('fish')) {
      lightingEffects.push("Ocean-blue quantum waves ripple through the translucent shell with holographic water effects");
    }
    if (ing.includes('vegetable') || ing.includes('carrot') || ing.includes('onion')) {
      lightingEffects.push("Rainbow spectrum data-streams flow like digital vegetable DNA through fiber-optic channels");
    }
  });
  
  if (lightingEffects.length === 0) {
    lightingEffects.push("Multi-colored energy streams flow through the translucent wrapper like liquid rainbow starlight");
  }
  
  return lightingEffects.join('. ') + ".";
}

function getFuturisticTimelineEnhancement(timelineTheme: string): string {
  const theme = timelineTheme.toLowerCase();
  
  if (theme.includes('distant future') || theme.includes('far future')) {
    return "Ultra-advanced nano-technology makes the dumpling surface shimmer with self-assembling molecular patterns. Quantum field distortions bend light around it creating rainbow halos.";
  }
  if (theme.includes('near future') || theme.includes('tomorrow')) {
    return "Cutting-edge bio-engineering creates a dumpling with smart-material wrapper that dynamically shifts colors and emits particle streams.";
  }
  if (theme.includes('future') || theme.includes('advanced')) {
    return "Futuristic bio-technology creates a dumpling that pulses with alien energy signatures and otherworldly holographic luminescence.";
  }
  
  return "Advanced alien technology makes the dumpling glow with interdimensional energy and emit spectacular light shows.";
}

function getPlasmaEmotionalEffects(emotionalContext: string): string {
  const context = emotionalContext.toLowerCase();
  
  if (context.includes('intense') || context.includes('powerful') || context.includes('strong')) {
    return "EXPLOSIVE plasma lightning with high-energy particle beams shooting from the dumpling like a supernova.";
  }
  if (context.includes('gentle') || context.includes('soft') || context.includes('calm')) {
    return "Soft ethereal aurora glow with gentle rainbow particle streams and peaceful bioluminescent pulses.";
  }
  if (context.includes('bright') || context.includes('vibrant') || context.includes('energetic')) {
    return "ULTRA-BRIGHT neon explosion with maximum color saturation and electric energy bursts radiating outward.";
  }
  if (context.includes('warm') || context.includes('cozy') || context.includes('comfort')) {
    return "Warm golden-orange plasma glow with cozy starlight wisps and inviting holographic particle effects.";
  }
  
  return "Dynamic multi-colored plasma lighting with spectacular holographic effects and radiant energy displays.";
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

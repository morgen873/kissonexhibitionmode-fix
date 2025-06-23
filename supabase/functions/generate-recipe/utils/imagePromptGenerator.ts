
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
  
  console.log("=== FUTURISTIC SCI-FI DUMPLING PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Emotional context:", `"${emotionalContext}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Recipe title:", `"${recipeTitle}"`);
  console.log("Ingredients list:", ingredientsList);
  
  // Generate ultra-futuristic prompt
  const finalPrompt = generateFuturisticSciFiPrompt({
    timelineTheme,
    emotionalContext,
    dumplingShape,
    flavor,
    ingredientsList,
    recipeTitle
  });
  
  console.log("=== FINAL FUTURISTIC SCI-FI PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Full prompt:", finalPrompt);
  
  return finalPrompt;
}

function generateFuturisticSciFiPrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  // Build ultra-futuristic sci-fi dumpling prompt
  let prompt = "FUTURISTIC SCI-FI DUMPLING: A mind-blowing, ultra-futuristic dumpling that looks like it came from 3000 years in the future. ";
  
  // Add cyberpunk/sci-fi visual elements
  prompt += "The dumpling has a TRANSLUCENT, GLOWING wrapper that pulses with neon bioluminescent colors - electric blues, hot magentas, acid greens, and plasma purples. ";
  
  // Add shape with futuristic twist
  const futuristicShape = getFuturisticShapeDescription(dumplingShape);
  prompt += `${futuristicShape} `;
  
  // Add holographic and energy effects
  prompt += "GLOWING holographic patterns spiral around the dumpling. Particle effects and energy wisps emanate from its surface. ";
  
  // Add ingredient-based sci-fi effects
  const sciFiEffects = getSciFiIngredientEffects(ingredientsList);
  prompt += `${sciFiEffects} `;
  
  // Add timeline-specific futuristic elements
  const timelineEffects = getFuturisticTimelineEffects(timelineTheme);
  prompt += `${timelineEffects} `;
  
  // Add emotional intensity through lighting
  const futuristicLighting = getFuturisticLighting(emotionalContext);
  prompt += `${futuristicLighting} `;
  
  // Final sci-fi styling requirements
  prompt += "STYLE: Ultra-vibrant digital art with MAXIMUM saturation. Cyberpunk aesthetic with neon glow effects, holographic materials, and plasma energy. NO realism whatsoever - pure sci-fi fantasy art. Floating against pure black void (#000000) like a futuristic hologram display. The dumpling should look like alien technology meets food art.";
  
  console.log("Generated FUTURISTIC SCI-FI prompt:", prompt);
  return prompt;
}

function getFuturisticShapeDescription(dumplingShape: string): string {
  switch (dumplingShape.toLowerCase()) {
    case 'round':
      return "The dumpling has a perfect SPHERICAL form with geometric nano-tech pleats that glow with circuit-like patterns.";
    case 'crescent':
      return "The dumpling forms a sleek CRESCENT shape like a futuristic spacecraft with razor-sharp glowing edges.";
    case 'square':
      return "The dumpling has a precise CUBIC geometry with holographic corner joints and digital grid patterns.";
    case 'triangular':
      return "The dumpling forms a sharp TRIANGULAR pyramid with crystalline facets that refract neon light.";
    case 'flower':
      return "The dumpling blooms like a DIGITAL FLOWER with petal-segments that pulse with bioluminescent energy.";
    default:
      return "The dumpling has a futuristic bio-engineered form with glowing geometric pleats and tech-organic curves.";
  }
}

function getSciFiIngredientEffects(ingredientsList: string[]): string {
  const effects: string[] = [];
  
  ingredientsList.forEach(ingredient => {
    const ing = ingredient.toLowerCase();
    
    if (ing.includes('herb') || ing.includes('basil') || ing.includes('cilantro') || ing.includes('parsley')) {
      effects.push("Microscopic green bio-lights pulse through the wrapper like living circuits");
    }
    if (ing.includes('spice') || ing.includes('pepper') || ing.includes('chili')) {
      effects.push("Red plasma energy crackles across the surface with electric spice particles");
    }
    if (ing.includes('chocolate') || ing.includes('cocoa')) {
      effects.push("Dark matter swirls create bronze-purple quantum effects inside the translucent shell");
    }
    if (ing.includes('cheese') || ing.includes('cream')) {
      effects.push("Liquid gold nano-particles flow like molten metal through the dumpling core");
    }
    if (ing.includes('mushroom')) {
      effects.push("Alien spore-lights create purple bioluminescent networks throughout");
    }
    if (ing.includes('seafood') || ing.includes('shrimp') || ing.includes('fish')) {
      effects.push("Ocean-blue quantum waves ripple through the translucent bio-tech wrapper");
    }
    if (ing.includes('vegetable') || ing.includes('carrot') || ing.includes('onion')) {
      effects.push("Rainbow spectrum data-streams flow like digital vegetable DNA");
    }
  });
  
  if (effects.length === 0) {
    effects.push("Multi-colored energy streams flow through the bio-tech wrapper like liquid starlight");
  }
  
  return effects.join('. ') + ".";
}

function getFuturisticTimelineEffects(timelineTheme: string): string {
  const theme = timelineTheme.toLowerCase();
  
  if (theme.includes('future') || theme.includes('distant') || theme.includes('advanced')) {
    return "Advanced nano-technology makes the dumpling surface shimmer with self-assembling molecular patterns. Quantum field effects distort space around it.";
  }
  if (theme.includes('near future') || theme.includes('tomorrow')) {
    return "Cutting-edge bio-engineering creates a dumpling with smart-material wrapper that changes color patterns dynamically.";
  }
  
  return "Futuristic bio-technology creates a dumpling that pulses with alien energy signatures and otherworldly luminescence.";
}

function getFuturisticLighting(emotionalContext: string): string {
  const context = emotionalContext.toLowerCase();
  
  if (context.includes('intense') || context.includes('powerful') || context.includes('strong')) {
    return "EXPLOSIVE neon lighting with high-energy plasma beams shooting from the dumpling in all directions.";
  }
  if (context.includes('gentle') || context.includes('soft') || context.includes('calm')) {
    return "Soft ethereal glow with gentle particle streams and peaceful bioluminescent pulses.";
  }
  if (context.includes('bright') || context.includes('vibrant') || context.includes('energetic')) {
    return "ULTRA-BRIGHT neon explosion with maximum color saturation and electric energy bursts.";
  }
  if (context.includes('warm') || context.includes('cozy') || context.includes('comfort')) {
    return "Warm golden-orange plasma glow with cozy energy wisps and inviting light particles.";
  }
  
  return "Dynamic multi-colored lighting with spectacular holographic effects and radiant energy displays.";
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

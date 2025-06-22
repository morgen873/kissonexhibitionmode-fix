
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
  
  console.log("=== HOLOGRAM DISPLAY FOOD PHOTOGRAPHY PROMPT GENERATION ===");
  console.log("Timeline theme:", `"${timelineTheme}"`);
  console.log("Emotional context:", `"${emotionalContext}"`);
  console.log("Dumpling shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Recipe title:", `"${recipeTitle}"`);
  console.log("Ingredients list:", ingredientsList);
  
  // Generate hologram-ready prompt using the exact structure provided
  const finalPrompt = generateHologramPrompt({
    timelineTheme,
    emotionalContext,
    dumplingShape,
    flavor,
    ingredientsList,
    recipeTitle
  });
  
  console.log("=== FINAL HOLOGRAM DISPLAY PROMPT ===");
  console.log("Prompt length:", finalPrompt.length);
  console.log("Full prompt:", finalPrompt);
  
  return finalPrompt;
}

function generateHologramPrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  // Base hologram prompt structure
  let prompt = "HOLOGRAM DISPLAY FOOD PHOTOGRAPHY: Professional dumpling photograph on SOLID PURE BLACK BACKGROUND (#000000). CRITICAL: The background must be completely black with no textures, patterns, or variations - pure solid black for hologram fan display. The dumpling should be beautifully lit and floating against this pure black void.";
  
  // Add time period styling based on timeline theme
  const timelineStyle = getTimelineStyling(timelineTheme);
  prompt += ` ${timelineStyle}`;
  
  // Add shape description
  const shapeDescription = getShapeDescription(dumplingShape);
  prompt += ` ${shapeDescription}`;
  
  // Add ingredient visual effects
  const ingredientEffects = getIngredientVisualEffects(ingredientsList);
  prompt += ` ${ingredientEffects}`;
  
  // Add intensity lighting based on emotional context
  const lightingIntensity = getIntensityLighting(emotionalContext);
  prompt += ` ${lightingIntensity}`;
  
  // Add mandatory final requirement
  prompt += " MANDATORY: The background must be completely solid black (#000000) with no textures, surfaces, or patterns. The dumpling should appear to float in pure black space, perfect for hologram fan display. Professional food photography with the dumpling as the only visible element against pure black void.";
  
  console.log("Generated HOLOGRAM DISPLAY prompt:", prompt);
  return prompt;
}

function getTimelineStyling(timelineTheme: string): string {
  const theme = timelineTheme.toLowerCase();
  
  if (theme.includes('future') || theme.includes('distant') || theme.includes('advanced')) {
    return "Futuristic style with sleek modern presentation and advanced lighting techniques.";
  }
  if (theme.includes('near future') || theme.includes('tomorrow')) {
    return "Near-future style with contemporary presentation and subtle technological elements.";
  }
  if (theme.includes('ancient') || theme.includes('traditional') || theme.includes('past')) {
    return "Traditional style with classic presentation and timeless plating techniques.";
  }
  if (theme.includes('medieval')) {
    return "Historical style with rustic presentation and traditional craftsmanship.";
  }
  
  return "Contemporary style with modern plating techniques and professional lighting.";
}

function getShapeDescription(dumplingShape: string): string {
  switch (dumplingShape.toLowerCase()) {
    case 'round':
      return "The dumpling has traditional pleated edges with rounded body.";
    case 'crescent':
      return "The dumpling has elegant crescent shape with delicate pleated seams.";
    case 'square':
      return "The dumpling has geometric square form with clean angular edges.";
    case 'triangular':
      return "The dumpling has distinctive triangular shape with precise folded corners.";
    case 'flower':
      return "The dumpling has beautiful flower-like form with petal-shaped pleats.";
    default:
      return "The dumpling has traditional pleated edges with classic form.";
  }
}

function getIngredientVisualEffects(ingredientsList: string[]): string {
  const effects: string[] = [];
  
  ingredientsList.forEach(ingredient => {
    const ing = ingredient.toLowerCase();
    
    if (ing.includes('herb') || ing.includes('basil') || ing.includes('cilantro') || ing.includes('parsley')) {
      effects.push("Fresh herbs visible on the dumpling surface");
    }
    if (ing.includes('spice') || ing.includes('pepper') || ing.includes('chili')) {
      effects.push("Spice elements creating visual texture");
    }
    if (ing.includes('chocolate') || ing.includes('cocoa')) {
      effects.push("Rich chocolate tones and glossy finish");
    }
    if (ing.includes('cheese') || ing.includes('cream')) {
      effects.push("Creamy textures and smooth surfaces");
    }
    if (ing.includes('mushroom')) {
      effects.push("Earthy mushroom elements visible");
    }
    if (ing.includes('seafood') || ing.includes('shrimp') || ing.includes('fish')) {
      effects.push("Delicate seafood textures");
    }
    if (ing.includes('vegetable') || ing.includes('carrot') || ing.includes('onion')) {
      effects.push("Colorful vegetable elements");
    }
  });
  
  if (effects.length === 0) {
    return "Beautiful ingredient textures visible on the dumpling surface.";
  }
  
  return effects.join('. ') + ".";
}

function getIntensityLighting(emotionalContext: string): string {
  const context = emotionalContext.toLowerCase();
  
  if (context.includes('intense') || context.includes('powerful') || context.includes('strong')) {
    return "Dramatic lighting with strong contrasts showcasing the dumpling against pure black background.";
  }
  if (context.includes('gentle') || context.includes('soft') || context.includes('calm')) {
    return "Soft gentle lighting creating subtle shadows against pure black background.";
  }
  if (context.includes('bright') || context.includes('vibrant') || context.includes('energetic')) {
    return "Bright vibrant lighting emphasizing colors against pure black background.";
  }
  if (context.includes('warm') || context.includes('cozy') || context.includes('comfort')) {
    return "Warm lighting creating inviting atmosphere against pure black background.";
  }
  
  return "Balanced lighting showcasing the dumpling against pure black background.";
}

// Re-export the ingredient parser for backward compatibility
export { extractIngredientsList } from './ingredientParser.ts';

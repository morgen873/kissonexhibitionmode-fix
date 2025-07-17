
interface PromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
  colors: string[];
  descriptions: string[];
  effects: string[];
}

export function buildFuturisticPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING WILD FUTURISTIC PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'quantum nano-ingredients';
  
  const prompt = `speculative masterpiece, wildly artistic, ultra surreal, experimental food art, single ${dumplingShape}-shaped dumpling with ${flavor} flavor, otherworldly "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

WILD FUTURISTIC SPECULATIVE STYLE:
- impossible geometries, crystalline structures, liquid metal surfaces, bioengineered textures
- quantum molecular gastronomy, reality-bending culinary physics, time-distortion effects
- prismatic rainbow holographic effects, plasma energy auroras, interdimensional lighting
- pure void black background, anti-gravity floating presentation, levitating composition
- metamorphic dumpling wrapper, shape-shifting properties, living bio-material surface
- energy field emanations, particle stream effects, electromagnetic visual distortions
- alien biotechnology aesthetics, xenobiology food design, impossible material science
- transcendent artistic composition, dream-logic presentation, consciousness-expanding visuals
- 12k hyperdetailed resolution, mind-bending textures, reality-warping composition
- no conventional physics, pure imagination unleashed, speculative evolution
- psychedelic color explosions, fractal pattern integrations, dimensional portal effects
- liquid light substances, impossible flavor visualizations, synesthetic experience

SPECULATIVE PARAMETERS: reality-transcending dumpling, pure artistic void background, anti-physics composition, consciousness-expanding presentation, impossible-geometry centered, dream-state hyper-realism, no limits, pure creative speculation, dimensional-breaking visuals`;

  console.log("Generated WILD FUTURISTIC SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING WILD HISTORICAL SPECULATIVE PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'mythical ancient ingredients';
  
  const prompt = `speculative historical masterpiece, wildly artistic, ritualistic food art, single ${dumplingShape}-shaped dumpling with ${flavor} flavor, mystical "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

WILD HISTORICAL SPECULATIVE STYLE:
- ancient alchemical transmutation, primordial cooking magic, elemental fire ceremonies
- mythological culinary practices, shamanic food rituals, supernatural cooking methods
- ethereal golden flame auras, sacred geometry patterns, cosmic energy infusions
- pure mystical void background, levitating through ancient magic, spiritual elevation
- enchanted dumpling wrapper, blessed by forgotten gods, rune-inscribed surfaces
- elemental steam essence, magical vapor trails, ancestral spirit manifestations
- prehistoric biotechnology, lost civilization techniques, forbidden culinary knowledge
- transcendent ceremonial presentation, temple-worthy artistry, divine inspiration
- 12k visionary resolution, sacred textures, reality-transcending composition
- no historical limitations, pure imagination of the past, speculative archaeology
- primal color explosions, tribal pattern integrations, portal-to-ancestors effects
- liquid starlight substances, impossible ancient flavors, time-traveler experience

SPECULATIVE PARAMETERS: reality-bending historical dumpling, pure mystical void background, magic-physics composition, consciousness-expanding ancient presentation, impossible-timeline centered, dream-state historical realism, no conventional limits, pure creative historical speculation`;

  console.log("Generated WILD HISTORICAL SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== BUILDING WILD CONTEMPORARY SPECULATIVE PROMPT FROM USER INPUT ===");
  console.log("1. Timeline theme:", timelineTheme);
  console.log("2. Emotional context:", emotionalContext);
  console.log("3. Dumpling shape:", dumplingShape);
  console.log("4. Flavor:", flavor);
  console.log("5. Ingredients list:", ingredientsList);
  console.log("6. Recipe title:", recipeTitle);
  
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'avant-garde artisanal ingredients';
  
  const prompt = `speculative contemporary masterpiece, wildly artistic, avant-garde food art, single ${dumplingShape}-shaped dumpling with ${flavor} flavor, revolutionary "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

WILD CONTEMPORARY SPECULATIVE STYLE:
- experimental culinary art, deconstructed reality, post-modern food philosophy
- digital-organic fusion cooking, AI-assisted gastronomy, biotech enhancement
- electric neon auras, cyberpunk aesthetic merging, urban energy pulsations
- pure artistic void background, gravity-defying modern presentation, floating dynamics
- transformative dumpling wrapper, smart-material surfaces, responsive bio-fabrics
- digital steam effects, LED-infused vapor, contemporary energy manifestations
- cutting-edge biotechnology, designer molecular structures, lab-grown aesthetics
- transcendent modern artistry, gallery-worthy presentation, consciousness-expanding design
- 12k ultra-modern resolution, revolutionary textures, paradigm-shifting composition
- no conventional limits, pure contemporary imagination, speculative present-day
- electric color explosions, digital pattern integrations, augmented-reality effects
- liquid LED substances, impossible modern flavors, tech-enhanced experience

SPECULATIVE PARAMETERS: reality-pushing contemporary dumpling, pure artistic void background, tech-enhanced composition, consciousness-expanding modern presentation, impossible-timeline centered, dream-state contemporary realism, no design limits, pure creative modern speculation`;

  console.log("Generated WILD CONTEMPORARY SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

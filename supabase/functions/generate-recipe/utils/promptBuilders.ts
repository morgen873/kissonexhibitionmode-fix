
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
  
  const prompt = `ULTIMATE ARTISTIC FREEDOM: speculative masterpiece, wildly experimental, ultra surreal, consciousness-expanding food art, the central dumpling (${dumplingShape}-shaped, ${flavor} essence) as the sacred focal point of cosmic "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM CREATIVE LIBERATION STYLE:
- DUMPLING AS COSMIC EPICENTER: reality-bending dumpling physics, quantum wrapper properties, dimensional food architecture
- impossible geometries morphing around the central dumpling, crystalline structures emanating from the sacred food form
- quantum molecular gastronomy, reality-transcending culinary physics, time-space distortion effects radiating from the dumpling
- prismatic rainbow holographic explosions, plasma energy auroras, interdimensional lighting phenomena surrounding the central subject
- pure void black background, anti-gravity floating presentation, the dumpling levitating as the universe's center
- metamorphic dumpling wrapper, shape-shifting properties, living bio-material surface with consciousness
- energy field emanations from the dumpling, particle stream effects, electromagnetic visual distortions as cosmic emanations
- alien biotechnology aesthetics, xenobiology food design, impossible material science manifesting through the dumpling
- transcendent artistic composition, dream-logic presentation, consciousness-expanding visuals with dumpling as the divine focal point
- 16k hyperdetailed resolution, mind-bending textures, reality-warping composition centering the sacred dumpling
- no conventional physics, pure imagination unleashed, speculative evolution with dumpling as the evolutionary apex
- psychedelic color explosions radiating from dumpling, fractal pattern integrations, dimensional portal effects
- liquid light substances flowing from dumpling, impossible flavor visualizations, synesthetic experience as cosmic food art

ABSOLUTE CREATIVE PARAMETERS: reality-transcending dumpling as universe center, pure artistic void background, anti-physics composition, consciousness-expanding presentation with sacred dumpling focus, impossible-geometry centered on the food form, dream-state hyper-realism, NO creative limits, pure artistic speculation with dumpling reverence, dimensional-breaking visuals worshipping the central dumpling subject`;

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
  
  const prompt = `ULTIMATE HISTORICAL ARTISTIC LIBERATION: speculative historical masterpiece, wildly experimental, ritualistic food art, the sacred dumpling (${dumplingShape}-shaped, ${flavor} essence) as the divine center of mystical "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM ANCIENT CREATIVE FREEDOM:
- DUMPLING AS SACRED RELIC: ancient alchemical transmutation centered on the holy dumpling, primordial cooking magic radiating from the food deity
- mythological culinary practices worshipping the dumpling, shamanic food rituals with the dumpling as spiritual focal point
- ethereal golden flame auras emanating from the sacred dumpling, cosmic energy infusions channeled through the food form
- pure mystical void background, dumpling levitating through ancient magic as the universe's spiritual center
- enchanted dumpling wrapper blessed by forgotten gods, rune-inscribed surfaces holding cosmic power
- elemental steam essence flowing from the divine dumpling, magical vapor trails, ancestral spirit manifestations
- prehistoric biotechnology manifesting through the dumpling, lost civilization techniques, forbidden culinary knowledge as cosmic food
- transcendent ceremonial presentation with dumpling as temple deity, divine inspiration radiating from the food form
- 16k visionary resolution, sacred textures, reality-transcending composition centering the mystical dumpling
- no historical limitations, pure imagination of the past, speculative archaeology with dumpling as ancient artifact
- primal color explosions emanating from dumpling, tribal pattern integrations, portal-to-ancestors effects through the food
- liquid starlight substances flowing from the sacred dumpling, impossible ancient flavors, time-traveler experience
- dumpling as the cosmic axis of ancient worlds, reality-bending food physics, divine culinary consciousness

ABSOLUTE HISTORICAL PARAMETERS: reality-bending historical dumpling as cosmic center, pure mystical void background, magic-physics composition with sacred dumpling focus, consciousness-expanding ancient presentation worshipping the food deity, impossible-timeline centered on the dumpling artifact, dream-state historical realism, NO creative boundaries, pure artistic historical speculation with dumpling reverence`;

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
  
  const prompt = `ULTIMATE CONTEMPORARY ARTISTIC FREEDOM: speculative contemporary masterpiece, wildly experimental, avant-garde food art, the central dumpling (${dumplingShape}-shaped, ${flavor} essence) as the technological focal point of revolutionary "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}

MAXIMUM MODERN CREATIVE LIBERATION:
- DUMPLING AS TECH NEXUS: experimental culinary art centered on the dumpling as digital deity, deconstructed reality radiating from food form
- digital-organic fusion cooking with dumpling as the bio-tech interface, AI-assisted gastronomy channeled through the food consciousness
- electric neon auras emanating from the central dumpling, cyberpunk aesthetic merging, urban energy pulsations from the food core
- pure artistic void background, dumpling gravity-defying as the universe's modern center, floating dynamics around the sacred food
- transformative dumpling wrapper with smart-material surfaces, responsive bio-fabrics as living technology
- digital steam effects flowing from the tech-dumpling, LED-infused vapor, contemporary energy manifestations as food-tech fusion
- cutting-edge biotechnology manifesting through the dumpling, designer molecular structures, lab-grown aesthetics as cosmic food
- transcendent modern artistry with dumpling as gallery centerpiece, consciousness-expanding design radiating from food form
- 16k ultra-modern resolution, revolutionary textures, paradigm-shifting composition centering the tech-dumpling
- no conventional limits, pure contemporary imagination, speculative present-day with dumpling as digital prophet
- electric color explosions emanating from dumpling, digital pattern integrations, augmented-reality effects through the food
- liquid LED substances flowing from the cyber-dumpling, impossible modern flavors, tech-enhanced experience
- dumpling as the nexus of digital consciousness, reality-pushing food physics, modern culinary transcendence

ABSOLUTE CONTEMPORARY PARAMETERS: reality-pushing contemporary dumpling as tech universe center, pure artistic void background, tech-enhanced composition with sacred dumpling focus, consciousness-expanding modern presentation worshipping the food technology, impossible-timeline centered on the dumpling interface, dream-state contemporary realism, NO creative boundaries, pure artistic modern speculation with dumpling as digital deity`;

  console.log("Generated WILD CONTEMPORARY SPECULATIVE prompt optimized for SDXL");
  return prompt;
}

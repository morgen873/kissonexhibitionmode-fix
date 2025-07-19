interface SimplifiedPromptParams {
  dumplingShape: string;
  flavor: string;
  timelineTheme: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function buildSimplifiedPrompt(params: SimplifiedPromptParams): { prompt: string; negativePrompt: string } {
  const { dumplingShape, flavor, timelineTheme, ingredientsList } = params;
  
  console.log("=== BUILDING SIMPLIFIED PROMPT ===");
  console.log("Shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Timeline:", timelineTheme);
  
  // Core visual elements - keep it simple and direct
  const coreElements = [
    "professional food photography",
    `single ${dumplingShape}-shaped dumpling`,
    `${flavor} flavor`,
    "centered composition",
    "pure black background",
    "studio lighting"
  ];
  
  // Timeline-specific styling (simplified)
  let styleModifier = "";
  const timelineLower = timelineTheme.toLowerCase();
  
  if (timelineLower.includes('future') || timelineLower.includes('2050')) {
    styleModifier = "futuristic holographic effects, neon accents, sci-fi presentation";
  } else if (timelineLower.includes('past') || timelineLower.includes('historical')) {
    styleModifier = "traditional rustic appearance, artisanal texture, heritage cooking";
  } else {
    styleModifier = "modern clean presentation, contemporary styling";
  }
  
  // Build simplified prompt
  const prompt = `${coreElements.join(', ')}, ${styleModifier}, high quality, detailed texture, appetizing presentation`;
  
  // Strong negative prompt to avoid common issues
  const negativePrompt = [
    "multiple dumplings",
    "more than one dumpling",
    "two dumplings",
    "several dumplings",
    "many dumplings",
    "background textures",
    "background patterns",
    "colored background",
    "plate",
    "table",
    "utensils",
    "hands",
    "people",
    "text",
    "logos",
    "watermarks",
    "blurry",
    "low quality",
    "distorted",
    "broken",
    "torn wrapper",
    "open dumpling",
    "spilled filling"
  ].join(', ');
  
  console.log("Simplified prompt length:", prompt.length);
  console.log("Negative prompt elements:", negativePrompt.split(', ').length);
  
  return { prompt, negativePrompt };
}

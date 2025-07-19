interface SimplifiedPromptParams {
  dumplingShape: string;
  flavor: string;
  timelineTheme: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function buildSimplifiedPrompt(params: SimplifiedPromptParams): { prompt: string; negativePrompt: string } {
  const { dumplingShape, flavor, timelineTheme, ingredientsList } = params;
  
  console.log("=== BUILDING ENHANCED SIMPLIFIED PROMPT ===");
  console.log("Shape:", dumplingShape);
  console.log("Flavor:", flavor);
  console.log("Timeline:", timelineTheme);
  
  // Enhanced shape mapping for better AI understanding
  const shapeMapping: { [key: string]: string } = {
    'star': 'five-pointed star',
    'heart': 'heart-shaped',
    'round': 'circular round',
    'square': 'square geometric',
    'triangle': 'triangular geometric',
    'crescent': 'crescent moon-shaped'
  };
  
  const mappedShape = shapeMapping[dumplingShape] || dumplingShape;
  
  // Enhanced flavor descriptions
  const flavorMapping: { [key: string]: string } = {
    'sweet': 'sweet dessert',
    'savory': 'savory meat',
    'spicy': 'spicy hot',
    'mild': 'mild gentle',
    'bitter': 'bitter herb',
    'sour': 'tangy sour'
  };
  
  const mappedFlavor = flavorMapping[flavor] || flavor;
  
  // Core visual elements - more specific and direct
  const coreElements = [
    "ultra-realistic food photography",
    `ONE single ${mappedShape} dumpling`,
    `${mappedFlavor} filling`,
    "perfectly centered",
    "solid black background",
    "professional studio lighting",
    "macro lens detail"
  ];
  
  // Enhanced timeline-specific styling
  let styleModifier = "";
  const timelineLower = timelineTheme.toLowerCase();
  
  if (timelineLower.includes('future') || timelineLower.includes('2050')) {
    styleModifier = "holographic shimmer, subtle neon glow, futuristic packaging, metallic wrapper accents";
  } else if (timelineLower.includes('past') || timelineLower.includes('historical')) {
    styleModifier = "traditional handcrafted texture, rustic appearance, artisanal pleating, heritage styling";
  } else {
    styleModifier = "contemporary clean presentation, modern styling, pristine appearance";
  }
  
  // Build enhanced prompt with emphasis on single dumpling
  const prompt = `${coreElements.join(', ')}, ${styleModifier}, 8K resolution, sharp focus, award-winning photography`;
  
  // Comprehensive negative prompt with emphasis on quantity control
  const negativePrompt = [
    // Quantity control (most important)
    "multiple dumplings", "more than one dumpling", "two dumplings", "three dumplings", 
    "several dumplings", "many dumplings", "group of dumplings", "dumpling collection",
    "dumpling set", "pairs of dumplings", "dozen dumplings", "few dumplings",
    
    // Background control
    "background textures", "background patterns", "colored background", "textured background",
    "wooden background", "marble background", "fabric background", "surface patterns",
    
    // Unwanted objects
    "plate", "bowl", "table", "tablecloth", "utensils", "chopsticks", "fork", "spoon",
    "napkin", "sauce", "condiments", "garnish", "herbs", "vegetables",
    
    // People and hands
    "hands", "fingers", "people", "person", "chef", "cook", "human",
    
    // Text and branding
    "text", "letters", "words", "logos", "watermarks", "signatures", "brands",
    "labels", "writing", "numbers",
    
    // Quality issues
    "blurry", "low quality", "pixelated", "distorted", "broken", "damaged",
    "torn wrapper", "open dumpling", "spilled filling", "messy", "dirty",
    "overcooked", "burnt", "undercooked", "raw dough",
    
    // Shape distortions
    "deformed", "misshapen", "irregular", "asymmetric", "crooked", "bent",
    "flat", "collapsed", "split open", "cracked"
  ].join(', ');
  
  console.log("Enhanced prompt length:", prompt.length);
  console.log("Enhanced negative prompt elements:", negativePrompt.split(', ').length);
  console.log("Shape mapping used:", `${dumplingShape} -> ${mappedShape}`);
  console.log("Flavor mapping used:", `${flavor} -> ${mappedFlavor}`);
  
  return { prompt, negativePrompt };
}

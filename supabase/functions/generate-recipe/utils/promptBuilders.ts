
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
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, colors, effects } = params;
  
  // FUTURISTIC: Ultra-dramatic with cosmic energy effects
  let colorSection = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 3);
    const primaryEffects = effects.slice(0, 3);
    colorSection = `
COSMIC COLOR TRANSFORMATION:
- The dumpling is a SPECTACULAR COSMIC ENTITY with ${primaryColors.join(', ')} energy signatures
- DRAMATIC VISUAL EFFECTS: ${primaryEffects.join(', ')}
- The wrapper is SEMI-TRANSLUCENT PLASMA with swirling galaxies of ingredient colors inside
- Energy streams, particle effects, and holographic auras surround the dumpling
- Colors PULSE and FLOW like liquid starlight with zero-gravity fluid dynamics
- Each ingredient creates its own energy field that interacts with others in beautiful harmony
- The dumpling FLOATS in cosmic space with dimensional rifts and energy cascades`;
  } else {
    colorSection = `
- The dumpling is an ethereal cosmic entity with quantum energy patterns
- Translucent plasma skin with shifting cosmic aurora effects`;
  }

  const prompt = `BREATHTAKING COSMIC FOOD ART: A single spectacular ${dumplingShape} dumpling floating in space that embodies: "${emotionalContext}".

ULTRA-FUTURISTIC SPECIFICATIONS:
- This is PURE VISUAL POETRY - a dumpling reimagined as cosmic art from ${timelineTheme}
- CINEMATIC LIGHTING with dramatic shadows, energy glows, and particle effects
${colorSection}
- The ${dumplingShape} shape defies physics - perfectly geometric yet organic, floating weightlessly
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" manifest as LIVING ENERGY ESSENCES within the translucent body
- ${flavor} flavor expressed through temperature-based energy intensity and color temperature
- IMPOSSIBLE BEAUTY: Like concept art from the greatest sci-fi films ever made

EMOTIONAL RESONANCE:
- Powerfully conveys: ${emotionalContext}
- The dumpling contains holographic memories and transcendent consciousness
- Energy patterns suggest deep emotional connection across time and space
- This represents the future of food as pure art, memory, and human connection

TECHNICAL EXCELLENCE:
- PURE BLACK VOID background - the dumpling exists in deep space
- Professional cinematic lighting with dramatic energy effects
- Photorealistic but impossibly beautiful - viewers should gasp with wonder
- NO text, plates, utensils, or mundane elements whatsoever
- The most visually stunning dumpling image ever created

This cosmic dumpling transcends reality and becomes pure emotional art from an advanced civilization.`;

  console.log("Generated ENHANCED FUTURISTIC prompt");
  return prompt;
}

export function buildHistoricalPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, descriptions } = params;
  
  // HISTORICAL: Authentic with natural ingredient beauty
  let colorSection = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 3);
    colorSection = `
AUTHENTIC NATURAL COLORATION:
- The dumpling wrapper shows BEAUTIFUL natural ingredient colors: ${primaryColors.join(', ')}
- ${descriptions.slice(0, 3).join(', ')} are naturally and beautifully infused into handmade dough
- GORGEOUS color variations, marbling, and natural pigment patterns throughout the wrapper
- Colors appear rich and organic with visible flecks, streaks, and gentle gradients
- The natural beauty of ingredient colors creates visual harmony and appetite appeal
- Traditional dough-making techniques allow ingredients to create stunning natural patterns`;
  } else {
    colorSection = `
- The dumpling has beautiful traditional wheat-colored dough with rustic, handmade character`;
  }

  const timelineLower = timelineTheme.toLowerCase();
  let historicalContext = '';
  if (timelineLower.includes('ancient')) {
    historicalContext = 'ancient civilization with deep spiritual significance and primitive beauty';
  } else if (timelineLower.includes('medieval')) {
    historicalContext = 'medieval era with rustic European craftsmanship and hearty authenticity';
  } else {
    historicalContext = 'historical period with traditional techniques and ancestral wisdom';
  }
  
  const prompt = `STUNNING HISTORICAL FOOD PHOTOGRAPHY: A single magnificent ${dumplingShape} dumpling representing "${recipeTitle}" from ${timelineTheme}.

AUTHENTIC HISTORICAL BEAUTY:
- Crafted as it would have been in ${historicalContext}
- VISUALLY GORGEOUS with traditional craftsmanship and natural beauty
${colorSection}
- Beautiful hand-crafted texture with organic imperfections and traditional pleating techniques
- Ingredients available in ${timelineTheme}: ${ingredientsList.slice(0, 3).join(', ')}
- ${flavor} flavor suggested through warm, natural, period-appropriate color harmony
- Surface shows masterful traditional shaping with visible evidence of skilled human hands

EMOTIONAL DEPTH:
- Powerfully embodies: ${emotionalContext}
- Warm, golden natural lighting that highlights ingredient colors and handmade texture
- Evokes profound nostalgia, human connection, and the beauty of ancestral traditions
- This dumpling carries the emotional weight of generations and cultural memory

VISUAL EXCELLENCE:
- Solid black background for dramatic contrast that highlights the dumpling's natural beauty
- Warm, natural lighting (candlelight/firelight) that makes colors glow beautifully
- ABSOLUTELY DELICIOUS and visually stunning - museum-quality food photography
- No modern elements, text, or artificial additions
- The perfect balance of rustic authenticity and visual beauty

A masterpiece of traditional food craft that honors both history and the natural beauty of ingredients.`;

  console.log("Generated ENHANCED HISTORICAL prompt");
  return prompt;
}

export function buildContemporaryPrompt(params: PromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle, colors, descriptions, effects } = params;
  
  // CONTEMPORARY: Ultra-vibrant artisanal with dramatic color showcase
  let colorSection = '';
  if (colors.length > 0) {
    const primaryColors = colors.slice(0, 3);
    const primaryEffects = effects.slice(0, 3);
    colorSection = `
SPECTACULAR INGREDIENT COLOR SHOWCASE:
- The dumpling wrapper is a MASTERPIECE of color: ${primaryColors.join(', ')}
- DRAMATIC COLOR EFFECTS: ${primaryEffects.join(', ')}
- ${descriptions.slice(0, 3).join(', ')} create STUNNING visual impact in the modern wrapper
- Colors flow and blend in gorgeous gradients, marbling, and artistic patterns
- The wrapper showcases modern culinary color techniques at their finest
- Vibrant, appetizing, and visually spectacular - like edible art
- Natural ingredient pigments create breathtaking visual appeal with contemporary flair`;
  } else {
    colorSection = `
- The dumpling features clean, modern presentation with subtle natural beauty`;
  }

  const prompt = `SPECTACULAR CONTEMPORARY FOOD ART: A single stunning ${dumplingShape} dumpling representing "${recipeTitle}".

MODERN ARTISANAL EXCELLENCE:
- PROFESSIONAL FOOD PHOTOGRAPHY at its absolute finest
- Perfect fusion of traditional craft and contemporary artistic innovation
${colorSection}
- FLAWLESS modern craftsmanship with visible artisanal touches and precision details
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" are beautifully showcased through wrapper colors and visible elements
- ${flavor} flavor profile expressed through gorgeous visual cues and vibrant color harmony
- Modern culinary techniques create unprecedented visual beauty

EMOTIONAL CONNECTION:
- Beautifully embodies: ${emotionalContext}
- PROFESSIONAL STUDIO LIGHTING that makes ingredient colors absolutely radiant
- Perfect balance of tradition, innovation, and pure visual delight
- Ingredient colors create excitement, appetite appeal, and artistic wonder

VISUAL PERFECTION:
- Solid black background for professional food photography excellence
- STUNNING studio lighting that highlights texture and makes colors absolutely glow
- The dumpling looks expertly crafted, modern, and absolutely irresistible
- No props or decorative elements - pure focus on the dumpling's color beauty
- Clean, sophisticated composition with contemporary aesthetic perfection

The ultimate modern dumpling that showcases ingredient colors as pure edible art - absolutely breathtaking.`;

  console.log("Generated ENHANCED CONTEMPORARY prompt");
  return prompt;
}

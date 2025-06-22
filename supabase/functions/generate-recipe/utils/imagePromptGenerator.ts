
interface ImagePromptParams {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

// Color mapping for common ingredients
const ingredientColors: { [key: string]: { color: string; description: string } } = {
  'beetroot': { color: 'deep crimson red', description: 'vibrant red-purple hues' },
  'beet': { color: 'deep crimson red', description: 'vibrant red-purple hues' },
  'carrot': { color: 'bright orange', description: 'warm orange tones' },
  'spinach': { color: 'emerald green', description: 'rich green coloration' },
  'green chili': { color: 'vibrant green', description: 'bright green accents' },
  'chili': { color: 'fiery red', description: 'spicy red coloration' },
  'turmeric': { color: 'golden yellow', description: 'warm golden hues' },
  'saffron': { color: 'golden amber', description: 'luxurious golden tones' },
  'purple cabbage': { color: 'deep purple', description: 'rich purple coloration' },
  'red cabbage': { color: 'deep purple-red', description: 'burgundy-purple tones' },
  'tomato': { color: 'rich red', description: 'vibrant red coloration' },
  'bell pepper': { color: 'bright colored', description: 'colorful pepper tones' },
  'red pepper': { color: 'bright red', description: 'vivid red coloration' },
  'green pepper': { color: 'fresh green', description: 'bright green tones' },
  'yellow pepper': { color: 'sunny yellow', description: 'cheerful yellow hues' },
  'kale': { color: 'dark green', description: 'deep leafy green' },
  'chard': { color: 'rainbow colored', description: 'multicolored stems and leaves' },
  'sweet potato': { color: 'warm orange', description: 'earthy orange tones' },
  'pumpkin': { color: 'rich orange', description: 'autumn orange coloration' },
  'butternut squash': { color: 'golden orange', description: 'warm golden-orange hues' },
  'corn': { color: 'bright yellow', description: 'sunny corn-yellow' },
  'blueberry': { color: 'deep blue-purple', description: 'rich blueberry tones' },
  'blackberry': { color: 'dark purple-black', description: 'deep berry coloration' },
  'cranberry': { color: 'tart red', description: 'bright cranberry red' },
  'mushroom': { color: 'earthy brown', description: 'natural brown tones' },
  'seaweed': { color: 'ocean green', description: 'sea-green coloration' },
  'matcha': { color: 'vibrant green', description: 'ceremonial green tea color' },
  'cocoa': { color: 'rich brown', description: 'deep chocolate tones' },
  'chocolate': { color: 'dark brown', description: 'luxurious chocolate coloration' }
};

function extractIngredientColors(ingredientsList: string[]): { colors: string[]; descriptions: string[] } {
  const colors: string[] = [];
  const descriptions: string[] = [];
  
  console.log("=== INGREDIENT COLOR EXTRACTION ===");
  console.log("Analyzing ingredients for color:", ingredientsList);
  
  ingredientsList.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    console.log(`Checking ingredient: "${ingredient}"`);
    
    // Check for direct matches first
    for (const [key, value] of Object.entries(ingredientColors)) {
      if (lowerIngredient.includes(key)) {
        colors.push(value.color);
        descriptions.push(value.description);
        console.log(`✓ Found color match: ${ingredient} -> ${value.color} (${value.description})`);
        break;
      }
    }
  });
  
  console.log("Final extracted colors:", colors);
  console.log("Final color descriptions:", descriptions);
  
  return { colors, descriptions };
}

export function generateImagePrompt(params: ImagePromptParams): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = params;
  
  console.log("=== IMAGE PROMPT GENERATION DEBUG ===");
  console.log("Timeline theme received:", timelineTheme);
  console.log("Emotional context received:", emotionalContext);
  console.log("Dumpling shape received:", dumplingShape);
  console.log("Flavor received:", flavor);
  console.log("Ingredients list received:", ingredientsList);
  console.log("Recipe title received:", recipeTitle);
  
  // Extract colors from ingredients
  const { colors, descriptions } = extractIngredientColors(ingredientsList);
  
  // Check if timeline contains future-related keywords more comprehensively
  const timelineLower = timelineTheme.toLowerCase();
  const isFuturistic = timelineLower.includes('future') || 
                       timelineLower.includes('distant') || 
                       timelineLower.includes('tomorrow') ||
                       timelineLower.includes('advanced') ||
                       timelineLower.includes('cyber') ||
                       timelineLower.includes('space') ||
                       timelineLower.includes('2050') ||
                       timelineLower.includes('sci-fi') ||
                       timelineLower.includes('tech');

  const isHistorical = timelineLower.includes('ancient') || 
                       timelineLower.includes('past') || 
                       timelineLower.includes('medieval') ||
                       timelineLower.includes('traditional') ||
                       timelineLower.includes('old') ||
                       timelineLower.includes('historic') ||
                       timelineLower.includes('vintage') ||
                       timelineLower.includes('classic');

  console.log("Timeline classification - Futuristic:", isFuturistic, "Historical:", isHistorical);
  console.log("Ingredient colors found:", colors.length, "colors");
  
  if (isFuturistic) {
    // FUTURISTIC: Dramatic color transformation with high-tech interpretation
    let colorSection = '';
    if (colors.length > 0) {
      const primaryColors = colors.slice(0, 3);
      colorSection = `
REVOLUTIONARY COLOR TRANSFORMATION:
- The dumpling wrapper is dramatically transformed by ingredient colors: ${primaryColors.join(', ')}
- These colors appear as GLOWING ENERGY PATTERNS, BIOLUMINESCENT VEINS, or HOLOGRAPHIC SURFACES
- ${descriptions.slice(0, 3).join(', ')} are amplified into otherworldly intensities
- The dumpling skin is semi-translucent, revealing swirling color energies within
- Colors pulse, flow, and shift like living liquid light or neural networks
- Each ingredient color creates a distinct energy field or particle stream`;
    } else {
      colorSection = `
- The dumpling has ethereal, translucent skin with subtle energy patterns
- Colors shift between metallic silvers and quantum blues`;
    }

    const prompt = `ULTRA-FUTURISTIC CONCEPTUAL FOOD ART: A single ${dumplingShape} dumpling that completely transcends traditional food design, embodying the emotions and memories: "${emotionalContext}".

SPECULATIVE DESIGN REQUIREMENTS:
- This dumpling exists in ${timelineTheme} where food is pure art, memory, and technology fused
- The dumpling must be BREATHTAKINGLY beautiful and conceptually mind-blowing
${colorSection}
- The ${dumplingShape} shape is reimagined as a perfect geometric form with impossible physics - floating, defying gravity
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" are visualized as glowing energy essences within the translucent wrapper
- The dumpling appears to hover in space, surrounded by energy fields, particle effects, or dimensional rifts
- ${flavor} flavor is represented through dramatic color temperature and energy intensity

EMOTIONAL TRANSLATION:
- The visual must powerfully convey: ${emotionalContext}
- Dramatic cinematic lighting suggests transcendence, connection across time dimensions
- The dumpling contains actual holographic memories - subtle imagery floating within its translucent body
- This is not food - it's a vessel for human consciousness and emotion from an advanced civilization

TECHNICAL SPECIFICATIONS:
- Pure black void background - the dumpling exists in space-time
- Photorealistic but impossibly beautiful - like concept art from the best sci-fi films
- No text, utensils, plates, or mundane elements
- Professional cinematic lighting with dramatic shadows and energy glows
- The image should make viewers gasp with wonder and question reality

This dumpling is a technological marvel that stores and transmits human memory and emotion across time.`;

    console.log("Generated FUTURISTIC prompt with color transformation");
    return prompt;
  
  } else if (isHistorical) {
    // HISTORICAL: Natural ingredient colors with traditional authenticity
    let colorSection = '';
    if (colors.length > 0) {
      const primaryColors = colors.slice(0, 3);
      colorSection = `
NATURAL INGREDIENT COLORATION:
- The dumpling wrapper shows authentic natural coloring from ingredients: ${primaryColors.join(', ')}
- ${descriptions.slice(0, 3).join(', ')} are naturally infused into the handmade dough
- The wrapper has subtle variations and marbling from natural ingredient pigments
- Colors appear muted and organic, as they would when naturally incorporated into traditional dough
- Visible flecks, streaks, or gentle color gradients from the natural ingredients`;
    } else {
      colorSection = `
- The dumpling has traditional, natural wheat-colored dough with rustic texture`;
    }

    let historicalStyle = '';
    let culturalContext = '';
    
    if (timelineLower.includes('ancient')) {
      historicalStyle = 'ancient, primitive, hand-formed with visible finger marks and imperfections';
      culturalContext = 'crafted by ancient hands with deep spiritual and cultural significance';
    } else if (timelineLower.includes('medieval')) {
      historicalStyle = 'medieval, hearty, rustic European peasant-style';
      culturalContext = 'made in a medieval kitchen using traditional ancestral techniques';
    } else {
      historicalStyle = 'traditional, handmade, historical with authentic period details';
      culturalContext = 'created with ancestral knowledge and deep emotional significance';
    }
    
    const prompt = `AUTHENTIC HISTORICAL FOOD PHOTOGRAPHY: A single ${dumplingShape} dumpling representing "${recipeTitle}" from ${timelineTheme}.

HISTORICAL AUTHENTICITY REQUIREMENTS:
- ${historicalStyle} appearance that authentically reflects the ${timelineTheme} era
- The dumpling looks exactly as it would if ${culturalContext}
${colorSection}
- Visible hand-crafted texture with natural imperfections, uneven edges, rustic pleating
- Available ingredients from ${timelineTheme}: ${ingredientsList.slice(0, 3).join(', ')}
- The ${flavor} flavor is suggested through natural, earthy, period-appropriate color tones
- Surface shows traditional pleating, folding, or shaping techniques from that era

EMOTIONAL RESONANCE:
- The dumpling powerfully embodies: ${emotionalContext}
- Warm, natural lighting suggests human warmth, tradition, and deep ancestral connection
- The texture and appearance evoke profound nostalgia and historical authenticity
- Made with love and carrying the emotional weight of human tradition across generations

VISUAL REQUIREMENTS:
- Solid black background for dramatic historical contrast
- Warm, natural candlelight or firelight that highlights the handmade texture and ingredient colors
- Realistic historical food photography - absolutely delicious and authentic
- No modern elements, text, or artificial additions whatsoever
- The dumpling looks lovingly prepared by skilled traditional craftspeople

This dumpling carries the emotional weight of human tradition and ancestral memory from ${timelineTheme}.`;

    console.log("Generated HISTORICAL prompt with natural ingredient colors");
    return prompt;
  
  } else {
    // CONTEMPORARY: Modern artisanal approach with vibrant ingredient colors
    let colorSection = '';
    if (colors.length > 0) {
      const primaryColors = colors.slice(0, 3);
      colorSection = `
VIBRANT INGREDIENT-INFUSED WRAPPER:
- The dumpling wrapper beautifully showcases ingredient colors: ${primaryColors.join(', ')}
- ${descriptions.slice(0, 3).join(', ')} are artfully incorporated into the modern dumpling skin
- The wrapper has gorgeous color gradients, marbling, or distinct colored sections
- Colors are vibrant and appetizing, showing modern culinary color techniques
- Natural ingredient pigments create stunning visual appeal in the translucent wrapper`;
    } else {
      colorSection = `
- The dumpling has clean, modern presentation with subtle natural coloring`;
    }

    const prompt = `CONTEMPORARY ARTISANAL FOOD PHOTOGRAPHY: A single ${dumplingShape} dumpling representing "${recipeTitle}".

MODERN ARTISANAL REQUIREMENTS:
- Professional, contemporary food presentation with artistic flair
- The dumpling shows modern culinary techniques while honoring tradition
${colorSection}
- Clean, precise craftsmanship with visible artisanal touches
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" are clearly represented through the colored wrapper and visible elements
- ${flavor} flavor profile suggested through appealing visual cues and vibrant ingredient colors
- Modern plating and presentation techniques

EMOTIONAL CONNECTION:
- The dumpling beautifully embodies: ${emotionalContext}
- Professional lighting and presentation evoke modern comfort and culinary sophistication
- Perfect balance of tradition and contemporary innovation
- Ingredient colors create visual excitement and appetite appeal

VISUAL REQUIREMENTS:
- Solid black background for professional food photography
- Professional studio lighting that highlights texture and vibrant ingredient colors
- The dumpling looks expertly crafted, modern, and absolutely delicious
- No props or decorative elements - focus entirely on the dumpling and its colors
- Clean, focused composition with contemporary aesthetic

A perfect modern dumpling that bridges tradition with contemporary culinary artistry, showcasing vibrant ingredient colors in its wrapper.`;

    console.log("Generated CONTEMPORARY prompt with vibrant ingredient colors");
    return prompt;
  }
}

export function extractIngredientsList(ingredients: any): string[] {
  console.log("=== INGREDIENTS EXTRACTION DEBUG ===");
  console.log("Raw ingredients received:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  if (ingredients && typeof ingredients === 'object') {
    Object.values(ingredients).forEach((categoryItems: any) => {
      console.log("Processing category items:", categoryItems);
      if (Array.isArray(categoryItems)) {
        categoryItems.forEach((item: string) => {
          // Clean up the ingredient name - remove quantities and parenthetical info
          const cleanIngredient = item.replace(/^\d+[\s\w]*\s+/, '').split(',')[0].split('(')[0].trim();
          console.log(`Original item: "${item}" -> Cleaned: "${cleanIngredient}"`);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        });
      }
    });
  }
  
  console.log("Final extracted ingredients list:", ingredientsList);
  return ingredientsList;
}


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
  
  console.log("=== IMAGE PROMPT GENERATION DEBUG ===");
  console.log("Timeline theme received:", timelineTheme);
  console.log("Emotional context received:", emotionalContext);
  console.log("Dumpling shape received:", dumplingShape);
  console.log("Flavor received:", flavor);
  console.log("Ingredients list received:", ingredientsList);
  console.log("Recipe title received:", recipeTitle);
  
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
  
  if (isFuturistic) {
    // FUTURISTIC: Conceptual, speculative, mind-blowing design
    const prompt = `ULTRA-FUTURISTIC CONCEPTUAL FOOD ART: A single ${dumplingShape} dumpling that completely transcends traditional food design, embodying the emotions and memories: "${emotionalContext}".

SPECULATIVE DESIGN REQUIREMENTS:
- This dumpling exists in ${timelineTheme} where food is pure art, memory, and technology fused
- The dumpling must be BREATHTAKINGLY beautiful and conceptually mind-blowing
- Incorporate bioluminescent patterns, holographic surfaces, or crystalline structures that pulse with emotion
- The surface has flowing energy patterns, neural network-like veins, or memory fragments visible within the translucent skin
- Colors are otherworldly: electric blues, plasma purples, quantum silvers, neon greens, or energy fields
- The ${dumplingShape} shape is reimagined as a perfect geometric form with impossible physics - floating, defying gravity
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" are visualized as glowing energy essences or particle streams within the dumpling
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

    console.log("Generated FUTURISTIC prompt");
    return prompt;
  
  } else if (isHistorical) {
    // HISTORICAL: Authentic, rustic, traditional with emotional depth
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
- Visible hand-crafted texture with natural imperfections, uneven edges, rustic pleating
- Colors and visible ingredients reflect what was available in ${timelineTheme}: ${ingredientsList.slice(0, 3).join(', ')}
- The ${flavor} flavor is suggested through natural, earthy, period-appropriate color tones
- Surface shows traditional pleating, folding, or shaping techniques from that era
- Ingredients are visible through the dough - herbs, grains, or vegetables appropriate to the time period

EMOTIONAL RESONANCE:
- The dumpling powerfully embodies: ${emotionalContext}
- Warm, natural lighting suggests human warmth, tradition, and deep ancestral connection
- The texture and appearance evoke profound nostalgia and historical authenticity
- Made with love and carrying the emotional weight of human tradition across generations

VISUAL REQUIREMENTS:
- Solid black background for dramatic historical contrast
- Warm, natural candlelight or firelight that highlights the handmade texture
- Realistic historical food photography - absolutely delicious and authentic
- No modern elements, text, or artificial additions whatsoever
- The dumpling looks lovingly prepared by skilled traditional craftspeople

This dumpling carries the emotional weight of human tradition and ancestral memory from ${timelineTheme}.`;

    console.log("Generated HISTORICAL prompt");
    return prompt;
  
  } else {
    // CONTEMPORARY: Modern artisanal approach with strong ingredient focus
    const prompt = `CONTEMPORARY ARTISANAL FOOD PHOTOGRAPHY: A single ${dumplingShape} dumpling representing "${recipeTitle}".

MODERN ARTISANAL REQUIREMENTS:
- Professional, contemporary food presentation with artistic flair
- The dumpling shows modern culinary techniques while honoring tradition
- Clean, precise craftsmanship with visible artisanal touches
- Key ingredients "${ingredientsList.slice(0, 3).join(', ')}" are clearly represented through natural colors, textures, and visible elements in the dough
- ${flavor} flavor profile suggested through appealing visual cues and ingredient visibility
- Modern plating and presentation techniques

EMOTIONAL CONNECTION:
- The dumpling beautifully embodies: ${emotionalContext}
- Professional lighting and presentation evoke modern comfort and culinary sophistication
- Perfect balance of tradition and contemporary innovation
- Ingredients shine through with modern clarity and appeal

VISUAL REQUIREMENTS:
- Solid black background for professional food photography
- Professional studio lighting that highlights texture and ingredients
- The dumpling looks expertly crafted, modern, and absolutely delicious
- No props or decorative elements - focus entirely on the dumpling
- Clean, focused composition with contemporary aesthetic

A perfect modern dumpling that bridges tradition with contemporary culinary artistry, clearly showcasing its key ingredients.`;

    console.log("Generated CONTEMPORARY prompt");
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

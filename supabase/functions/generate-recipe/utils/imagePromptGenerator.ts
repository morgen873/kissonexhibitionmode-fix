
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
  
  if (timelineTheme.toLowerCase().includes('future') || timelineTheme.toLowerCase().includes('distant')) {
    // FUTURISTIC: Conceptual, speculative, mind-blowing design
    return `Ultra-futuristic conceptual food art: a single ${dumplingShape} dumpling that transcends traditional food design, embodying the memories and emotions: "${emotionalContext}".

SPECULATIVE DESIGN CONCEPT:
- This dumpling exists in ${timelineTheme} where food is art, memory, and technology combined
- The dumpling should be BREATHTAKINGLY beautiful and conceptually stunning
- Incorporate bioluminescent, holographic, or crystalline elements that pulse with emotion
- The surface might have flowing light patterns, neural network-like veins, or memory fragments visible within
- Colors should be otherworldly: electric blues, plasma purples, quantum silvers, or energy greens
- The ${dumplingShape} shape is reimagined as a perfect geometric form with impossible physics
- Ingredients like "${ingredientsList.slice(0, 3).join(', ')}" are visualized as glowing essences or energy patterns
- The dumpling appears to float or defy gravity, surrounded by particle effects or energy fields

EMOTIONAL TRANSLATION:
- The visual should make viewers feel the profound emotions: ${emotionalContext}
- Use dramatic lighting that suggests transcendence, connection across time, or emotional depth
- The dumpling should look like it contains actual memories - perhaps with subtle holographic imagery within
- ${flavor} flavor is represented through color temperature and energy intensity

TECHNICAL REQUIREMENTS:
- Pure black void background - the dumpling exists in space-time
- Photorealistic but impossibly beautiful - like concept art from the best sci-fi films
- No text, utensils, or mundane elements
- Professional cinematic lighting with dramatic shadows and highlights
- The image should make people gasp with wonder and want to experience this impossible food

This is not just food - it's a vessel for human memory and emotion, designed by advanced civilization.`;
  
  } else if (timelineTheme.toLowerCase().includes('ancient') || timelineTheme.toLowerCase().includes('past') || timelineTheme.toLowerCase().includes('medieval')) {
    // HISTORICAL: Authentic, rustic, traditional with emotional depth
    let historicalStyle = '';
    let culturalContext = '';
    
    if (timelineTheme.toLowerCase().includes('ancient')) {
      historicalStyle = 'ancient, primitive, clay-fired appearance';
      culturalContext = 'made by ancient hands with deep spiritual significance';
    } else if (timelineTheme.toLowerCase().includes('medieval')) {
      historicalStyle = 'medieval, hearty, rustic European';
      culturalContext = 'crafted in a medieval kitchen with traditional techniques';
    } else {
      historicalStyle = 'traditional, handmade, historical';
      culturalContext = 'made with ancestral knowledge and emotional care';
    }
    
    return `Authentic historical food photography: a single ${dumplingShape} dumpling representing "${recipeTitle}" from ${timelineTheme}.

HISTORICAL AUTHENTICITY:
- ${historicalStyle} appearance that reflects the ${timelineTheme} era
- The dumpling looks ${culturalContext}
- Visible hand-crafted texture with natural imperfections that show human touch
- Colors and ingredients reflect what was available in ${timelineTheme}: ${ingredientsList.slice(0, 3).join(', ')}
- The ${flavor} flavor is suggested through natural, earthy color tones
- Surface shows traditional pleating, folding, or shaping techniques

EMOTIONAL RESONANCE:
- The dumpling embodies the emotions: ${emotionalContext}
- Lighting suggests warmth, tradition, and deep human connection
- The texture and appearance should evoke nostalgia and authenticity
- Made with love and carrying the weight of human tradition

VISUAL REQUIREMENTS:
- Solid black background for dramatic contrast
- Warm, natural lighting that highlights the handmade texture
- Realistic food photography that makes it look absolutely delicious
- No modern elements, text, or artificial additions
- The dumpling should look like it was lovingly prepared by skilled traditional hands

This dumpling carries the emotional weight of human tradition and ancestral memory.`;
  
  } else {
    // CONTEMPORARY: Modern artisanal approach
    return `Contemporary artisanal food photography: a single ${dumplingShape} dumpling representing "${recipeTitle}".

MODERN ARTISANAL STYLE:
- Professional, contemporary food presentation
- The dumpling shows modern culinary techniques while honoring tradition
- Clean, precise craftsmanship with artistic flair
- Ingredients ${ingredientsList.slice(0, 3).join(', ')} are represented through natural colors and textures
- ${flavor} flavor profile suggested through appealing visual cues

EMOTIONAL CONNECTION:
- The dumpling embodies: ${emotionalContext}
- Lighting and presentation evoke modern comfort and sophistication
- Perfect balance of tradition and innovation

REQUIREMENTS:
- Solid black background
- Professional food photography lighting
- The dumpling looks expertly crafted and delicious
- No props or decorative elements
- Clean, focused composition

A perfect dumpling that bridges tradition with contemporary culinary artistry.`;
  }
}

export function extractIngredientsList(ingredients: any): string[] {
  const ingredientsList: string[] = [];
  if (ingredients && typeof ingredients === 'object') {
    Object.values(ingredients).forEach((categoryItems: any) => {
      if (Array.isArray(categoryItems)) {
        categoryItems.forEach((item: string) => {
          const cleanIngredient = item.replace(/^\d+[\s\w]*\s+/, '').split(',')[0].split('(')[0].trim();
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        });
      }
    });
  }
  return ingredientsList;
}

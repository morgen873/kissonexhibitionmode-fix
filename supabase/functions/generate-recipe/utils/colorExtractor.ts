
// Enhanced color mapping for more dramatic visual effects
const ingredientColors: { [key: string]: { color: string; description: string; effect: string } } = {
  'beetroot': { color: 'deep crimson red', description: 'vibrant red-purple hues', effect: 'flowing crimson energy streams' },
  'beet': { color: 'deep crimson red', description: 'vibrant red-purple hues', effect: 'flowing crimson energy streams' },
  'carrot': { color: 'bright orange', description: 'warm orange tones', effect: 'golden orange flame patterns' },
  'spinach': { color: 'emerald green', description: 'rich green coloration', effect: 'emerald green energy veins' },
  'green chili': { color: 'vibrant green', description: 'bright green accents', effect: 'electric green lightning effects' },
  'chili': { color: 'fiery red', description: 'spicy red coloration', effect: 'fiery red plasma streams' },
  'turmeric': { color: 'golden yellow', description: 'warm golden hues', effect: 'liquid gold flowing patterns' },
  'saffron': { color: 'golden amber', description: 'luxurious golden tones', effect: 'amber light emanations' },
  'purple cabbage': { color: 'deep purple', description: 'rich purple coloration', effect: 'royal purple energy waves' },
  'red cabbage': { color: 'deep purple-red', description: 'burgundy-purple tones', effect: 'burgundy crystal formations' },
  'tomato': { color: 'rich red', description: 'vibrant red coloration', effect: 'ruby red liquid effects' },
  'bell pepper': { color: 'bright colored', description: 'colorful pepper tones', effect: 'rainbow energy cascades' },
  'red pepper': { color: 'bright red', description: 'vivid red coloration', effect: 'scarlet flame tongues' },
  'green pepper': { color: 'fresh green', description: 'bright green tones', effect: 'jade green aura' },
  'yellow pepper': { color: 'sunny yellow', description: 'cheerful yellow hues', effect: 'solar yellow radiation' },
  'kale': { color: 'dark green', description: 'deep leafy green', effect: 'forest green energy spirals' },
  'chard': { color: 'rainbow colored', description: 'multicolored stems and leaves', effect: 'prismatic light refractions' },
  'sweet potato': { color: 'warm orange', description: 'earthy orange tones', effect: 'sunset orange gradients' },
  'pumpkin': { color: 'rich orange', description: 'autumn orange coloration', effect: 'harvest orange glow' },
  'butternut squash': { color: 'golden orange', description: 'warm golden-orange hues', effect: 'molten gold streams' },
  'corn': { color: 'bright yellow', description: 'sunny corn-yellow', effect: 'sunburst yellow rays' },
  'blueberry': { color: 'deep blue-purple', description: 'rich blueberry tones', effect: 'sapphire blue energy orbs' },
  'blackberry': { color: 'dark purple-black', description: 'deep berry coloration', effect: 'obsidian purple shadows' },
  'cranberry': { color: 'tart red', description: 'bright cranberry red', effect: 'ruby crystal formations' },
  'mushroom': { color: 'earthy brown', description: 'natural brown tones', effect: 'earth-tone energy patterns' },
  'seaweed': { color: 'ocean green', description: 'sea-green coloration', effect: 'oceanic teal waves' },
  'matcha': { color: 'vibrant green', description: 'ceremonial green tea color', effect: 'zen green energy flow' },
  'cocoa': { color: 'rich brown', description: 'deep chocolate tones', effect: 'chocolate bronze swirls' },
  'chocolate': { color: 'dark brown', description: 'luxurious chocolate coloration', effect: 'dark bronze liquid metal' }
};

export function extractIngredientColors(ingredientsList: string[]): { 
  colors: string[]; 
  descriptions: string[]; 
  effects: string[] 
} {
  const colors: string[] = [];
  const descriptions: string[] = [];
  const effects: string[] = [];
  
  console.log("=== ENHANCED INGREDIENT COLOR EXTRACTION ===");
  console.log("Analyzing ingredients for dramatic color effects:", ingredientsList);
  
  ingredientsList.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    console.log(`Checking ingredient: "${ingredient}"`);
    
    // Check for direct matches first
    for (const [key, value] of Object.entries(ingredientColors)) {
      if (lowerIngredient.includes(key)) {
        colors.push(value.color);
        descriptions.push(value.description);
        effects.push(value.effect);
        console.log(`✓ Found enhanced color match: ${ingredient} -> ${value.color} (${value.effect})`);
        break;
      }
    }
  });
  
  console.log("Final extracted colors:", colors);
  console.log("Final color effects:", effects);
  
  return { colors, descriptions, effects };
}

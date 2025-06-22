
// Enhanced color mapping for more direct color specification
const ingredientColors: { [key: string]: { color: string; description: string; effect: string } } = {
  'beetroot': { color: 'bright magenta', description: 'vibrant magenta coloration', effect: 'magenta glow' },
  'beet': { color: 'bright magenta', description: 'vibrant magenta coloration', effect: 'magenta glow' },
  'carrot': { color: 'electric orange', description: 'bright orange coloration', effect: 'orange glow' },
  'spinach': { color: 'electric green', description: 'vibrant green coloration', effect: 'green glow' },
  'green chili': { color: 'lime green', description: 'bright green coloration', effect: 'green energy' },
  'chili': { color: 'fire red', description: 'bright red coloration', effect: 'red glow' },
  'turmeric': { color: 'electric yellow', description: 'bright yellow coloration', effect: 'golden glow' },
  'saffron': { color: 'golden yellow', description: 'golden coloration', effect: 'golden energy' },
  'purple cabbage': { color: 'electric purple', description: 'vibrant purple coloration', effect: 'purple glow' },
  'red cabbage': { color: 'bright purple', description: 'purple-red coloration', effect: 'purple energy' },
  'tomato': { color: 'bright red', description: 'vivid red coloration', effect: 'red energy' },
  'bell pepper': { color: 'rainbow', description: 'multicolored', effect: 'rainbow energy' },
  'red pepper': { color: 'fire red', description: 'bright red coloration', effect: 'red energy' },
  'green pepper': { color: 'lime green', description: 'bright green coloration', effect: 'green energy' },
  'yellow pepper': { color: 'electric yellow', description: 'bright yellow coloration', effect: 'yellow energy' },
  'orange': { color: 'electric orange', description: 'bright orange coloration', effect: 'orange energy' },
  'orange zest': { color: 'electric orange', description: 'bright orange coloration', effect: 'orange energy' },
  'kale': { color: 'forest green', description: 'deep green coloration', effect: 'green energy' },
  'chard': { color: 'rainbow', description: 'multicolored', effect: 'rainbow energy' },
  'sweet potato': { color: 'burnt orange', description: 'orange coloration', effect: 'orange energy' },
  'pumpkin': { color: 'bright orange', description: 'orange coloration', effect: 'orange energy' },
  'corn': { color: 'golden yellow', description: 'yellow coloration', effect: 'yellow energy' },
  'blueberry': { color: 'electric blue', description: 'bright blue coloration', effect: 'blue energy' },
  'blackberry': { color: 'deep purple', description: 'purple coloration', effect: 'purple energy' },
  'cranberry': { color: 'crimson red', description: 'red coloration', effect: 'red energy' },
  'matcha': { color: 'electric green', description: 'bright green coloration', effect: 'green energy' },
  'cocoa': { color: 'rich brown', description: 'brown coloration', effect: 'brown energy' },
  'chocolate': { color: 'dark brown', description: 'brown coloration', effect: 'brown energy' },
  // Add more vibrant interpretations
  'black': { color: 'deep black', description: 'black coloration', effect: 'black energy' },
  'white': { color: 'pure white', description: 'white coloration', effect: 'white glow' },
  'pink': { color: 'hot pink', description: 'pink coloration', effect: 'pink energy' },
  'blue': { color: 'electric blue', description: 'blue coloration', effect: 'blue glow' },
  'violet': { color: 'electric violet', description: 'violet coloration', effect: 'violet energy' },
  'indigo': { color: 'deep indigo', description: 'indigo coloration', effect: 'indigo energy' }
};

export function extractIngredientColors(ingredientsList: string[]): { 
  colors: string[]; 
  descriptions: string[]; 
  effects: string[] 
} {
  const colors: string[] = [];
  const descriptions: string[] = [];
  const effects: string[] = [];
  
  console.log("=== FIXED COLOR EXTRACTION FOR BEETROOT ===");
  console.log("Analyzing ingredients for colors:", ingredientsList);
  
  // DIRECT CHECK: If we have beetroot, add it immediately
  const hasBeetroot = ingredientsList.some(ingredient => 
    ingredient.toLowerCase().includes('beetroot') || 
    ingredient.toLowerCase().includes('beet')
  );
  
  if (hasBeetroot) {
    console.log("🎯 BEETROOT DETECTED - Adding bright magenta color!");
    colors.push('bright magenta');
    descriptions.push('vibrant magenta coloration from beetroot');
    effects.push('magenta glow');
  }
  
  // Then check for other ingredients
  ingredientsList.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    console.log(`Checking ingredient: "${ingredient}"`);
    
    // Skip beetroot since we already handled it above
    if (lowerIngredient.includes('beetroot') || lowerIngredient.includes('beet')) {
      return;
    }
    
    // Check for other matches
    for (const [key, value] of Object.entries(ingredientColors)) {
      if (lowerIngredient.includes(key)) {
        colors.push(value.color);
        descriptions.push(value.description);
        effects.push(value.effect);
        console.log(`✓ Color match: ${ingredient} -> ${value.color}`);
        break;
      }
    }
  });
  
  // If still no colors found, add default vibrant colors
  if (colors.length === 0) {
    console.log("❌ NO COLORS FOUND - adding default vibrant colors!");
    colors.push('rainbow', 'electric blue', 'bright pink');
    descriptions.push('rainbow coloration', 'blue coloration', 'pink coloration');
    effects.push('rainbow energy', 'blue glow', 'pink energy');
    console.log("Added default vibrant colors:", colors);
  }
  
  console.log("Final colors extracted:", colors);
  console.log("Total colors found:", colors.length);
  
  return { colors, descriptions, effects };
}

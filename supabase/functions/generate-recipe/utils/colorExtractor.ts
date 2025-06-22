
// Enhanced color mapping for more direct color specification
const ingredientColors: { [key: string]: { color: string; description: string; effect: string } } = {
  'beetroot': { color: 'deep red', description: 'crimson red coloration', effect: 'red energy' },
  'beet': { color: 'deep red', description: 'crimson red coloration', effect: 'red energy' },
  'carrot': { color: 'bright orange', description: 'orange coloration', effect: 'orange glow' },
  'spinach': { color: 'emerald green', description: 'green coloration', effect: 'green energy' },
  'green chili': { color: 'bright green', description: 'green coloration', effect: 'green energy' },
  'chili': { color: 'red', description: 'red coloration', effect: 'red energy' },
  'turmeric': { color: 'golden yellow', description: 'yellow coloration', effect: 'golden glow' },
  'saffron': { color: 'golden yellow', description: 'golden coloration', effect: 'golden energy' },
  'purple cabbage': { color: 'deep purple', description: 'purple coloration', effect: 'purple energy' },
  'red cabbage': { color: 'purple-red', description: 'purple-red coloration', effect: 'purple energy' },
  'tomato': { color: 'red', description: 'red coloration', effect: 'red energy' },
  'bell pepper': { color: 'colorful', description: 'multicolored', effect: 'rainbow energy' },
  'red pepper': { color: 'red', description: 'red coloration', effect: 'red energy' },
  'green pepper': { color: 'green', description: 'green coloration', effect: 'green energy' },
  'yellow pepper': { color: 'yellow', description: 'yellow coloration', effect: 'yellow energy' },
  'orange': { color: 'bright orange', description: 'orange coloration', effect: 'orange energy' },
  'orange zest': { color: 'bright orange', description: 'orange coloration', effect: 'orange energy' },
  'kale': { color: 'dark green', description: 'green coloration', effect: 'green energy' },
  'chard': { color: 'multicolored', description: 'rainbow coloration', effect: 'rainbow energy' },
  'sweet potato': { color: 'orange', description: 'orange coloration', effect: 'orange energy' },
  'pumpkin': { color: 'orange', description: 'orange coloration', effect: 'orange energy' },
  'corn': { color: 'yellow', description: 'yellow coloration', effect: 'yellow energy' },
  'blueberry': { color: 'blue-purple', description: 'blue-purple coloration', effect: 'blue energy' },
  'blackberry': { color: 'dark purple', description: 'purple coloration', effect: 'purple energy' },
  'cranberry': { color: 'red', description: 'red coloration', effect: 'red energy' },
  'matcha': { color: 'bright green', description: 'green coloration', effect: 'green energy' },
  'cocoa': { color: 'brown', description: 'brown coloration', effect: 'brown energy' },
  'chocolate': { color: 'dark brown', description: 'brown coloration', effect: 'brown energy' }
};

export function extractIngredientColors(ingredientsList: string[]): { 
  colors: string[]; 
  descriptions: string[]; 
  effects: string[] 
} {
  const colors: string[] = [];
  const descriptions: string[] = [];
  const effects: string[] = [];
  
  console.log("=== SIMPLIFIED COLOR EXTRACTION ===");
  console.log("Analyzing ingredients for direct colors:", ingredientsList);
  
  ingredientsList.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    console.log(`Checking ingredient: "${ingredient}"`);
    
    // Check for direct matches first
    for (const [key, value] of Object.entries(ingredientColors)) {
      if (lowerIngredient.includes(key)) {
        colors.push(value.color);
        descriptions.push(value.description);
        effects.push(value.effect);
        console.log(`✓ DIRECT color match: ${ingredient} -> ${value.color}`);
        break;
      }
    }
  });
  
  // If no colors found, add a default but log it
  if (colors.length === 0) {
    console.log("❌ NO COLORS FOUND - this is the problem!");
    console.log("Available ingredients:", ingredientsList);
    console.log("Color mapping keys:", Object.keys(ingredientColors));
  }
  
  console.log("Final extracted colors:", colors);
  console.log("Colors found:", colors.length > 0 ? "✅" : "❌");
  
  return { colors, descriptions, effects };
}

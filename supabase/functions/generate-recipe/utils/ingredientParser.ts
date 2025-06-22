
export function extractIngredientsList(ingredients: any): string[] {
  console.log("=== INGREDIENTS EXTRACTION FROM SAVED RECIPE ===");
  console.log("Raw saved recipe ingredients received:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
    // Handle different possible structures of saved ingredients
    if (Array.isArray(ingredients)) {
      // If ingredients is directly an array
      ingredients.forEach((item: any) => {
        if (typeof item === 'string') {
          const cleanIngredient = cleanIngredientName(item);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    } else {
      // If ingredients is an object with categories
      Object.values(ingredients).forEach((categoryItems: any) => {
        console.log("Processing saved recipe category items:", categoryItems);
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach((item: any) => {
            const itemStr = typeof item === 'string' ? item : String(item);
            const cleanIngredient = cleanIngredientName(itemStr);
            console.log(`Original saved item: "${itemStr}" -> Cleaned: "${cleanIngredient}"`);
            if (cleanIngredient.length > 2) {
              ingredientsList.push(cleanIngredient);
            }
          });
        } else if (typeof categoryItems === 'string') {
          const cleanIngredient = cleanIngredientName(categoryItems);
          if (cleanIngredient.length > 2) {
            ingredientsList.push(cleanIngredient);
          }
        }
      });
    }
  }
  
  console.log("Final extracted ingredients list from saved recipe:", ingredientsList);
  return ingredientsList;
}

function cleanIngredientName(item: string): string {
  // Clean up the ingredient name - remove quantities, measurements, and parenthetical info
  return item
    .replace(/^\d+[\s\w]*\s+/, '') // Remove leading numbers and measurements
    .split(',')[0] // Take only the first part before comma
    .split('(')[0] // Remove parenthetical info
    .trim()
    .toLowerCase();
}

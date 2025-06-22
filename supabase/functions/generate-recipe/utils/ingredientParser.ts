
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

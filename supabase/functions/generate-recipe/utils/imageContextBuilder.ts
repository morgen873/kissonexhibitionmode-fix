
interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

interface SavedRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: any;
  cooking_recipe: string;
  recipe_data: any;
}

export interface ImageContext {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export function buildImageContext(
  payload: RecipePayload,
  savedRecipe: SavedRecipe
): ImageContext {
  console.log("📋 BUILDING IMAGE CONTEXT...");
  
  // Step 1: Extract timeline theme
  const timelineValues = Object.values(payload.timeline);
  const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
  console.log("🕐 TIMELINE EXTRACTION:");
  console.log("- Raw timeline values:", timelineValues);
  console.log("- Selected timeline theme:", `"${timelineTheme}"`);
  
  // Step 2: Extract other context
  const questionValues = Object.values(payload.questions);
  const fullEmotionalContext = questionValues.join(' and ');
  
  const controlValues = Object.values(payload.controls)[0] || {
    shape: 'round',
    flavor: 'savory',
    temperature: 200,
    enhancer: 'none'
  };
  
  // Step 3: Extract ingredients
  const ingredientsList = extractIngredientsFromSavedRecipe(savedRecipe.ingredients);
  
  const imageContext: ImageContext = {
    timelineTheme,
    emotionalContext: fullEmotionalContext,
    dumplingShape: controlValues.shape,
    flavor: controlValues.flavor,
    ingredientsList,
    recipeTitle: savedRecipe.title
  };
  
  console.log("📋 IMAGE CONTEXT CREATED:");
  console.log(JSON.stringify(imageContext, null, 2));
  
  return imageContext;
}

function extractIngredientsFromSavedRecipe(ingredients: any): string[] {
  console.log("🔍 EXTRACTING INGREDIENTS FROM:", JSON.stringify(ingredients, null, 2));
  
  const ingredientsList: string[] = [];
  
  if (ingredients && typeof ingredients === 'object') {
    if (Array.isArray(ingredients)) {
      ingredients.forEach((item: any) => {
        if (typeof item === 'string') {
          const cleaned = cleanIngredientName(item);
          if (cleaned.length > 2) {
            ingredientsList.push(cleaned);
          }
        }
      });
    } else {
      Object.entries(ingredients).forEach(([key, categoryItems]: [string, any]) => {
        if (Array.isArray(categoryItems)) {
          categoryItems.forEach((item: any) => {
            const itemStr = typeof item === 'string' ? item : String(item);
            const cleaned = cleanIngredientName(itemStr);
            if (cleaned.length > 2) {
              ingredientsList.push(cleaned);
            }
          });
        } else if (typeof categoryItems === 'string') {
          const cleaned = cleanIngredientName(categoryItems);
          if (cleaned.length > 2) {
            ingredientsList.push(cleaned);
          }
        }
      });
    }
  }
  
  console.log("✅ FINAL INGREDIENTS LIST:", ingredientsList);
  return ingredientsList;
}

function cleanIngredientName(item: string): string {
  return item
    .replace(/^\d+[\s\w]*\s+/, '')
    .split(',')[0]
    .split('(')[0]
    .trim()
    .toLowerCase();
}

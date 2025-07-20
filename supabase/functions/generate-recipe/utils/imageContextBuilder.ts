interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: string]: any };
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
  // Extract timeline theme
  const timelineTheme = Object.values(payload.timeline || {})[0] || 'Present';
  
  // Extract emotional context from questions
  const emotionalContext = Object.values(payload.questions || {}).join(' and ');
  
  // Extract control values
  const controlValues = Object.values(payload.controls || {})[0] || {};
  
  // Extract ingredients list from saved recipe
  const ingredientsList: string[] = [];
  if (savedRecipe.ingredients && typeof savedRecipe.ingredients === 'object') {
    for (const category of Object.values(savedRecipe.ingredients)) {
      if (Array.isArray(category)) {
        for (const ingredient of category) {
          if (typeof ingredient === 'string') {
            // Clean up ingredient string (remove measurements, keep just the ingredient name)
            const cleanIngredient = ingredient
              .replace(/^\d+(\.\d+)?\s*(cups?|tablespoons?|teaspoons?|lbs?|pounds?|ounces?|oz|grams?|g)\s*/i, '')
              .replace(/^(a|an|the)\s+/i, '')
              .trim();
            if (cleanIngredient) {
              ingredientsList.push(cleanIngredient);
            }
          }
        }
      }
    }
  }
  
  const imageContext: ImageContext = {
    timelineTheme,
    emotionalContext,
    dumplingShape: controlValues.shape || 'round',
    flavor: controlValues.flavor || 'balanced',
    ingredientsList,
    recipeTitle: savedRecipe.title
  };
  
  return imageContext;
}


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
  console.log("🔍 FULL PAYLOAD DEBUG:");
  console.log("- Complete payload:", JSON.stringify(payload, null, 2));
  
  // Step 1: Extract timeline theme with enhanced debugging
  const timelineValues = Object.values(payload.timeline);
  const timelineKeys = Object.keys(payload.timeline);
  const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
  
  console.log("🕐 ENHANCED TIMELINE EXTRACTION:");
  console.log("- Timeline object keys:", timelineKeys);
  console.log("- Timeline object values:", timelineValues);
  console.log("- Full timeline object:", JSON.stringify(payload.timeline, null, 2));
  console.log("- Selected timeline theme:", `"${timelineTheme}"`);
  console.log("- Timeline theme type:", typeof timelineTheme);
  console.log("- Timeline theme length:", timelineTheme.length);
  
  // Step 2: Extract other context with enhanced debugging
  const questionValues = Object.values(payload.questions);
  const fullEmotionalContext = questionValues.join(' and ');
  
  console.log("❓ QUESTIONS EXTRACTION:");
  console.log("- Question keys:", Object.keys(payload.questions));
  console.log("- Question values:", questionValues);
  console.log("- Combined emotional context:", `"${fullEmotionalContext}"`);
  
  const controlValues = Object.values(payload.controls)[0] || {
    shape: 'round',
    flavor: 'savory',
    temperature: 200,
    enhancer: 'none'
  };
  
  console.log("🎛️ CONTROLS EXTRACTION:");
  console.log("- Control keys:", Object.keys(payload.controls));
  console.log("- Control values:", JSON.stringify(controlValues, null, 2));
  
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
  
  console.log("📋 FINAL IMAGE CONTEXT CREATED:");
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

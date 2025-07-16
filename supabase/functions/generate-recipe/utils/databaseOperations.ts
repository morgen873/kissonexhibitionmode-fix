
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RecipeData {
  title: string;
  description: string;
  ingredients: any;
  cooking_recipe: string;
}

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export async function insertRecipe(
  supabaseAdmin: ReturnType<typeof createClient>,
  payload: RecipePayload,
  recipeContent: RecipeData
) {
  console.log("=== INSERTING COMPLETE RECIPE INTO DATABASE ===");
  console.log("Recipe content being saved:");
  console.log("- Title:", recipeContent.title);
  console.log("- Has ingredients:", !!recipeContent.ingredients);
  console.log("- Has description:", !!recipeContent.description);
  console.log("- Has cooking recipe:", !!recipeContent.cooking_recipe);
  
  const { data: newRecipe, error: insertError } = await supabaseAdmin
    .from('recipes')
    .insert({
      recipe_data: payload,
      title: recipeContent.title,
      description: recipeContent.description,
      ingredients: recipeContent.ingredients,
      cooking_recipe: recipeContent.cooking_recipe,
      image_url: '/placeholder.svg',
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting recipe:', insertError);
    throw insertError;
  }

  if (!newRecipe) {
    throw new Error("Failed to create and retrieve recipe.");
  }

  console.log("✅ Recipe COMPLETELY saved to database:");
  console.log("- Recipe ID:", newRecipe.id);
  console.log("- Title:", newRecipe.title);
  console.log("- Ingredients saved:", !!newRecipe.ingredients);
  console.log("- Full recipe data available for image generation");
  
  return newRecipe;
}

export async function updateRecipeImageUrl(
  supabaseAdmin: ReturnType<typeof createClient>,
  recipeId: string,
  imageUrl: string
) {
  console.log("=== UPDATING RECIPE WITH FINAL IMAGE URL ===");
  console.log("Recipe ID:", recipeId);
  console.log("Image URL:", imageUrl);
  
  const { error: updateError } = await supabaseAdmin
    .from('recipes')
    .update({ image_url: imageUrl })
    .eq('id', recipeId);

  if (updateError) {
    console.error('Error updating recipe with image URL:', updateError);
    throw updateError;
  }

  console.log("✅ Recipe successfully updated with final image URL");
}

export async function updateRecipeWithImagePrompt(
  supabaseAdmin: ReturnType<typeof createClient>,
  recipeId: string,
  imagePrompt: string
) {
  console.log("=== UPDATING RECIPE WITH IMAGE PROMPT ===");
  console.log("Recipe ID:", recipeId);
  console.log("Image prompt length:", imagePrompt.length);
  
  // First get current recipe_data
  const { data: currentRecipe, error: fetchError } = await supabaseAdmin
    .from('recipes')
    .select('recipe_data')
    .eq('id', recipeId)
    .single();

  if (fetchError) {
    console.error('Error fetching current recipe data:', fetchError);
    throw fetchError;
  }

  // Update recipe_data with image prompt
  const updatedRecipeData = {
    ...currentRecipe.recipe_data,
    imagePrompt: imagePrompt
  };

  const { error: updateError } = await supabaseAdmin
    .from('recipes')
    .update({ recipe_data: updatedRecipeData })
    .eq('id', recipeId);

  if (updateError) {
    console.error('Error updating recipe with image prompt:', updateError);
    throw updateError;
  }

  console.log("✅ Recipe successfully updated with image prompt");
}

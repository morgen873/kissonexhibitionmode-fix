
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
  console.log("Inserting recipe into database...");
  
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

  console.log("Recipe inserted with ID:", newRecipe.id);
  return newRecipe;
}

export async function updateRecipeImageUrl(
  supabaseAdmin: ReturnType<typeof createClient>,
  recipeId: string,
  imageUrl: string
) {
  console.log("Updating recipe with image URL...");
  
  const { error: updateError } = await supabaseAdmin
    .from('recipes')
    .update({ image_url: imageUrl })
    .eq('id', recipeId);

  if (updateError) {
    console.error('Error updating recipe with image URL:', updateError);
    throw updateError;
  }

  console.log("Recipe updated successfully with image URL");
}


import { RecipeResult } from '@/types/creation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useRecipeSave = () => {
    const saveRecipe = async (recipe: RecipeResult) => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                toast.error('Please sign in to save recipes');
                return;
            }

            // Check if recipe already exists in user's saved recipes
            const { data: existingRecipe, error: checkError } = await supabase
                .from('user_saved_recipes')
                .select('id')
                .eq('user_id', user.id)
                .eq('recipe_name', recipe.name)
                .maybeSingle();

            if (checkError) {
                console.error('Error checking existing recipe:', checkError);
                toast.error('Failed to check existing recipes');
                return;
            }

            if (existingRecipe) {
                toast.info('Recipe already saved to your collection');
                return;
            }

            // Save recipe to user's collection
            const { error: saveError } = await supabase
                .from('user_saved_recipes')
                .insert({
                    user_id: user.id,
                    recipe_name: recipe.name,
                    recipe_image_url: recipe.imageUrl,
                    qr_data: recipe.qrData
                });

            if (saveError) {
                console.error('Error saving recipe:', saveError);
                toast.error('Failed to save recipe');
                return;
            }

            toast.success('Recipe saved to your collection!');
        } catch (error) {
            console.error('Error saving recipe:', error);
            toast.error('Failed to save recipe');
        }
    };

    return { saveRecipe };
};

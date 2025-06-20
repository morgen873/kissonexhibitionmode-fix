
import { RecipeResult } from '@/types/creation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useRecipeSave = () => {
    const saveRecipe = async (recipe: RecipeResult) => {
        try {
            // Save recipe without requiring user authentication
            const { error: saveError } = await supabase
                .from('recipes')
                .insert({
                    title: recipe.name,
                    image_url: recipe.imageUrl,
                    recipe_data: {
                        name: recipe.name,
                        imageUrl: recipe.imageUrl,
                        qrData: recipe.qrData
                    }
                });

            if (saveError) {
                console.error('Error saving recipe:', saveError);
                toast.error('Failed to save recipe');
                return;
            }

            toast.success('Recipe saved successfully!');
        } catch (error) {
            console.error('Error saving recipe:', error);
            toast.error('Failed to save recipe');
        }
    };

    return { saveRecipe };
};

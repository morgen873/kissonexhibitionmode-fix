
import { RecipeResult } from '@/types/creation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useRecipeEmail = () => {
    const emailRecipe = async (recipe: RecipeResult) => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user?.email) {
                toast.error('Please sign in to email recipes');
                return;
            }

            // Call edge function to send email
            const { error } = await supabase.functions.invoke('send-recipe-email', {
                body: {
                    recipeName: recipe.name,
                    recipeImageUrl: recipe.imageUrl,
                    qrData: recipe.qrData,
                    userEmail: user.email
                }
            });

            if (error) {
                console.error('Error sending email:', error);
                toast.error('Failed to send recipe via email');
                return;
            }

            toast.success('Recipe sent to your email!');
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send recipe via email');
        }
    };

    return { emailRecipe };
};

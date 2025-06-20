
import { RecipeResult } from '@/types/creation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useRecipeEmail = () => {
    const emailRecipe = async (recipe: RecipeResult, userEmail?: string) => {
        try {
            // Prompt user for email if not provided
            let email = userEmail;
            if (!email) {
                email = prompt('Please enter your email address to receive the recipe:');
                if (!email) {
                    toast.error('Email address is required');
                    return;
                }
                
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    toast.error('Please enter a valid email address');
                    return;
                }
            }

            // Call edge function to send email
            const { error } = await supabase.functions.invoke('send-recipe-email', {
                body: {
                    recipeName: recipe.name,
                    recipeImageUrl: recipe.imageUrl,
                    qrData: recipe.qrData,
                    userEmail: email
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

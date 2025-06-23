import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IngredientsList from '@/components/recipe/IngredientsList';
import GlobalLayout from '@/components/layout/GlobalLayout';
import { testImageAccess } from '@/utils/imageDebug';

type Recipe = Database['public']['Tables']['recipes']['Row'];

const RecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) {
                setError("No recipe ID provided.");
                setLoading(false);
                return;
            }

            console.log("Fetching recipe with ID:", id);

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError("Could not fetch recipe. It might not exist or you may not have permission to view it.");
                console.error("Recipe fetch error:", error);
            } else {
                setRecipe(data);
                console.log('Recipe fetched successfully:', data);
                console.log('Recipe image URL from database:', data?.image_url);
                
                // Test image access if we have an image URL
                if (data?.image_url && data.image_url !== '/placeholder.svg') {
                    testImageAccess(data.image_url);
                }
            }
            setLoading(false);
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <GlobalLayout variant="recipe">
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="h-16 w-16 animate-spin" />
                </div>
            </GlobalLayout>
        );
    }

    if (error || !recipe) {
        return (
            <GlobalLayout variant="recipe">
                <div className="flex justify-center items-center h-screen">
                    <p className="responsive-text">{error || "Recipe not found."}</p>
                </div>
            </GlobalLayout>
        );
    }

    // Simple image URL logic - use what's in the database or fallback to placeholder
    const imageUrl = recipe.image_url || '/placeholder.svg';
    const isPlaceholder = !recipe.image_url || recipe.image_url === '/placeholder.svg';

    console.log('Image URL decision:');
    console.log('- Database image_url:', recipe.image_url);
    console.log('- Final image URL to use:', imageUrl);
    console.log('- Is placeholder:', isPlaceholder);

    return (
        <GlobalLayout variant="recipe">
            <div className="responsive-padding">
                <Card className="responsive-container-sm responsive-card-dark">
                    <CardHeader>
                        <CardTitle className="responsive-heading-lg text-center text-white drop-shadow-lg">
                            {recipe.title}
                        </CardTitle>
                        <div className="flex justify-center mt-4">
                            <div className="relative w-full max-w-xs">
                                <img 
                                    src={imageUrl}
                                    alt={recipe.title} 
                                    className="responsive-image shadow-lg"
                                    onLoad={() => {
                                        console.log('✅ Image loaded successfully:', imageUrl);
                                    }}
                                    onError={(e) => {
                                        console.log('❌ Image failed to load:', imageUrl);
                                        console.log('❌ Error details:', e);
                                        // Only fall back if we're not already using placeholder
                                        if (e.currentTarget.src !== '/placeholder.svg') {
                                            console.log('🔄 Falling back to placeholder');
                                            e.currentTarget.src = '/placeholder.svg';
                                        }
                                    }}
                                />
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                                    {isPlaceholder ? 'Placeholder' : 'Generated'}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 mt-3">
                        <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-white/20 pb-2 text-white">Description</h3>
                            <p className="text-white/80 mt-3 responsive-text-sm">{recipe.description}</p>
                        </div>
                         <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-white/20 pb-2 text-white">Ingredients</h3>
                            <IngredientsList ingredients={recipe.ingredients} />
                        </div>
                        <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-white/20 pb-2 text-white">Cooking Instructions</h3>
                            <pre className="text-white/80 bg-black/20 p-3 rounded-md whitespace-pre-wrap font-sans mt-3 responsive-text-sm">{recipe.cooking_recipe}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </GlobalLayout>
    );
};

export default RecipePage;

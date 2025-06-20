
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IngredientsList from '@/components/recipe/IngredientsList';

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
            }
            setLoading(false);
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
                <p>{error || "Recipe not found."}</p>
            </div>
        );
    }

    // Check if we have a valid generated image URL
    const hasValidImage = recipe.image_url && 
                         recipe.image_url !== '/placeholder.svg' && 
                         recipe.image_url.trim() !== '';

    const imageUrl = hasValidImage ? recipe.image_url : '/placeholder.svg';

    console.log('Image display decision:');
    console.log('- Recipe image URL:', recipe.image_url);
    console.log('- Has valid image:', hasValidImage);
    console.log('- Final image URL:', imageUrl);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-8">
            <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-lg">{recipe.title}</CardTitle>
                    <div className="flex justify-center mt-6">
                        <div className="relative w-full max-w-md">
                            <img 
                                src={imageUrl}
                                alt={recipe.title} 
                                className="rounded-lg w-full h-auto max-h-96 object-cover shadow-lg"
                                onLoad={() => {
                                    console.log('Image loaded successfully:', imageUrl);
                                }}
                                onError={(e) => {
                                    console.log('Image failed to load:', imageUrl);
                                    // If it's not already the placeholder, fall back to it
                                    if (e.currentTarget.src !== '/placeholder.svg') {
                                        console.log('Falling back to placeholder');
                                        e.currentTarget.src = '/placeholder.svg';
                                    }
                                }}
                            />
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                                {hasValidImage ? 'Generated' : 'Placeholder'}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 mt-4">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2 text-white">Description</h3>
                        <p className="text-white/80 mt-4">{recipe.description}</p>
                    </div>
                     <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2 text-white">Ingredients</h3>
                        <IngredientsList ingredients={recipe.ingredients} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2 text-white">Cooking Instructions</h3>
                        <pre className="text-white/80 bg-black/20 p-4 rounded-md whitespace-pre-wrap font-sans mt-4">{recipe.cooking_recipe}</pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipePage;

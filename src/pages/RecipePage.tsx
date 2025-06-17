
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IngredientsList from '@/components/recipe/IngredientsList';

type Recipe = Database['public']['Tables']['recipes']['Row'];

const RecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Get image URL from query parameter as fallback
    const imageFromUrl = searchParams.get('img');

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) {
                setError("No recipe ID provided.");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError("Could not fetch recipe. It might not exist or you may not have permission to view it.");
                console.error(error);
            } else {
                setRecipe(data);
                console.log('Recipe image_url:', data?.image_url);
                console.log('Image from URL parameter:', imageFromUrl);
            }
            setLoading(false);
        };

        fetchRecipe();
    }, [id, imageFromUrl]);

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
        console.error('Failed to load recipe image');
    };

    // Use image from database first, then fall back to URL parameter
    const imageUrl = recipe?.image_url || imageFromUrl;
    const shouldShowImage = imageUrl && imageUrl.trim() !== '' && imageUrl !== '/placeholder.svg' && imageUrl !== 'placeholder.svg';

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-8">
            <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-lg">{recipe.title}</CardTitle>
                    {shouldShowImage && (
                        <div className="flex justify-center mt-6">
                            {imageLoading && (
                                <div className="flex items-center justify-center w-full max-w-md h-96 bg-black/20 rounded-lg">
                                    <Loader2 className="h-8 w-8 animate-spin text-white/60" />
                                </div>
                            )}
                            <img 
                                src={imageError ? '/placeholder.svg' : imageUrl} 
                                alt={recipe.title} 
                                className={`rounded-lg w-full h-auto max-h-96 max-w-md object-cover shadow-lg ${imageLoading ? 'hidden' : 'block'}`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-8 mt-4">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2">Description</h3>
                        <p className="text-white/80 mt-4">{recipe.description}</p>
                    </div>
                     <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2">Ingredients</h3>
                        <IngredientsList ingredients={recipe.ingredients} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2">Cooking Instructions</h3>
                        <pre className="text-white/80 bg-black/20 p-4 rounded-md whitespace-pre-wrap font-sans mt-4">{recipe.cooking_recipe}</pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipePage;

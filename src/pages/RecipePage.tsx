
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-8">
            <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-lg">{recipe.title}</CardTitle>
                    {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="rounded-lg mt-6 w-full h-auto max-h-96 object-cover" />}
                </CardHeader>
                <CardContent className="space-y-8 mt-4">
                    <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2">Description</h3>
                        <p className="text-white/80 mt-4">{recipe.description}</p>
                    </div>
                     <div>
                        <h3 className="text-2xl font-semibold mb-2 border-b-2 border-white/20 pb-2">Ingredients</h3>
                        <pre className="text-white/80 bg-black/20 p-4 rounded-md whitespace-pre-wrap font-sans mt-4">{JSON.stringify(recipe.ingredients, null, 2)}</pre>
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

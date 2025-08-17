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
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            </GlobalLayout>
        );
    }

    if (error || !recipe) {
        return (
            <GlobalLayout variant="recipe">
                <div className="flex justify-center items-center h-screen">
                    <p className="responsive-text text-primary">{error || "Recipe not found."}</p>
                </div>
            </GlobalLayout>
        );
    }

    // Simple image URL logic - use what's in the database or fallback to placeholder
    const imageUrl = recipe.image_url || '/placeholder.svg';

    console.log('Image URL decision:');
    console.log('- Database image_url:', recipe.image_url);
    console.log('- Final image URL to use:', imageUrl);

    return (
        <GlobalLayout variant="recipe">
            <div className="responsive-padding">
                <Card className="responsive-container-sm bg-card shadow-lg rounded-lg">
                    <CardHeader>
                        <CardTitle className="responsive-heading-lg text-center text-primary drop-shadow-lg">
                            {recipe.title}
                        </CardTitle>
                        <div className="flex justify-center mt-4">
                            <div className="relative w-full max-w-xs">
                                <img 
                                    src={imageUrl}
                                    alt={recipe.title} 
                                    className="responsive-image shadow-lg rounded-lg"
                                    onLoad={() => {
                                        console.log('✅ Image loaded successfully:', imageUrl);
                                    }}
                                    onError={(e) => {
                                        console.log('❌ Image failed to load:', imageUrl);
                                        console.log('❌ Error details:', e);
                                        if (e.currentTarget.src !== '/placeholder.svg') {
                                            console.log('🔄 Falling back to placeholder');
                                            e.currentTarget.src = '/placeholder.svg';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 mt-3">
                        <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-border pb-2 text-primary">Description</h3>
                            <p className="text-muted-foreground mt-3 responsive-text-sm">{recipe.description}</p>
                        </div>
                        
                        {/* Recipe Story Section */}
                        {recipe.recipe_data && typeof recipe.recipe_data === 'object' && (
                            <div>
                                <h3 className="responsive-heading-md mb-2 border-b-2 border-border pb-2 text-primary">Your Recipe Story</h3>
                                <div className="bg-primary/5 p-4 rounded-lg mt-3 space-y-3">
                                    {(() => {
                                        const recipeData = recipe.recipe_data as any;
                                        const questions = recipeData?.questions;
                                        const questionTitles = recipeData?.questionTitles;
                                        const timeline = recipeData?.timeline;
                                        
                                        return (
                                            <>
                                                {questions && Object.entries(questions).map(([key, answer]) => {
                                                    const questionTitle = questionTitles?.[key];
                                                    return questionTitle ? (
                                                        <div key={key} className="border-l-2 border-primary/20 pl-3">
                                                            <p className="responsive-text-sm font-medium text-primary/80">{String(questionTitle)}</p>
                                                            <p className="responsive-text-sm text-muted-foreground italic">"{String(answer)}"</p>
                                                        </div>
                                                    ) : null;
                                                })}
                                                {timeline && Object.values(timeline).map((time, index) => (
                                                    <div key={index} className="border-l-2 border-primary/20 pl-3">
                                                        <p className="responsive-text-sm font-medium text-primary/80">Timeline</p>
                                                        <p className="responsive-text-sm text-muted-foreground italic">"{String(time)}"</p>
                                                    </div>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                        
                         <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-border pb-2 text-primary">Ingredients</h3>
                            <IngredientsList ingredients={recipe.ingredients} />
                        </div>
                        <div>
                            <h3 className="responsive-heading-md mb-2 border-b-2 border-border pb-2 text-primary">Cooking Instructions</h3>
                            <div className="text-muted-foreground bg-muted/30 p-4 rounded-lg mt-3 responsive-text-sm leading-relaxed">
                                {recipe.cooking_recipe
                                    ?.replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
                                    ?.replace(/\\"/g, '"') // Replace escaped quotes
                                    ?.replace(/\\n/g, '\n') // Convert literal \n to actual newlines
                                    ?.replace(/\\\\/g, '\\') // Replace double backslashes
                                    ?.replace(/^"(\d+)\./g, '$1.') // Remove quotes around step numbers
                                    ?.split('\n')
                                    .filter(step => step.trim()) // Remove empty lines
                                    .map((step, index) => (
                                        <div key={index} className="mb-3 last:mb-0">
                                            {step.trim()}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </GlobalLayout>
    );
};

export default RecipePage;

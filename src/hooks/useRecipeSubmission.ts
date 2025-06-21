
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { steps } from '@/data/creation';
import { QuestionStep, RecipeResult } from '@/types/creation';

export const useRecipeSubmission = () => {
    const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
    const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

    const handleSubmit = async (
        answers: { [key: number]: string },
        customAnswers: { [key: number]: string },
        controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }
    ) => {
        setIsCreatingRecipe(true);
        const questionAnswers: { [key:string]: string } = {};
        const timelineAnswers: { [key: string]: string } = {};

        Object.entries(answers).forEach(([stepId, answer]) => {
            const step = steps.find(s => 'id' in s && s.id === Number(stepId));
            if (step) {
                if (step.type === 'question') {
                    const questionStep = step as QuestionStep;
                    if (questionStep.customOption && answer === questionStep.customOption.title) {
                        questionAnswers[stepId] = customAnswers[Number(stepId)] || '';
                    } else {
                        questionAnswers[stepId] = answer;
                    }
                } else if (step.type === 'timeline') {
                    timelineAnswers[stepId] = answer;
                }
            }
        });

        const finalPayload = {
            questions: questionAnswers,
            timeline: timelineAnswers,
            controls: controlValues,
        };

        console.log("Final payload:", finalPayload);
        
        try {
            const { data, error } = await supabase.functions.invoke('generate-recipe', {
                body: finalPayload,
            });

            if (error) {
                throw error;
            }

            const newRecipe = data.recipe;

            if (!newRecipe) {
                throw new Error("Recipe generation failed. The function did not return a recipe.");
            }

            console.log("Recipe received:", newRecipe);
            console.log("Recipe image URL:", newRecipe.image_url);

            // Create simple QR data with just the recipe URL
            const recipeUrl = `${window.location.origin}/recipe/${newRecipe.id}`;

            setRecipeResult({
                name: newRecipe.title,
                imageUrl: newRecipe.image_url || "/placeholder.svg",
                qrData: recipeUrl
            });

        } catch (error) {
            console.error('Error creating recipe:', error);
            // In a real app, you'd show a user-facing error here.
        } finally {
            setIsCreatingRecipe(false);
        }
    };

    const resetRecipe = () => {
        setRecipeResult(null);
        setIsCreatingRecipe(false);
    };

    return {
        recipeResult,
        isCreatingRecipe,
        handleSubmit,
        resetRecipe
    };
};


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

        // Process answers with better debugging
        console.log("Processing answers:", answers);
        console.log("Processing custom answers:", customAnswers);
        console.log("Processing control values:", controlValues);

        Object.entries(answers).forEach(([stepId, answer]) => {
            const step = steps.find(s => 'id' in s && s.id === Number(stepId));
            console.log(`Step ${stepId}:`, step, "Answer:", answer);
            
            if (step) {
                if (step.type === 'question') {
                    const questionStep = step as QuestionStep;
                    if (questionStep.customOption && answer === questionStep.customOption.title) {
                        const customAnswer = customAnswers[Number(stepId)];
                        questionAnswers[stepId] = customAnswer || '';
                        console.log(`Using custom answer for step ${stepId}:`, customAnswer);
                    } else {
                        questionAnswers[stepId] = answer;
                        console.log(`Using regular answer for step ${stepId}:`, answer);
                    }
                } else if (step.type === 'timeline') {
                    timelineAnswers[stepId] = answer;
                    console.log(`Timeline answer for step ${stepId}:`, answer);
                }
            }
        });

        // Ensure we have all the required data before submitting
        const hasQuestionAnswers = Object.keys(questionAnswers).length > 0;
        const hasTimelineAnswers = Object.keys(timelineAnswers).length > 0;
        const hasControlValues = Object.keys(controlValues).length > 0;

        console.log("Data validation:");
        console.log("- Has question answers:", hasQuestionAnswers, questionAnswers);
        console.log("- Has timeline answers:", hasTimelineAnswers, timelineAnswers);
        console.log("- Has control values:", hasControlValues, controlValues);

        if (!hasQuestionAnswers) {
            console.error("Missing question answers!");
        }
        if (!hasTimelineAnswers) {
            console.error("Missing timeline answers!");
        }
        if (!hasControlValues) {
            console.error("Missing control values!");
        }

        const finalPayload = {
            questions: questionAnswers,
            timeline: timelineAnswers,
            controls: controlValues,
        };

        console.log("Final payload being sent:", JSON.stringify(finalPayload, null, 2));
        
        try {
            const { data, error } = await supabase.functions.invoke('generate-recipe', {
                body: finalPayload,
            });

            if (error) {
                console.error("Supabase function error:", error);
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


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

        console.log("=== FRONTEND DATA PROCESSING DEBUG ===");
        console.log("Raw answers received:", answers);
        console.log("Raw custom answers received:", customAnswers);
        console.log("Raw control values received:", controlValues);

        // Process answers with enhanced debugging
        Object.entries(answers).forEach(([stepId, answer]) => {
            const step = steps.find(s => 'id' in s && s.id === Number(stepId));
            console.log(`Processing step ${stepId}:`, step?.type, "Answer:", `"${answer}"`);
            
            if (step) {
                if (step.type === 'question') {
                    const questionStep = step as QuestionStep;
                    if (questionStep.customOption && answer === questionStep.customOption.title) {
                        const customAnswer = customAnswers[Number(stepId)];
                        questionAnswers[stepId] = customAnswer || '';
                        console.log(`✓ Using custom answer for question step ${stepId}:`, `"${customAnswer}"`);
                    } else {
                        questionAnswers[stepId] = answer;
                        console.log(`✓ Using regular answer for question step ${stepId}:`, `"${answer}"`);
                    }
                } else if (step.type === 'timeline') {
                    timelineAnswers[stepId] = answer;
                    console.log(`✓ Timeline answer for step ${stepId}:`, `"${answer}"`);
                }
            } else {
                console.warn(`⚠️ No step found for stepId ${stepId}`);
            }
        });

        // Enhanced validation with specific feedback
        const hasQuestionAnswers = Object.keys(questionAnswers).length > 0;
        const hasTimelineAnswers = Object.keys(timelineAnswers).length > 0;
        const hasControlValues = Object.keys(controlValues).length > 0;

        console.log("=== DATA VALIDATION RESULTS ===");
        console.log("✓ Question answers:", hasQuestionAnswers ? "PRESENT" : "MISSING");
        console.log("  Question answers object:", questionAnswers);
        console.log("✓ Timeline answers:", hasTimelineAnswers ? "PRESENT" : "MISSING");
        console.log("  Timeline answers object:", timelineAnswers);
        console.log("✓ Control values:", hasControlValues ? "PRESENT" : "MISSING");
        console.log("  Control values object:", controlValues);

        if (!hasQuestionAnswers) {
            console.error("❌ Missing question answers!");
        }
        if (!hasTimelineAnswers) {
            console.error("❌ Missing timeline answers!");
        }
        if (!hasControlValues) {
            console.error("❌ Missing control values!");
        }

        const finalPayload = {
            questions: questionAnswers,
            timeline: timelineAnswers,
            controls: controlValues,
        };

        console.log("=== FINAL PAYLOAD TO BACKEND ===");
        console.log(JSON.stringify(finalPayload, null, 2));
        console.log("================================");
        
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

            console.log("=== RECIPE GENERATION COMPLETE ===");
            console.log("Recipe received:", newRecipe.title);
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

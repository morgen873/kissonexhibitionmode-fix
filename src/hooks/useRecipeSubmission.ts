
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

        console.log("=== 🔍 FRONTEND COMPREHENSIVE DATA TRACING ===");
        console.log("📊 RAW INPUT DATA:");
        console.log("- Raw answers object:", JSON.stringify(answers, null, 2));
        console.log("- Raw custom answers object:", JSON.stringify(customAnswers, null, 2));
        console.log("- Raw control values object:", JSON.stringify(controlValues, null, 2));

        // Process answers with enhanced debugging
        Object.entries(answers).forEach(([stepId, answer]) => {
            const step = steps.find(s => 'id' in s && s.id === Number(stepId));
            console.log(`🔍 Processing step ${stepId}:`);
            console.log(`- Step type:`, step?.type);
            console.log(`- Step data:`, step);
            console.log(`- Answer value:`, `"${answer}"`);
            
            if (step) {
                if (step.type === 'question') {
                    const questionStep = step as QuestionStep;
                    if (questionStep.customOption && answer === questionStep.customOption.title) {
                        const customAnswer = customAnswers[Number(stepId)];
                        questionAnswers[stepId] = customAnswer || '';
                        console.log(`✅ Using custom answer for question step ${stepId}:`, `"${customAnswer}"`);
                    } else {
                        questionAnswers[stepId] = answer;
                        console.log(`✅ Using regular answer for question step ${stepId}:`, `"${answer}"`);
                    }
                } else if (step.type === 'timeline') {
                    timelineAnswers[stepId] = answer;
                    console.log(`✅ Timeline answer for step ${stepId}:`, `"${answer}"`);
                    console.log(`🚨 TIMELINE THEME DETECTED:`, `"${answer}"`);
                    
                    // Check if this is futuristic
                    const isFuturistic = answer.toLowerCase().includes('future') || 
                                       answer.toLowerCase().includes('distant') ||
                                       answer.toLowerCase().includes('advanced') ||
                                       answer.toLowerCase().includes('tomorrow');
                    console.log(`🔮 Is futuristic timeline:`, isFuturistic);
                }
            } else {
                console.warn(`⚠️ No step found for stepId ${stepId}`);
            }
        });

        // Enhanced validation with specific feedback
        const hasQuestionAnswers = Object.keys(questionAnswers).length > 0;
        const hasTimelineAnswers = Object.keys(timelineAnswers).length > 0;
        const hasControlValues = Object.keys(controlValues).length > 0;

        console.log("=== 📊 FRONTEND DATA VALIDATION ===");
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

        console.log("=== 📤 FINAL PAYLOAD BEING SENT TO BACKEND ===");
        console.log("🎯 Payload size:", JSON.stringify(finalPayload).length, "characters");
        console.log("🎯 Full payload structure:");
        console.log(JSON.stringify(finalPayload, null, 2));
        
        // Special focus on timeline data
        console.log("🔍 TIMELINE DATA ANALYSIS:");
        Object.entries(finalPayload.timeline).forEach(([key, value]) => {
            console.log(`- Timeline key ${key}: "${value}"`);
            console.log(`- Value type:`, typeof value);
            console.log(`- Value length:`, value.length);
        });
        
        try {
            console.log("🚀 Calling Supabase function 'generate-recipe'...");
            console.log("⏱️ Request timestamp:", new Date().toISOString());
            
            const { data, error } = await supabase.functions.invoke('generate-recipe', {
                body: finalPayload,
            });

            console.log("📥 Supabase function response received");
            console.log("- Response data:", data);
            console.log("- Response error:", error);

            if (error) {
                console.error("❌ Supabase function error:", error);
                throw error;
            }

            const newRecipe = data.recipe;

            if (!newRecipe) {
                throw new Error("Recipe generation failed. The function did not return a recipe.");
            }

            console.log("=== ✅ RECIPE GENERATION COMPLETE ===");
            console.log("📋 Recipe received:");
            console.log("- Title:", newRecipe.title);
            console.log("- Description:", newRecipe.description);
            console.log("- Image URL:", newRecipe.image_url);
            console.log("- Recipe ID:", newRecipe.id);
            console.log("- Full recipe object:", newRecipe);

            // Create simple QR data with just the recipe URL
            const recipeUrl = `${window.location.origin}/recipe/${newRecipe.id}`;

            setRecipeResult({
                name: newRecipe.title,
                imageUrl: newRecipe.image_url || "/placeholder.svg",
                qrData: recipeUrl
            });

        } catch (error) {
            console.error('❌ Error creating recipe:', error);
            console.error('🔍 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
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


import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { steps } from '@/data/creation';
import { ControlsStep, QuestionStep, RecipeResult } from '@/types/creation';

export const useCreationForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
    const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});
    const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
    const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

    const currentStepData = steps[currentStep];

    useEffect(() => {
        if (currentStepData.type === 'controls' && !controlValues[currentStepData.id]) {
            const { controls } = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    temperature: controls.temperature.defaultValue,
                    shape: controls.shape.defaultValue,
                    flavor: controls.flavor.defaultValue,
                    enhancer: '',
                }
            }));
        }
    }, [currentStep, currentStepData, controlValues]);

    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question' || step.type === 'timeline') {
            setAnswers({ ...answers, [step.id]: optionTitle });
        }
    };

    const handleCustomAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const step = steps[currentStep];
        if (step.type === 'question') {
            setCustomAnswers({
                ...customAnswers,
                [step.id]: e.target.value,
            });
        }
    };

    const handleEnhancerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (currentStepData.type === 'controls') {
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    enhancer: e.target.value
                }
            }));
        }
    };

    const handleTemperatureChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    temperature: value
                }
            }));
        }
    };
    
    const handleShapeChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    shape: step.controls.shape.options[value]
                }
            }));
        }
    };

    const handleFlavorChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    flavor: step.controls.flavor.options[value]
                }
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleSubmit = async () => {
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

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers({});
        setCustomAnswers({});
        setControlValues({});
        setRecipeResult(null);
        setIsCreatingRecipe(false);
    };

    const isNextDisabled = useMemo(() => {
        if (currentStepData.type === 'question') {
            const answer = answers[currentStepData.id];
            if (!answer) return true;

            if (currentStepData.customOption && answer === currentStepData.customOption.title) {
                const customAnswer = customAnswers[currentStepData.id];
                return !customAnswer || !customAnswer.trim();
            }
        }
        if (currentStepData.type === 'timeline') {
            const answer = answers[currentStepData.id];
            if (!answer) return true;
        }
        return false;
    }, [currentStepData, answers, customAnswers]);

    return {
        currentStep,
        currentStepData,
        answers,
        customAnswers,
        controlValues,
        recipeResult,
        isCreatingRecipe,
        isNextDisabled,
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange,
        nextStep,
        prevStep,
        handleSubmit,
        handleReset,
    };
};

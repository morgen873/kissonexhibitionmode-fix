
import { useMemo } from 'react';
import { useCreationSteps } from './useCreationSteps';
import { useCreationAnswers } from './useCreationAnswers';
import { useRecipeSubmission } from './useRecipeSubmission';
import { isNextDisabled } from '@/utils/formValidation';

export const useCreationForm = () => {
    const {
        currentStep,
        currentStepData,
        nextStep,
        prevStep,
        resetStep
    } = useCreationSteps();

    const {
        answers,
        customAnswers,
        controlValues,
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange,
        resetAnswers
    } = useCreationAnswers(currentStep);

    const {
        recipeResult,
        isCreatingRecipe,
        handleSubmit: submitRecipe,
        resetRecipe
    } = useRecipeSubmission();

    const handleSubmit = async () => {
        await submitRecipe(answers, customAnswers, controlValues);
    };

    const handleReset = () => {
        resetStep();
        resetAnswers();
        resetRecipe();
    };

    const isNextDisabledValue = useMemo(() => {
        return isNextDisabled(currentStep, answers, customAnswers);
    }, [currentStep, answers, customAnswers]);

    return {
        currentStep,
        currentStepData,
        answers,
        customAnswers,
        controlValues,
        recipeResult,
        isCreatingRecipe,
        isNextDisabled: isNextDisabledValue,
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

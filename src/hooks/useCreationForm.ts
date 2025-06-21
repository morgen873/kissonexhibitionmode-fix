
import { useMemo } from 'react';
import { steps } from '@/data/creation';
import { useFormState } from './useFormState';
import { useAnswerHandlers } from './useAnswerHandlers';
import { useRecipeSubmission } from './useRecipeSubmission';
import { useControlsInitialization } from './useControlsInitialization';
import { isNextDisabled } from '@/utils/formValidation';

export const useCreationForm = () => {
    const {
        currentStep,
        answers,
        customAnswers,
        controlValues,
        setAnswers,
        setCustomAnswers,
        setControlValues,
        nextStep,
        prevStep,
        resetState
    } = useFormState();

    const currentStepData = steps[currentStep];

    useControlsInitialization({
        currentStep,
        controlValues,
        setControlValues
    });

    const {
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange
    } = useAnswerHandlers({
        answers,
        customAnswers,
        controlValues,
        setAnswers,
        setCustomAnswers,
        setControlValues,
        currentStep
    });

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
        resetState();
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

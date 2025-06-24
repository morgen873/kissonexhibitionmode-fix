
import { useCreationSteps } from './useCreationSteps';
import { useCreationState } from './creation/useCreationState';
import { useCreationHandlers } from './creation/useCreationHandlers';
import { useCreationValidation } from './creation/useCreationValidation';
import { useRecipeSubmission } from './useRecipeSubmission';

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
    setAnswers,
    setCustomAnswers,
    setControlValues,
    resetState
  } = useCreationState();

  const {
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleEnhancerChange,
    handleTemperatureChange,
    handleShapeChange,
    handleFlavorChange
  } = useCreationHandlers({
    currentStep,
    answers,
    customAnswers,
    controlValues,
    setAnswers,
    setCustomAnswers,
    setControlValues
  });

  const { isNextDisabled } = useCreationValidation(currentStep, answers, customAnswers);

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
    resetState();
    resetRecipe();
  };

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

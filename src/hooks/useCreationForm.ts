
import { useCreationSteps } from './useCreationSteps';
import { useCreationState } from './creation/useCreationState';
import { useCreationHandlers } from './creation/useCreationHandlers';
import { useCreationValidation } from './creation/useCreationValidation';
import { useRecipeSubmission } from './useRecipeSubmission';
import { useErrorRecovery } from './useErrorRecovery';

export const useCreationForm = () => {
  const { handleError, retry, clearError } = useErrorRecovery();
  
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
    resetState,
    resetStateWithRecovery,
    clearBrowserState
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
    recipeId,
    isCreatingRecipe,
    handleSubmit: submitRecipe,
    resetRecipe
  } = useRecipeSubmission();

  const handleSubmit = async (timelineValue?: string) => {
    try {
      clearError(); // Clear any previous errors
      await submitRecipe(answers, customAnswers, controlValues, timelineValue);
    } catch (error) {
      handleError(error as Error, 'Recipe submission');
    }
  };

  const handleReset = () => {
    try {
      resetStep();
      resetState();
      resetRecipe();
      clearError();
    } catch (error) {
      handleError(error as Error, 'Reset operation');
    }
  };

  // Enhanced reset with recovery
  const handleResetWithRecovery = () => {
    try {
      resetStep();
      resetStateWithRecovery();
      resetRecipe();
      clearError();
    } catch (error) {
      handleError(error as Error, 'Recovery reset');
    }
  };

  return {
    currentStep,
    currentStepData,
    answers,
    customAnswers,
    controlValues,
    recipeResult,
    recipeId,
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
    handleResetWithRecovery,
    clearBrowserState,
    // Error recovery functions
    retry,
    clearError
  };
};

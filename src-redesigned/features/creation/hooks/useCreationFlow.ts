import { useMemo, useCallback } from 'react';
import { useCreationStore } from '@/shared/stores/creationStore';
import { useCreationSteps } from './useCreationSteps';
import { useCreationValidation } from './useCreationValidation';
import { useRecipeGeneration } from './useRecipeGeneration';
import { ControlValues } from '@/shared/types/creation';

/**
 * Main hook that orchestrates the creation flow
 * Combines all creation-related logic into a cohesive API
 */
export const useCreationFlow = () => {
  // Store state
  const {
    currentStep,
    currentIntroStep,
    hasStartedCreation,
    answers,
    customAnswers,
    controlValues,
    recipeResult,
    recipeId,
    isCreatingRecipe,
    
    // Actions
    selectAnswer,
    updateCustomAnswer,
    updateControlValue,
    nextStep,
    prevStep,
    nextIntroStep,
    prevIntroStep,
    setHasStartedCreation,
    reset,
    resetToIntro,
  } = useCreationStore();

  // Derived data
  const { steps, currentStepData, currentTheme, progress } = useCreationSteps({
    currentStep,
    currentIntroStep,
    hasStartedCreation,
  });

  // Validation
  const { canGoNext, canGoPrevious, validationErrors } = useCreationValidation({
    currentStep,
    currentStepData,
    answers,
    customAnswers,
    hasStartedCreation,
  });

  // Recipe generation
  const { generateRecipe, isGenerating } = useRecipeGeneration();

  // Event handlers
  const handleAnswerSelect = useCallback((stepId: number, answerIndex: number) => {
    if (!currentStepData || currentStepData.type !== 'question') return;
    
    selectAnswer(stepId, answerIndex, currentStepData.multiSelect);
  }, [currentStepData, selectAnswer]);

  const handleCustomAnswerChange = useCallback((stepId: number, value: string) => {
    updateCustomAnswer(stepId, value);
  }, [updateCustomAnswer]);

  const handleControlChange = useCallback(<K extends keyof ControlValues>(
    key: K, 
    value: ControlValues[K]
  ) => {
    updateControlValue(key, value);
  }, [updateControlValue]);

  const handleNext = useCallback(() => {
    if (!canGoNext) return;

    if (!hasStartedCreation) {
      // Handle intro navigation
      nextIntroStep();
      
      // Check if we should start the creation flow
      if (currentIntroStep >= 2) { // Adjust based on intro steps count
        setHasStartedCreation(true);
      }
    } else {
      // Handle creation step navigation
      nextStep();
    }
  }, [
    canGoNext,
    hasStartedCreation,
    currentIntroStep,
    nextIntroStep,
    nextStep,
    setHasStartedCreation,
  ]);

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious) return;

    if (!hasStartedCreation) {
      prevIntroStep();
    } else if (currentStep === 0) {
      // Going back from first creation step to intro
      setHasStartedCreation(false);
    } else {
      prevStep();
    }
  }, [
    canGoPrevious,
    hasStartedCreation,
    currentStep,
    prevIntroStep,
    prevStep,
    setHasStartedCreation,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!canGoNext || isGenerating) return;

    try {
      const recipeData = {
        answers,
        customAnswers,
        controlValues,
      };

      await generateRecipe(recipeData);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      // Error handling is managed by the hook
    }
  }, [canGoNext, isGenerating, answers, customAnswers, controlValues, generateRecipe]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return {
    // Current state
    currentStep: hasStartedCreation ? currentStep : currentIntroStep,
    currentStepData,
    currentTheme,
    progress,
    
    // User data
    answers,
    customAnswers,
    controlValues,
    
    // Recipe state
    recipeResult,
    recipeId,
    isCreatingRecipe: isCreatingRecipe || isGenerating,
    
    // Navigation state
    hasStartedCreation,
    canGoNext,
    canGoPrevious,
    validationErrors,
    
    // Event handlers
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleControlChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleReset,
    
    // Direct access to steps (for debugging/advanced use)
    steps,
  };
};
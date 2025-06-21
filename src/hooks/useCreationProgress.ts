
import { useMemo } from 'react';
import { steps } from '@/data/creation';
import { introSteps } from "@/data/introSteps";

interface UseCreationProgressProps {
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStep: number;
  recipeResult: any;
  creationStepData: any;
  isCreatingRecipe: boolean;
}

export const useCreationProgress = ({
  hasStartedCreation,
  currentIntroStep,
  creationStep,
  recipeResult,
  creationStepData,
  isCreatingRecipe
}: UseCreationProgressProps) => {
  const progress = useMemo(() => {
    const totalSteps = introSteps.length + steps.length;
    let currentStepIndex;
    
    if (!hasStartedCreation) {
      currentStepIndex = currentIntroStep;
    } else if (recipeResult) {
      currentStepIndex = totalSteps;
    } else {
      currentStepIndex = introSteps.length + creationStep;
    }
    
    return (currentStepIndex / totalSteps) * 100;
  }, [hasStartedCreation, currentIntroStep, creationStep, recipeResult]);

  const title = useMemo(() => {
    if (!hasStartedCreation) {
      const introTitle = introSteps[currentIntroStep].title;
      return Array.isArray(introTitle) ? introTitle.join(' ') : introTitle;
    }
    return creationStepData.type === 'question' ? creationStepData.question : creationStepData.title;
  }, [hasStartedCreation, currentIntroStep, creationStepData]);

  const showTitle = useMemo(() => {
    return !recipeResult && !isCreatingRecipe && (!hasStartedCreation ? introSteps[currentIntroStep].type !== 'quote' : true);
  }, [recipeResult, isCreatingRecipe, hasStartedCreation, currentIntroStep]);

  return {
    progress,
    title,
    showTitle
  };
};

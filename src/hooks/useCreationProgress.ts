
import { steps } from '@/data/creation';
import { introSteps } from "@/data/introSteps";

interface UseCreationProgressProps {
  currentIntroStep: number;
  hasStartedCreation: boolean;
  creationStep: number;
  recipeResult: any;
}

export const useCreationProgress = ({
  currentIntroStep,
  hasStartedCreation,
  creationStep,
  recipeResult
}: UseCreationProgressProps) => {
  const totalSteps = introSteps.length + steps.length;
  
  let currentStepIndex;
  if (!hasStartedCreation) {
    currentStepIndex = currentIntroStep;
  } else if (recipeResult) {
    currentStepIndex = totalSteps;
  } else {
    currentStepIndex = introSteps.length + creationStep;
  }
  
  const progress = (currentStepIndex / totalSteps) * 100;
  
  return { progress, totalSteps, currentStepIndex };
};

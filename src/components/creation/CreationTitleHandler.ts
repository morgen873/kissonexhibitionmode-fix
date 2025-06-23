
import { introSteps } from "@/data/introSteps";

interface CreationTitleHandlerProps {
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStepData: any;
}

export const getCreationTitle = ({
  hasStartedCreation,
  currentIntroStep,
  creationStepData
}: CreationTitleHandlerProps): string => {
  if (!hasStartedCreation) {
    const title = introSteps[currentIntroStep].title;
    return Array.isArray(title) ? title.join(' ') : title;
  }
  return creationStepData.type === 'question' ? creationStepData.question : creationStepData.title;
};

export const shouldShowTitle = (
  recipeResult: any,
  isCreatingRecipe: boolean,
  hasStartedCreation: boolean,
  currentIntroStep: number
): boolean => {
  if (recipeResult || isCreatingRecipe) return false;
  
  if (!hasStartedCreation) {
    const currentStep = introSteps[currentIntroStep];
    // Don't show title for quote steps or explanation steps (they have their own title in the card)
    return currentStep.type !== 'quote' && currentStep.type !== 'explanation';
  }
  
  return true;
};

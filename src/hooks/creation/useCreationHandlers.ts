
import { useAnswerHandlers } from '@/hooks/useAnswerHandlers';
import { useControlsInitialization } from '@/hooks/useControlsInitialization';
import { CreationState } from './useCreationState';

interface UseCreationHandlersProps extends CreationState {
  currentStep: number;
  setAnswers: (answers: { [key: number]: string | string[] }) => void;
  setCustomAnswers: (customAnswers: { [key: number]: string }) => void;
  setControlValues: (controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } } | ((prev: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } }) => { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } })) => void;
}

export const useCreationHandlers = ({
  currentStep,
  answers,
  customAnswers,
  controlValues,
  setAnswers,
  setCustomAnswers,
  setControlValues
}: UseCreationHandlersProps) => {
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
    handleFlavorChange,
    handleDietaryChange
  } = useAnswerHandlers({
    answers,
    customAnswers,
    controlValues,
    setAnswers,
    setCustomAnswers,
    setControlValues,
    currentStep
  });

  return {
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleEnhancerChange,
    handleTemperatureChange,
    handleShapeChange,
    handleFlavorChange,
    handleDietaryChange
  };
};

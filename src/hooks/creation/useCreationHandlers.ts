
import { useAnswerHandlers } from '@/hooks/useAnswerHandlers';
import { useControlsInitialization } from '@/hooks/useControlsInitialization';
import { CreationState } from './useCreationState';

interface UseCreationHandlersProps extends CreationState {
  currentStep: number;
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

  return {
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleEnhancerChange,
    handleTemperatureChange,
    handleShapeChange,
    handleFlavorChange
  };
};

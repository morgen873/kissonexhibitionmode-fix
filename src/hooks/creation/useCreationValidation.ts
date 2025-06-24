
import { useMemo } from 'react';
import { isNextDisabled } from '@/utils/formValidation';

export const useCreationValidation = (
  currentStep: number,
  answers: { [key: number]: string },
  customAnswers: { [key: number]: string }
) => {
  const isNextDisabledValue = useMemo(() => {
    return isNextDisabled(currentStep, answers, customAnswers);
  }, [currentStep, answers, customAnswers]);

  return {
    isNextDisabled: isNextDisabledValue
  };
};

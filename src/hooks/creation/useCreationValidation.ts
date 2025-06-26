
import { useMemo } from 'react';
import { isNextDisabled } from '@/utils/formValidation';
import { steps } from '@/data/creation';

export const useCreationValidation = (
  currentStep: number,
  answers: { [key: number]: string },
  customAnswers: { [key: number]: string }
) => {
  const isNextDisabledValue = useMemo(() => {
    // Prevent validation errors when step is out of bounds
    if (currentStep >= steps.length) {
      console.log('Step out of bounds, validation disabled');
      return false;
    }
    
    return isNextDisabled(currentStep, answers, customAnswers);
  }, [currentStep, answers, customAnswers]);

  return {
    isNextDisabled: isNextDisabledValue
  };
};

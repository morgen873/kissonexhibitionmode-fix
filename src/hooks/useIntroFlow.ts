
import { useState } from 'react';
import { introSteps } from "@/data/introSteps";

export const useIntroFlow = () => {
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  const handleIntroNext = () => {
    if (currentIntroStep < introSteps.length - 1) {
      setCurrentIntroStep(currentIntroStep + 1);
    } else {
      setHasStartedCreation(true);
    }
  };

  const handleIntroPrev = () => {
    if (currentIntroStep > 0) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  const resetIntroFlow = () => {
    setCurrentIntroStep(0);
    setHasStartedCreation(false);
  };

  return {
    currentIntroStep,
    hasStartedCreation,
    handleIntroNext,
    handleIntroPrev,
    resetIntroFlow,
    setHasStartedCreation
  };
};

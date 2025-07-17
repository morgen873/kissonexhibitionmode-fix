
import { useState } from 'react';

export interface CreationState {
  answers: { [key: number]: string | string[] };
  customAnswers: { [key: number]: string };
  controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export const useCreationState = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
  const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});

  const resetState = () => {
    setAnswers({});
    setCustomAnswers({});
    setControlValues({});
  };

  return {
    answers,
    customAnswers,
    controlValues,
    setAnswers,
    setCustomAnswers,
    setControlValues,
    resetState
  };
};

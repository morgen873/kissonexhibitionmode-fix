
import { useState, useEffect } from 'react';
import { useCreationStateDebug } from './useCreationStateDebug';

export interface CreationState {
  answers: { [key: number]: string | string[] };
  customAnswers: { [key: number]: string };
  controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export const useCreationState = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
  const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});

  const state: CreationState = {
    answers,
    customAnswers,
    controlValues
  };

  // Add debugging capabilities
  const { saveStateBackup, recoverState, clearBrowserState } = useCreationStateDebug(state);

  // Auto-save state backup periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveStateBackup();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [saveStateBackup]);

  const resetState = () => {
    console.log('🔄 Resetting creation state...');
    setAnswers({});
    setCustomAnswers({});
    setControlValues({});
  };

  // Enhanced reset with recovery option
  const resetStateWithRecovery = () => {
    const backup = recoverState();
    if (backup) {
      console.log('🔄 Recovering from backup state...');
      setAnswers(backup.answers || {});
      setCustomAnswers(backup.customAnswers || {});
      setControlValues(backup.controlValues || {});
    } else {
      resetState();
    }
  };

  return {
    answers,
    customAnswers,
    controlValues,
    setAnswers,
    setCustomAnswers,
    setControlValues,
    resetState,
    resetStateWithRecovery,
    clearBrowserState,
    recoverState
  };
};

import { useEffect } from 'react';
import { CreationState } from './useCreationState';

export const useCreationStateDebug = (state: CreationState) => {
  useEffect(() => {
    console.log('🔍 Creation State Debug:', {
      timestamp: new Date().toISOString(),
      answers: state.answers,
      customAnswers: state.customAnswers,
      controlValues: state.controlValues,
      answersCount: Object.keys(state.answers).length,
      customAnswersCount: Object.keys(state.customAnswers).length,
      controlValuesCount: Object.keys(state.controlValues).length
    });
  }, [state.answers, state.customAnswers, state.controlValues]);

  // Clear state function for debugging
  const clearBrowserState = () => {
    console.log('🧹 Clearing browser state...');
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    window.location.reload();
  };

  // State recovery function
  const recoverState = () => {
    console.log('🔄 Attempting state recovery...');
    const savedState = localStorage.getItem('creation-state-backup');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        console.log('✅ Found backup state:', parsed);
        return parsed;
      } catch (error) {
        console.error('❌ Failed to parse backup state:', error);
      }
    }
    return null;
  };

  // Save state backup
  const saveStateBackup = () => {
    try {
      localStorage.setItem('creation-state-backup', JSON.stringify(state));
      console.log('💾 State backup saved');
    } catch (error) {
      console.error('❌ Failed to save state backup:', error);
    }
  };

  // Expose debugging functions globally for console access
  useEffect(() => {
    (window as any).creationDebug = {
      clearBrowserState,
      recoverState,
      saveStateBackup,
      currentState: state
    };
    
    return () => {
      delete (window as any).creationDebug;
    };
  }, [state]);

  return {
    clearBrowserState,
    recoverState,
    saveStateBackup
  };
};

// This hook has been refactored and split into smaller, focused hooks:
// - useCreationState: Manages state
// - useCreationHandlers: Handles user interactions
// - useCreationValidation: Validates form state
// 
// Please use the new useCreationForm hook which orchestrates all these concerns
// or use the individual hooks directly for more granular control.

import { useCreationState } from './creation/useCreationState';
import { useCreationHandlers } from './creation/useCreationHandlers';

export const useCreationAnswers = (currentStep: number) => {
  const state = useCreationState();
  const handlers = useCreationHandlers({
    currentStep,
    ...state
  });

  return {
    ...state,
    ...handlers,
    resetAnswers: state.resetState
  };
};

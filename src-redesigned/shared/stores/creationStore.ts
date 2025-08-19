import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CreationState, Step, CreationAnswers, ControlValues } from '@/shared/types/creation';

interface CreationStore extends CreationState {
  // Actions
  setCurrentStep: (step: number) => void;
  setIntroStep: (step: number) => void;
  setAnswers: (answers: CreationAnswers) => void;
  setCustomAnswers: (answers: Record<number, string>) => void;
  setControlValues: (values: ControlValues) => void;
  setHasStartedCreation: (started: boolean) => void;
  setRecipeResult: (result: any) => void;
  setRecipeId: (id: string | null) => void;
  setIsCreatingRecipe: (creating: boolean) => void;
  
  // Complex actions
  selectAnswer: (stepId: number, answerIndex: number, multiSelect?: boolean) => void;
  updateCustomAnswer: (stepId: number, value: string) => void;
  updateControlValue: <K extends keyof ControlValues>(key: K, value: ControlValues[K]) => void;
  
  // Navigation actions
  nextStep: () => void;
  prevStep: () => void;
  nextIntroStep: () => void;
  prevIntroStep: () => void;
  
  // Reset actions
  reset: () => void;
  resetToIntro: () => void;
}

const initialState: CreationState = {
  currentStep: 0,
  currentIntroStep: 0,
  hasStartedCreation: false,
  answers: {},
  customAnswers: {},
  controlValues: {
    temperature: 125,
    shape: 'oval',
    flavor: 'savory',
    enhancer: '',
    dietary: {
      vegan: false,
      vegetarian: false,
      allergies: '',
      specialDiet: false,
    },
  },
  recipeResult: null,
  recipeId: null,
  isCreatingRecipe: false,
};

export const useCreationStore = create<CreationStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Simple setters
        setCurrentStep: (step) => set({ currentStep: step }),
        setIntroStep: (step) => set({ currentIntroStep: step }),
        setAnswers: (answers) => set({ answers }),
        setCustomAnswers: (customAnswers) => set({ customAnswers }),
        setControlValues: (controlValues) => set({ controlValues }),
        setHasStartedCreation: (hasStartedCreation) => set({ hasStartedCreation }),
        setRecipeResult: (recipeResult) => set({ recipeResult }),
        setRecipeId: (recipeId) => set({ recipeId }),
        setIsCreatingRecipe: (isCreatingRecipe) => set({ isCreatingRecipe }),

        // Complex actions
        selectAnswer: (stepId, answerIndex, multiSelect = false) => {
          const { answers } = get();
          
          if (multiSelect) {
            const currentAnswers = answers[stepId] || [];
            const answerExists = currentAnswers.includes(answerIndex);
            
            const newAnswers = answerExists
              ? currentAnswers.filter(index => index !== answerIndex)
              : [...currentAnswers, answerIndex];
              
            set({
              answers: {
                ...answers,
                [stepId]: newAnswers,
              },
            });
          } else {
            set({
              answers: {
                ...answers,
                [stepId]: [answerIndex],
              },
            });
          }
        },

        updateCustomAnswer: (stepId, value) => {
          const { customAnswers } = get();
          set({
            customAnswers: {
              ...customAnswers,
              [stepId]: value,
            },
          });
        },

        updateControlValue: (key, value) => {
          const { controlValues } = get();
          set({
            controlValues: {
              ...controlValues,
              [key]: value,
            },
          });
        },

        // Navigation actions
        nextStep: () => {
          const { currentStep } = get();
          set({ currentStep: currentStep + 1 });
        },

        prevStep: () => {
          const { currentStep } = get();
          set({ currentStep: Math.max(0, currentStep - 1) });
        },

        nextIntroStep: () => {
          const { currentIntroStep } = get();
          set({ currentIntroStep: currentIntroStep + 1 });
        },

        prevIntroStep: () => {
          const { currentIntroStep } = get();
          set({ currentIntroStep: Math.max(0, currentIntroStep - 1) });
        },

        // Reset actions
        reset: () => set(initialState),
        
        resetToIntro: () => set({
          ...initialState,
          // Keep recipe result if it exists
          recipeResult: get().recipeResult,
          recipeId: get().recipeId,
        }),
      }),
      {
        name: 'creation-store',
        // Only persist essential data, not transient states
        partialize: (state) => ({
          answers: state.answers,
          customAnswers: state.customAnswers,
          controlValues: state.controlValues,
        }),
      }
    ),
    {
      name: 'creation-store',
    }
  )
);
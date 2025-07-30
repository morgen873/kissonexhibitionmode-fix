
export interface CreationContentHandlers {
  onAnswerSelect: (optionTitle: string) => void;
  onCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTemperatureChange: (value: number) => void;
  onShapeChange: (value: number) => void;
  onFlavorChange: (value: number) => void;
  onEnhancerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDietaryChange: (field: 'vegan' | 'vegetarian' | 'allergies' | 'specialDiet', value: boolean | string) => void;
}

export interface CreationContentState {
  answers: { [key: number]: string | string[] };
  customAnswers: { [key: number]: string };
  controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } };
  recipeResult: any;
  recipeId: string | null;
  isCreatingRecipe: boolean;
  isNextDisabled: boolean;
}

export interface CreationContentNavigation {
  nextIntroStep: () => void;
  prevIntroStep: () => void;
  prevCreationStep: () => void;
  nextCreationStep: () => void;
  handleSubmit: () => void;
  handleReset: () => void;
  handleIntroNext: () => void;
  handleIntroPrev: () => void;
  handleCreationNext: () => void;
  handleCreationPrev: () => void;
  handleCreationSubmit: () => void;
}

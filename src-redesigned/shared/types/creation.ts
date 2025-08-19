// Base step types
export interface BaseStep {
  id?: number;
  title?: string;
  description?: string;
}

export interface QuestionStep extends BaseStep {
  type: 'question';
  id: number;
  question: string;
  options: Array<{
    title: string;
    description: string;
  }>;
  customOption?: {
    title: string;
    placeholder: string;
  };
  multiSelect?: boolean;
}

export interface ExplanationStep extends BaseStep {
  type: 'explanation';
  title: string;
  description: string;
}

export interface ControlsStep extends BaseStep {
  type: 'controls';
  id: number;
  title: string;
  description: string;
  controls: {
    temperature: {
      min: number;
      max: number;
      unit: string;
      defaultValue: number;
    };
    shape: {
      options: string[];
      defaultValue: string;
    };
    flavor: {
      options: string[];
      defaultValue: string;
    };
    enhancer?: {
      placeholder: string;
      defaultValue: string;
    };
    dietary?: {
      vegan: boolean;
      vegetarian: boolean;
      allergies: string;
      specialDiet: boolean;
    };
  };
}

export interface TimelineStep extends BaseStep {
  type: 'timeline';
  id: number;
  title: string;
  description: string;
  options: Array<{
    title: string;
    description: string;
    value?: string;
  }>;
}

export type Step = QuestionStep | ExplanationStep | ControlsStep | TimelineStep;

// State types
export interface CreationAnswers {
  [stepId: number]: number[];
}

export interface ControlValues {
  temperature: number;
  shape: string;
  flavor: string;
  enhancer: string;
  dietary: {
    vegan: boolean;
    vegetarian: boolean;
    allergies: string;
    specialDiet: boolean;
  };
}

export interface RecipeResult {
  id: string;
  name: string;
  imageUrl: string;
  qrData: string;
  imagePrompt?: string;
  ingredients?: string[];
  instructions?: string[];
  metadata?: {
    memory: string;
    emotions: string[];
    dedicatedTo: string;
    temperature: number;
    shape: string;
    flavor: string;
    enhancer: string;
    timeline: string;
    createdAt: string;
  };
}

export interface CreationState {
  // Step navigation
  currentStep: number;
  currentIntroStep: number;
  hasStartedCreation: boolean;
  
  // User input
  answers: CreationAnswers;
  customAnswers: Record<number, string>;
  controlValues: ControlValues;
  
  // Recipe generation
  recipeResult: RecipeResult | null;
  recipeId: string | null;
  isCreatingRecipe: boolean;
}

// Theme types
export interface StepTheme {
  bg: string;
  cardShadow: string;
  progress: string;
  title: string;
  optionSelectedBorder: string;
  optionSelectedShadow: string;
  optionHover: string;
  textAreaFocus: string;
}

// Navigation types
export interface NavigationState {
  isTransitioning: boolean;
  transitionGifUrl: string;
  transitionDirection: 'forward' | 'backward';
  transitionVariant: 'slide' | 'fade' | 'scale';
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// API types
export interface RecipeGenerationRequest {
  memory: string;
  emotions: string[];
  dedicatedTo: string;
  controlValues: ControlValues;
  timeline: string;
}

export interface RecipeGenerationResponse {
  success: boolean;
  recipe?: RecipeResult;
  error?: string;
}

// Component prop types
export interface StepComponentProps<T extends Step = Step> {
  step: T;
  theme: StepTheme;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export interface QuestionStepProps extends StepComponentProps<QuestionStep> {
  selectedAnswers: number[];
  customAnswer: string;
  onAnswerSelect: (answerIndex: number) => void;
  onCustomAnswerChange: (value: string) => void;
  isNextDisabled: boolean;
}

export interface ControlsStepProps extends StepComponentProps<ControlsStep> {
  controlValues: ControlValues;
  onControlChange: <K extends keyof ControlValues>(key: K, value: ControlValues[K]) => void;
}

export interface TimelineStepProps extends StepComponentProps<TimelineStep> {
  selectedTimeline: string;
  onTimelineSelect: (timeline: string) => void;
}

// Utility types
export type StepType = Step['type'];
export type StepId = Step['id'];

// Error types
export interface CreationError {
  type: 'validation' | 'network' | 'generation' | 'unknown';
  message: string;
  step?: number;
  field?: string;
}

// Analytics types
export interface CreationAnalytics {
  stepStartTime: Record<number, number>;
  stepDuration: Record<number, number>;
  totalDuration: number;
  abandonedAt?: number;
  completedAt?: number;
  errors: CreationError[];
}
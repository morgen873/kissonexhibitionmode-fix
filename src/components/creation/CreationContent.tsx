
import IntroFlow from './IntroFlow';
import IntroStepContent from './IntroStepContent';
import QuestionScreen from './QuestionScreen';
import ControlsScreen from './ControlsScreen';
import TimelineScreen from './TimelineScreen';
import RecipeResultScreen from './RecipeResultScreen';
import { introSteps } from '@/data/introSteps';

interface CreationContentProps {
  isCreatingRecipe: boolean;
  recipeResult: any;
  hasStartedCreation: boolean;
  currentIntroStep: number;
  creationStep: number;
  creationStepData: any;
  answers: Record<string, string>;
  customAnswers: Record<string, string>;
  controlValues: any;
  theme: any;
  isNextDisabled: boolean;
  onAnswerSelect: (stepId: string, answer: string) => void;
  onCustomAnswerChange: (stepId: string, value: string) => void;
  onTemperatureChange: (value: number) => void;
  onShapeChange: (value: number) => void;
  onFlavorChange: (value: number) => void;
  onEnhancerChange: (value: string) => void;
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

const CreationContent = ({
  isCreatingRecipe,
  recipeResult,
  hasStartedCreation,
  currentIntroStep,
  creationStep,
  creationStepData,
  answers,
  customAnswers,
  controlValues,
  theme,
  isNextDisabled,
  onAnswerSelect,
  onCustomAnswerChange,
  onTemperatureChange,
  onShapeChange,
  onFlavorChange,
  onEnhancerChange,
  nextIntroStep,
  prevIntroStep,
  prevCreationStep,
  nextCreationStep,
  handleSubmit,
  handleReset,
  handleIntroNext,
  handleIntroPrev,
  handleCreationNext,
  handleCreationPrev,
  handleCreationSubmit
}: CreationContentProps) => {
  
  // Show recipe result
  if (recipeResult) {
    return (
      <RecipeResultScreen
        recipeResult={recipeResult}
        isCreatingRecipe={isCreatingRecipe}
        onReset={handleReset}
        theme={theme}
      />
    );
  }

  // Show intro flow (with built-in navigation)
  if (!hasStartedCreation) {
    return <IntroFlow onComplete={() => handleIntroNext()} />;
  }

  // Show creation steps
  return (
    <div className="w-full">
      {creationStepData?.type === 'question' && (
        <QuestionScreen
          stepData={creationStepData}
          answer={answers[creationStepData.id] || ''}
          customAnswer={customAnswers[creationStepData.id] || ''}
          onAnswerSelect={onAnswerSelect}
          onCustomAnswerChange={onCustomAnswerChange}
          theme={theme}
        />
      )}

      {creationStepData?.type === 'controls' && (
        <ControlsScreen
          controlValues={controlValues}
          onTemperatureChange={onTemperatureChange}
          onShapeChange={onShapeChange}
          onFlavorChange={onFlavorChange}
          onEnhancerChange={onEnhancerChange}
          theme={theme}
        />
      )}

      {creationStepData?.type === 'timeline' && (
        <TimelineScreen
          onSubmit={handleCreationSubmit}
          theme={theme}
        />
      )}
    </div>
  );
};

export default CreationContent;

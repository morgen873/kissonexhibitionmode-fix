
import React from 'react';
import { Loader2 } from 'lucide-react';
import { introSteps } from "@/data/introSteps";
import IntroStepContent from './IntroStepContent';
import CreationMainContent from './CreationMainContent';
import RecipeResultScreen from './RecipeResultScreen';

interface CreationContentProps {
  hasStartedCreation: boolean;
  currentIntroStep: number;
  isCreatingRecipe: boolean;
  recipeResult: any;
  creationStepData: any;
  answers: { [key: number]: string };
  customAnswers: { [key: number]: string };
  controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
  theme: {
    optionSelectedBorder: string;
    optionSelectedShadow: string;
    optionHover: string;
    textAreaFocus: string;
  };
  onAnswerSelect: (optionTitle: string) => void;
  onCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTemperatureChange: (value: number) => void;
  onShapeChange: (value: number) => void;
  onFlavorChange: (value: number) => void;
  onEnhancerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onIntroNext: () => void;
  onReset: () => void;
}

const CreationContent: React.FC<CreationContentProps> = ({
  hasStartedCreation,
  currentIntroStep,
  isCreatingRecipe,
  recipeResult,
  creationStepData,
  answers,
  customAnswers,
  controlValues,
  theme,
  onAnswerSelect,
  onCustomAnswerChange,
  onTemperatureChange,
  onShapeChange,
  onFlavorChange,
  onEnhancerChange,
  onIntroNext,
  onReset
}) => {
  console.log('CreationContent rendering:', {
    hasStartedCreation,
    isCreatingRecipe,
    recipeResult: !!recipeResult,
    recipeResultData: recipeResult
  });

  if (isCreatingRecipe) {
    console.log('Showing recipe creation loader');
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="text-lg font-semibold text-white/80 font-mono">Creating your recipe...</p>
      </div>
    );
  }

  if (recipeResult) {
    console.log('Showing recipe result screen');
    return <RecipeResultScreen recipe={recipeResult} onReset={onReset} />;
  }

  return (
    <div className="transition-opacity duration-300">
      {!hasStartedCreation ? (
        <IntroStepContent 
          step={introSteps[currentIntroStep]} 
          onNext={onIntroNext}
        />
      ) : (
        <CreationMainContent
          stepData={creationStepData}
          answers={answers}
          customAnswers={customAnswers}
          controlValues={controlValues}
          theme={theme}
          onAnswerSelect={onAnswerSelect}
          onCustomAnswerChange={onCustomAnswerChange}
          onTemperatureChange={onTemperatureChange}
          onShapeChange={onShapeChange}
          onFlavorChange={onFlavorChange}
          onEnhancerChange={onEnhancerChange}
        />
      )}
    </div>
  );
};

export default CreationContent;

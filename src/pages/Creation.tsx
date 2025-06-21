
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { steps } from '@/data/creation';
import { Loader2 } from 'lucide-react';
import { useCreationForm } from '@/hooks/useCreationForm';
import { introSteps } from "@/data/introSteps";
import CreationContainer from '@/components/creation/CreationContainer';
import IntroStepContent from '@/components/creation/IntroStepContent';
import IntroNavigation from '@/components/creation/IntroNavigation';
import CreationMainContent from '@/components/creation/CreationMainContent';
import NavigationControls from '@/components/creation/NavigationControls';
import RecipeResultScreen from '@/components/creation/RecipeResultScreen';

interface OutletContextType {
  setHeaderVisible: (visible: boolean) => void;
}

const Creation = () => {
  const {
    currentStep: creationStep,
    currentStepData: creationStepData,
    answers,
    customAnswers,
    controlValues,
    recipeResult,
    isCreatingRecipe,
    isNextDisabled,
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleEnhancerChange,
    handleTemperatureChange,
    handleShapeChange,
    handleFlavorChange,
    nextStep: nextCreationStep,
    prevStep: prevCreationStep,
    handleSubmit,
    handleReset
  } = useCreationForm();
  
  const [currentIntroStep, setCurrentIntroStep] = useState(0);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);
  const { setHeaderVisible } = useOutletContext<OutletContextType>() || {};

  useEffect(() => {
    if (setHeaderVisible) {
      setHeaderVisible(false);
    }
    return () => {
      if (setHeaderVisible) {
        setHeaderVisible(true);
      }
    };
  }, [setHeaderVisible]);

  // Simplified transition handling - no delays
  const handleStepTransition = (transitionFn: () => void) => {
    transitionFn();
  };

  const nextIntroStep = () => {
    if (currentIntroStep < introSteps.length - 1) {
      setCurrentIntroStep(currentIntroStep + 1);
    } else {
      setHasStartedCreation(true);
    }
  };

  const prevIntroStep = () => {
    if (currentIntroStep > 0) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  // Calculate progress across the entire flow
  const totalSteps = introSteps.length + steps.length;
  let currentStepIndex;
  if (!hasStartedCreation) {
    currentStepIndex = currentIntroStep;
  } else if (recipeResult) {
    currentStepIndex = totalSteps;
  } else {
    currentStepIndex = introSteps.length + creationStep;
  }
  const progress = (currentStepIndex / totalSteps) * 100;

  // Unified black and white theme
  const theme = { 
    bg: "from-black via-gray-900 to-black",
    progress: "from-white to-gray-300",
    cardShadow: "shadow-black/25",
    title: "from-white to-gray-300",
    optionSelectedBorder: "border-white",
    optionSelectedShadow: "shadow-white/25",
    optionHover: "hover:bg-white/10",
    textAreaFocus: "focus:ring-white focus:border-white"
  };

  // Determine title and show title condition
  const getTitle = () => {
    if (!hasStartedCreation) {
      return introSteps[currentIntroStep].title;
    }
    return creationStepData.type === 'question' ? creationStepData.question : creationStepData.title;
  };

  const showTitle = !recipeResult && !isCreatingRecipe;

  return (
    <>
      <CreationContainer
        progress={progress}
        theme={theme}
        title={getTitle()}
        showTitle={showTitle}
        hasStartedCreation={hasStartedCreation}
      >
        {isCreatingRecipe ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            <p className="text-lg font-semibold text-white/80 font-mono">Creating your recipe...</p>
          </div>
        ) : recipeResult ? (
          <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />
        ) : (
          <div className="transition-opacity duration-300">
            {!hasStartedCreation ? (
              <IntroStepContent 
                step={introSteps[currentIntroStep]} 
                onNext={nextIntroStep}
              />
            ) : (
              <CreationMainContent
                stepData={creationStepData}
                answers={answers}
                customAnswers={customAnswers}
                controlValues={controlValues}
                theme={theme}
                onAnswerSelect={handleAnswerSelect}
                onCustomAnswerChange={handleCustomAnswerChange}
                onTemperatureChange={handleTemperatureChange}
                onShapeChange={handleShapeChange}
                onFlavorChange={handleFlavorChange}
                onEnhancerChange={handleEnhancerChange}
              />
            )}
            
            {/* Navigation Controls */}
            {!hasStartedCreation ? (
              introSteps[currentIntroStep].type !== 'hero' && (
                <IntroNavigation
                  currentStep={currentIntroStep}
                  totalSteps={4}
                  onPrev={prevIntroStep}
                  onNext={nextIntroStep}
                  isFirstStep={currentIntroStep === 0}
                  isLastStep={currentIntroStep === introSteps.length - 1}
                  buttonText={introSteps[currentIntroStep].buttonText}
                />
              )
            ) : (
              <NavigationControls 
                currentStep={creationStep} 
                stepsLength={steps.length} 
                prevStep={() => handleStepTransition(prevCreationStep)} 
                nextStep={() => handleStepTransition(nextCreationStep)} 
                handleSubmit={() => handleStepTransition(handleSubmit)} 
                isNextDisabled={isNextDisabled} 
              />
            )}
          </div>
        )}
      </CreationContainer>

      {/* Footer for intro flow - made more compact */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-black/50 text-white mt-6 w-full text-center border-t-2 border-white/20 py-3">
          <p className="text-sm font-black font-mono">
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </>
  );
};

export default Creation;

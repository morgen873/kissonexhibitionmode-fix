
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { steps } from '@/data/creation';
import { Loader2 } from 'lucide-react';
import { useCreationForm } from '@/hooks/useCreationForm';
import { useTransition } from '@/hooks/useTransition';
import { introSteps } from "@/data/introSteps";
import CreationContainer from '@/components/creation/CreationContainer';
import IntroStepContent from '@/components/creation/IntroStepContent';
import IntroNavigation from '@/components/creation/IntroNavigation';
import CreationMainContent from '@/components/creation/CreationMainContent';
import NavigationControls from '@/components/creation/NavigationControls';
import RecipeResultScreen from '@/components/creation/RecipeResultScreen';
import TransitionAnimation from '@/components/creation/TransitionAnimation';

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
  
  const { isTransitioning, transitionDirection, startTransition, completeTransition } = useTransition();
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

  // Transition handlers for intro steps - NO ANIMATION during intro
  const handleIntroNext = () => {
    if (currentIntroStep < introSteps.length - 1) {
      setCurrentIntroStep(currentIntroStep + 1);
    } else {
      // Only start transition when moving from intro to creation
      startTransition('forward', () => {
        setHasStartedCreation(true);
      });
    }
  };

  const handleIntroPrev = () => {
    if (currentIntroStep > 0) {
      setCurrentIntroStep(currentIntroStep - 1);
    }
  };

  // Transition handlers for creation steps - WITH ANIMATION
  const handleCreationNext = () => {
    startTransition('forward', () => {
      nextCreationStep();
    });
  };

  const handleCreationPrev = () => {
    startTransition('backward', () => {
      prevCreationStep();
    });
  };

  const handleCreationSubmit = () => {
    // No transition animation for recipe creation - it will show in background
    handleSubmit();
  };

  // Regular non-transition handlers
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

  // Determine title and show title condition - Fixed to handle string arrays
  const getTitle = (): string => {
    if (!hasStartedCreation) {
      const title = introSteps[currentIntroStep].title;
      return Array.isArray(title) ? title.join(' ') : title;
    }
    return creationStepData.type === 'question' ? creationStepData.question : creationStepData.title;
  };

  // Only show title for non-quote intro steps and creation steps
  const showTitle = !recipeResult && !isCreatingRecipe && (!hasStartedCreation ? introSteps[currentIntroStep].type !== 'quote' : true);

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
                  onTransitionPrev={handleIntroPrev}
                  onTransitionNext={handleIntroNext}
                  isFirstStep={currentIntroStep === 0}
                  isLastStep={currentIntroStep === introSteps.length - 1}
                  buttonText={introSteps[currentIntroStep].buttonText}
                />
              )
            ) : (
              <NavigationControls 
                currentStep={creationStep} 
                stepsLength={steps.length} 
                prevStep={prevCreationStep} 
                nextStep={nextCreationStep} 
                handleSubmit={handleSubmit}
                onTransitionNext={creationStep === steps.length - 1 ? handleCreationSubmit : handleCreationNext}
                onTransitionPrev={handleCreationPrev}
                isNextDisabled={isNextDisabled} 
              />
            )}
          </div>
        )}
      </CreationContainer>

      {/* Transition Animation Overlay - only during creation transitions */}
      {hasStartedCreation && (
        <TransitionAnimation
          isVisible={isTransitioning}
          direction={transitionDirection}
          onComplete={completeTransition}
          backgroundMode={isCreatingRecipe}
        />
      )}

      {/* Background Animation during recipe creation */}
      {isCreatingRecipe && (
        <TransitionAnimation
          isVisible={true}
          direction="forward"
          onComplete={() => {}}
          backgroundMode={true}
        />
      )}

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

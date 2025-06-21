
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCreationForm } from '@/hooks/useCreationForm';
import { useIntroFlow } from '@/hooks/useIntroFlow';
import { useCreationFlow } from '@/hooks/useCreationFlow';
import { useCreationProgress } from '@/hooks/useCreationProgress';
import CreationContainer from '@/components/creation/CreationContainer';
import CreationContent from '@/components/creation/CreationContent';
import CreationNavigation from '@/components/creation/CreationNavigation';
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
  
  const {
    currentIntroStep,
    hasStartedCreation,
    handleIntroNext,
    handleIntroPrev,
    setHasStartedCreation
  } = useIntroFlow();

  const {
    isTransitioning,
    transitionDirection,
    completeTransition,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit
  } = useCreationFlow();

  const { progress, title, showTitle } = useCreationProgress({
    hasStartedCreation,
    currentIntroStep,
    creationStep,
    recipeResult,
    creationStepData,
    isCreatingRecipe
  });

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
  const handleIntroTransitionNext = () => {
    if (currentIntroStep < 3) {
      handleIntroNext();
    } else {
      // Only start transition when moving from intro to creation
      handleCreationNext(() => {
        setHasStartedCreation(true);
      });
    }
  };

  const handleIntroTransitionPrev = () => {
    handleIntroPrev();
  };

  // Transition handlers for creation steps - WITH ANIMATION
  const handleCreationTransitionNext = () => {
    handleCreationNext(() => {
      nextCreationStep();
    });
  };

  const handleCreationTransitionPrev = () => {
    handleCreationPrev(() => {
      prevCreationStep();
    });
  };

  const handleCreationTransitionSubmit = () => {
    handleCreationSubmit(() => {
      handleSubmit();
    });
  };

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

  return (
    <>
      <CreationContainer
        progress={progress}
        theme={theme}
        title={title}
        showTitle={showTitle}
        hasStartedCreation={hasStartedCreation}
      >
        <CreationContent
          hasStartedCreation={hasStartedCreation}
          currentIntroStep={currentIntroStep}
          isCreatingRecipe={isCreatingRecipe}
          recipeResult={recipeResult}
          creationStepData={creationStepData}
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
          onIntroNext={handleIntroNext}
          onReset={handleReset}
        />
        
        <CreationNavigation
          hasStartedCreation={hasStartedCreation}
          currentIntroStep={currentIntroStep}
          creationStep={creationStep}
          isNextDisabled={isNextDisabled}
          isCreatingRecipe={isCreatingRecipe}
          recipeResult={recipeResult}
          onIntroNext={handleIntroNext}
          onIntroPrev={handleIntroPrev}
          onIntroTransitionNext={handleIntroTransitionNext}
          onIntroTransitionPrev={handleIntroTransitionPrev}
          onCreationNext={nextCreationStep}
          onCreationPrev={prevCreationStep}
          onCreationTransitionNext={handleCreationTransitionNext}
          onCreationTransitionPrev={handleCreationTransitionPrev}
          onCreationSubmit={handleCreationTransitionSubmit}
        />
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

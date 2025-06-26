import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCreationForm } from '@/hooks/useCreationForm';
import { useCreationNavigation } from '@/hooks/useCreationNavigation';
import { useCreationProgress } from '@/hooks/useCreationProgress';
import { creationTheme } from '@/components/creation/CreationTheme';
import { getCreationTitle, shouldShowTitle } from '@/components/creation/CreationTitleHandler';
import GlobalLayout from '@/components/layout/GlobalLayout';
import CreationLayout from '@/components/creation/CreationLayout';
import CreationContent from '@/components/creation/CreationContent';
import GifTransition from '@/components/creation/GifTransition';

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
    handleReset: resetForm
  } = useCreationForm();
  
  const {
    currentIntroStep,
    hasStartedCreation,
    isTransitioning,
    transitionGifUrl,
    transitionDirection,
    transitionVariant,
    completeTransition,
    handleIntroNext,
    handleIntroPrev,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit,
    nextIntroStep,
    prevIntroStep,
    resetNavigation
  } = useCreationNavigation({
    nextCreationStep,
    prevCreationStep,
    handleSubmit
  });

  const { progress } = useCreationProgress({
    currentIntroStep,
    hasStartedCreation,
    creationStep,
    recipeResult
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

  // Combined reset function that resets both form and navigation to hero page
  const handleReset = () => {
    resetForm(); // Reset the form data
    resetNavigation(); // Reset navigation to hero page
  };

  const title = getCreationTitle({
    hasStartedCreation,
    currentIntroStep,
    creationStepData
  });

  const showTitle = shouldShowTitle(recipeResult, isCreatingRecipe, hasStartedCreation, currentIntroStep);

  // Enhanced next step handler that passes current step info
  const enhancedNextCreationStep = () => {
    handleCreationNext(creationStep);
  };

  return (
    <>
      {/* GIF Transition Overlay */}
      {isTransitioning && transitionGifUrl && (
        <GifTransition
          gifUrl={transitionGifUrl}
          isVisible={isTransitioning}
          onComplete={completeTransition}
          duration={3000}
        />
      )}

      <GlobalLayout variant="creation" showHeader={false}>
        <CreationLayout
          progress={progress}
          theme={creationTheme}
          title={title}
          showTitle={showTitle}
          hasStartedCreation={hasStartedCreation}
          isTransitioning={isTransitioning}
          transitionDirection={transitionDirection}
          transitionVariant={transitionVariant}
          completeTransition={completeTransition}
        >
          <CreationContent
            isCreatingRecipe={isCreatingRecipe}
            recipeResult={recipeResult}
            hasStartedCreation={hasStartedCreation}
            currentIntroStep={currentIntroStep}
            creationStep={creationStep}
            creationStepData={creationStepData}
            answers={answers}
            customAnswers={customAnswers}
            controlValues={controlValues}
            theme={creationTheme}
            isNextDisabled={isNextDisabled}
            onAnswerSelect={handleAnswerSelect}
            onCustomAnswerChange={handleCustomAnswerChange}
            onTemperatureChange={handleTemperatureChange}
            onShapeChange={handleShapeChange}
            onFlavorChange={handleFlavorChange}
            onEnhancerChange={handleEnhancerChange}
            nextIntroStep={nextIntroStep}
            prevIntroStep={prevIntroStep}
            prevCreationStep={prevCreationStep}
            nextCreationStep={enhancedNextCreationStep}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            handleIntroNext={handleIntroNext}
            handleIntroPrev={handleIntroPrev}
            handleCreationNext={handleCreationNext}
            handleCreationPrev={handleCreationPrev}
            handleCreationSubmit={handleCreationSubmit}
          />
        </CreationLayout>
      </GlobalLayout>
    </>
  );
};

export default Creation;

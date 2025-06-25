
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
    isTransitioning,
    transitionDirection,
    transitionVariant,
    transitionVideoUrl,
    selectedVideoUrl,
    completeTransition,
    handleIntroNext,
    handleIntroPrev,
    handleCreationNext,
    handleCreationPrev,
    handleCreationSubmit,
    nextIntroStep,
    prevIntroStep,
    selectVideo,
    clearSelection
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

  const title = getCreationTitle({
    hasStartedCreation,
    currentIntroStep,
    creationStepData
  });

  const showTitle = shouldShowTitle(recipeResult, isCreatingRecipe, hasStartedCreation, currentIntroStep);

  return (
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
        transitionVideoUrl={transitionVideoUrl}
        selectedVideoUrl={selectedVideoUrl}
        completeTransition={completeTransition}
        onVideoSelect={selectVideo}
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
          nextCreationStep={nextCreationStep}
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
  );
};

export default Creation;

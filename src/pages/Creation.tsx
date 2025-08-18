
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCreationForm } from '@/hooks/useCreationForm';
import { useCreationNavigation } from '@/hooks/useCreationNavigation';
import { useCreationProgress } from '@/hooks/useCreationProgress';
import { stepThemes } from '@/data/creation';
import { getCreationTitle, shouldShowTitle } from '@/components/creation/CreationTitleHandler';
import GlobalLayout from '@/components/layout/GlobalLayout';
import CreationLayout from '@/components/creation/CreationLayout';
import CreationContent from '@/components/creation/CreationContent';
import GifTransition from '@/components/creation/GifTransition';
import VideoTransition from '@/components/creation/VideoTransition';
import { detectTransitionFileType, isVideoFile } from '@/utils/fileTypeDetector';
import { HealthChecker } from '@/components/ui/HealthChecker';

interface OutletContextType {
  setHeaderVisible: (visible: boolean) => void;
}

const Creation = () => {
  // Add a debug flag to show health checker
  const showHealthChecker = new URLSearchParams(window.location.search).get('health') === 'true';
  
  if (showHealthChecker) {
    return (
      <div className="min-h-screen bg-background p-8">
        <HealthChecker />
      </div>
    );
  }
  const {
    currentStep: creationStep,
    currentStepData: creationStepData,
    answers,
    customAnswers,
    controlValues,
    recipeResult,
    recipeId,
    isCreatingRecipe,
    isNextDisabled,
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleEnhancerChange,
    handleTemperatureChange,
    handleShapeChange,
    handleFlavorChange,
    handleDietaryChange,
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
    handleTimelineSubmission,
    nextIntroStep,
    prevIntroStep,
    resetNavigation
  } = useCreationNavigation({
    nextCreationStep,
    prevCreationStep,
    handleSubmit,
    currentCreationStep: creationStep // Pass current creation step
  });

  const { progress } = useCreationProgress({
    currentIntroStep,
    hasStartedCreation,
    creationStep,
    recipeResult
  });

  const { setHeaderVisible } = useOutletContext<OutletContextType>() || {};

  // Get the current theme based on the creation step
  const getCurrentTheme = () => {
    if (!hasStartedCreation || creationStep >= stepThemes.length) {
      // Use the first theme for intro steps or fallback
      return stepThemes[0];
    }
    return stepThemes[creationStep];
  };

  const currentTheme = getCurrentTheme();

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

  // Determine which auto-advance function to use based on step type
  const getAutoAdvanceFunction = () => {
    if (hasStartedCreation && creationStepData?.type === 'timeline') {
      // For timeline step, return a function that accepts the selected value
      return (timelineValue?: string) => handleTimelineSubmission(timelineValue);
    }
    // For other steps, use normal navigation
    return handleCreationNext;
  };

  // Detect file type for proper transition component
  const transitionFileType = detectTransitionFileType(transitionGifUrl);
  const useVideoTransition = isVideoFile(transitionFileType);

  // Get transition text based on current step and transition URL
  const getTransitionText = () => {
    if (transitionGifUrl.includes('3d-kisson.mp4')) {
      return {
        overlayText: "A Recipe Is An Edible Algorithm",
        overlaySubtext: ""
      };
    }
    if (transitionGifUrl.includes('01step.mp4')) {
      return {
        overlayText: "Choosing The Memory",
        overlaySubtext: ""
      };
    }
    if (transitionGifUrl.includes('02step.mp4')) {
      return {
        overlayText: "Preparing The Ingredients",
        overlaySubtext: ""
      };
    }
    if (transitionGifUrl.includes('03step.mp4')) {
      return {
        overlayText: "Cooking And Dedication",
        overlaySubtext: ""
      };
    }
    if (transitionGifUrl.includes('04step.mp4')) {
      return {
        overlayText: "Adjusting And Wrapping",
        overlaySubtext: ""
      };
    }
    if (transitionGifUrl.includes('05step.mp4')) {
      return {
        overlayText: "Presentation And Final Emotions",
        overlaySubtext: ""
      };
    }
    return {
      overlayText: "Transforming",
      overlaySubtext: "Creating something beautiful"
    };
  };

  const { overlayText, overlaySubtext } = getTransitionText();

  return (
    <>
      {/* Transition Overlay - Dynamic based on file type */}
      {isTransitioning && transitionGifUrl && (
        <>
          {useVideoTransition ? (
            <VideoTransition
              videoUrl={transitionGifUrl}
              isVisible={isTransitioning}
              onComplete={completeTransition}
              duration={3000}
              isCreatingRecipe={isCreatingRecipe}
              overlayText={overlayText}
              overlaySubtext={overlaySubtext}
            />
          ) : (
            <GifTransition
              gifUrl={transitionGifUrl}
              isVisible={isTransitioning}
              onComplete={completeTransition}
              duration={3000}
              isCreatingRecipe={isCreatingRecipe}
            />
          )}
        </>
      )}

      <GlobalLayout variant="creation" showHeader={false}>
        <CreationLayout
          progress={progress}
          theme={currentTheme}
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
            recipeId={recipeId}
            hasStartedCreation={hasStartedCreation}
            currentIntroStep={currentIntroStep}
            creationStep={creationStep}
            creationStepData={creationStepData}
            answers={answers}
            customAnswers={customAnswers}
            controlValues={controlValues}
            theme={currentTheme}
            isNextDisabled={isNextDisabled}
            onAnswerSelect={handleAnswerSelect}
            onCustomAnswerChange={handleCustomAnswerChange}
            onTemperatureChange={handleTemperatureChange}
            onShapeChange={handleShapeChange}
            onFlavorChange={handleFlavorChange}
            onEnhancerChange={handleEnhancerChange}
            onDietaryChange={handleDietaryChange}
            nextIntroStep={nextIntroStep}
            prevIntroStep={prevIntroStep}
            prevCreationStep={prevCreationStep}
            nextCreationStep={getAutoAdvanceFunction()} // Use the appropriate auto-advance function
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

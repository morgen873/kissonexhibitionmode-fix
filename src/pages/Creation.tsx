
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useCreationForm } from '@/hooks/useCreationForm';
import { useCreationNavigation } from '@/hooks/useCreationNavigation';
import { useCreationProgress } from '@/hooks/useCreationProgress';
import { useErrorRecovery } from '@/hooks/useErrorRecovery';
import { stepThemes } from '@/data/creation';
import { getCreationTitle, shouldShowTitle } from '@/components/creation/CreationTitleHandler';
import GlobalLayout from '@/components/layout/GlobalLayout';
import CreationLayout from '@/components/creation/CreationLayout';
import CreationContent from '@/components/creation/CreationContent';
import GifTransition from '@/components/creation/GifTransition';
import VideoTransition from '@/components/creation/VideoTransition';
import { ErrorRecoveryPanel } from '@/components/creation/ErrorRecoveryPanel';
import { detectTransitionFileType, isVideoFile } from '@/utils/fileTypeDetector';

interface OutletContextType {
  setHeaderVisible: (visible: boolean) => void;
}

const Creation = () => {
  const { error, isRecovering, retryCount, retry, forceRefresh } = useErrorRecovery();
  
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
    nextStep: nextCreationStep,
    prevStep: prevCreationStep,
    handleSubmit,
    handleReset: resetForm,
    handleResetWithRecovery,
    clearBrowserState,
    clearError
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

  // Enhanced reset with recovery
  const handleResetWithRecoveryAndNav = () => {
    handleResetWithRecovery(); // Reset with recovery
    resetNavigation(); // Reset navigation to hero page
  };

  // Add keyboard shortcut for debug panel (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        console.log('🔧 Debug Tools Available:');
        console.log('- window.creationDebug: State debugging functions');
        console.log('- Call window.creationDebug.clearBrowserState() to clear all data');
        console.log('- Call window.creationDebug.recoverState() to recover from backup');
        if ((window as any).creationDebug) {
          console.log('Current state:', (window as any).creationDebug.currentState);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <>
      {/* Error Recovery Panel */}
      <ErrorRecoveryPanel
        isVisible={!!error && retryCount > 2} // Show after multiple failures
        error={error}
        retryCount={retryCount}
        isRecovering={isRecovering}
        onRetry={retry}
        onClearState={clearBrowserState}
        onResetWithRecovery={handleResetWithRecoveryAndNav}
        onForceRefresh={forceRefresh}
        onClose={clearError}
      />

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

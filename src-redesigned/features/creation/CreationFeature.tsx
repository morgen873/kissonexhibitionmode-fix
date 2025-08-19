import React, { useEffect } from 'react';
import { useCreationFlow } from './hooks/useCreationFlow';
import { useTransitionManager } from './hooks/useTransitionManager';
import { CreationLayout } from './components/CreationLayout';
import { CreationContent } from './components/CreationContent';
import { TransitionOverlay } from './components/TransitionOverlay';
import { HealthChecker } from '@/shared/components/ui/health-checker';

/**
 * Main feature component for the recipe creation flow
 * Orchestrates the entire creation experience
 */
const CreationFeature: React.FC = () => {
  // Check for debug health checker
  const showHealthChecker = new URLSearchParams(window.location.search).get('health') === 'true';
  
  if (showHealthChecker) {
    return (
      <div className="min-h-screen bg-background p-8">
        <HealthChecker />
      </div>
    );
  }

  const {
    // Current state
    currentStep,
    currentStepData,
    currentTheme,
    progress,
    
    // User data
    answers,
    customAnswers,
    controlValues,
    
    // Recipe state
    recipeResult,
    recipeId,
    isCreatingRecipe,
    
    // Navigation
    hasStartedCreation,
    canGoNext,
    canGoPrevious,
    
    // Actions
    handleAnswerSelect,
    handleCustomAnswerChange,
    handleControlChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleReset,
  } = useCreationFlow();

  const {
    // Transition state
    isTransitioning,
    transitionConfig,
    
    // Transition actions
    startTransition,
    completeTransition,
  } = useTransitionManager();

  // Start transition before navigation
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        completeTransition();
      }, transitionConfig.duration);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, transitionConfig.duration, completeTransition]);

  const title = currentStepData?.title || '';
  const showTitle = Boolean(title && !isCreatingRecipe && hasStartedCreation);

  return (
    <>
      {/* Transition Overlay */}
      {isTransitioning && (
        <TransitionOverlay
          config={transitionConfig}
          onComplete={completeTransition}
        />
      )}

      <CreationLayout
        progress={progress}
        theme={currentTheme}
        title={title}
        showTitle={showTitle}
        hasStartedCreation={hasStartedCreation}
        isTransitioning={isTransitioning}
      >
        <CreationContent
          // Current step
          currentStep={currentStep}
          currentStepData={currentStepData}
          theme={currentTheme}
          
          // State
          hasStartedCreation={hasStartedCreation}
          answers={answers}
          customAnswers={customAnswers}
          controlValues={controlValues}
          
          // Recipe state
          isCreatingRecipe={isCreatingRecipe}
          recipeResult={recipeResult}
          recipeId={recipeId}
          
          // Navigation state
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          
          // Event handlers
          onAnswerSelect={handleAnswerSelect}
          onCustomAnswerChange={handleCustomAnswerChange}
          onControlChange={handleControlChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onStartTransition={startTransition}
        />
      </CreationLayout>
    </>
  );
};

export default CreationFeature;
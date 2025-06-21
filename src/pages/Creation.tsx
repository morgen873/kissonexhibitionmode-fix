import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { steps, stepThemes } from '@/data/creation';
import { QuestionStep, ControlsStep, TimelineStep } from '@/types/creation';
import ProgressBar from '@/components/creation/ProgressBar';
import ExplanationScreen from '@/components/creation/ExplanationScreen';
import QuestionScreen from '@/components/creation/QuestionScreen';
import NavigationControls from '@/components/creation/NavigationControls';
import ControlsScreen from '@/components/creation/ControlsScreen';
import TimelineScreen from '@/components/creation/TimelineScreen';
import RecipeResultScreen from '@/components/creation/RecipeResultScreen';
import { Loader2 } from 'lucide-react';
import { useCreationForm } from '@/hooks/useCreationForm';
import { introSteps } from "@/data/introSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const renderIntroStepContent = (step: any) => {
    switch (step.type) {
      case 'hero':
        return <div className="text-center max-w-sm mx-auto px-4">
                        <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="KissOn Logo" className="mx-auto mb-6 w-48 filter grayscale" />
                        
                        <p className="text-lg text-white font-bold mb-8 font-mono">
                            {step.description}
                        </p>
                        <Button onClick={nextIntroStep} size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-8 py-4 text-xl rounded-xl font-mono">
                            {step.buttonText}
                        </Button>
                    </div>;
      case 'explanation':
        const Icon = step.icon;
        return <Card className="bg-transparent border-4 border-white/20 transition-all duration-300 shadow-2xl shadow-black/25 w-full max-w-sm mx-auto">
                        <CardContent className="p-4">
                            {Icon && <div className="w-16 h-16 bg-gradient-to-r from-black via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon className="h-8 w-8 text-white" />
                            </div>}
                            <h3 className="font-black text-white mb-4 drop-shadow-lg text-2xl text-center font-mono">
                                {(step.title as string[])[0]}
                                <br />
                                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                                    {(step.title as string[])[1]}
                                </span>
                            </h3>
                            <p className="text-white font-bold text-sm text-center font-mono">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>;
      case 'quote':
        return <div className="text-center max-w-sm mx-auto px-4">
                        <blockquote className="text-3xl md:text-4xl font-black leading-tight mb-6 font-mono">
                            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
                                {step.title}
                            </span>
                        </blockquote>
                        <p className="text-xl text-white font-black mb-8 font-mono">
                            {step.description}
                        </p>
                    </div>;
      default:
        return null;
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-3 sm:p-4 flex flex-col items-center justify-start transition-all duration-300 pt-16`}>
      {/* Simplified background effects - no blur */}
      {!hasStartedCreation && (
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-800 via-black to-gray-800"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-gray-600 to-black rounded-full"></div>
          <div className="absolute top-60 right-10 w-48 h-48 bg-gradient-to-r from-black to-gray-700 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-gray-500 to-black rounded-full"></div>
        </div>
      )}

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Progress Bar at top */}
        <div className="w-full">
          <ProgressBar progress={progress} theme={theme} />
        </div>

        {/* Main Content Card - adjusted for 9:16 */}
        <Card className={`relative w-full mx-auto bg-black/50 border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-opacity duration-300`}>
          <CardHeader className="p-4">
            {!recipeResult && !isCreatingRecipe && (
              <CardTitle className={`text-xl md:text-2xl font-black text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[80px] flex items-center justify-center font-mono`}>
                {!hasStartedCreation 
                  ? introSteps[currentIntroStep].title 
                  : (creationStepData.type === 'question' ? creationStepData.question : creationStepData.title)
                }
              </CardTitle>
            )}
          </CardHeader>
          
          <CardContent className="p-4">
            {isCreatingRecipe ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
                <p className="text-lg font-semibold text-white/80 font-mono">Creating your recipe...</p>
              </div>
            ) : recipeResult ? (
              <div>
                <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />
              </div>
            ) : (
              <div className="transition-opacity duration-300">
                {!hasStartedCreation ? (
                  <main className="flex flex-col items-center justify-center flex-grow w-full">
                    {renderIntroStepContent(introSteps[currentIntroStep])}
                  </main>
                ) : (
                  <>
                    {creationStepData.type === 'explanation' ? (
                      <ExplanationScreen description={creationStepData.description} />
                    ) : creationStepData.type === 'question' ? (
                      <QuestionScreen 
                        stepData={creationStepData as QuestionStep} 
                        answers={answers} 
                        handleAnswerSelect={handleAnswerSelect} 
                        customAnswers={customAnswers} 
                        handleCustomAnswerChange={handleCustomAnswerChange} 
                        theme={theme} 
                      />
                    ) : creationStepData.type === 'timeline' ? (
                      <TimelineScreen 
                        stepData={creationStepData as TimelineStep} 
                        selectedValue={answers[creationStepData.id] || ''} 
                        onSelect={handleAnswerSelect} 
                        theme={theme} 
                      />
                    ) : creationStepData.type === 'controls' && controlValues[creationStepData.id] ? (
                      <ControlsScreen 
                        stepData={creationStepData as ControlsStep} 
                        controlValues={controlValues[creationStepData.id]} 
                        onTemperatureChange={handleTemperatureChange} 
                        onShapeChange={handleShapeChange} 
                        onFlavorChange={handleFlavorChange} 
                        onEnhancerChange={handleEnhancerChange} 
                      />
                    ) : null}
                  </>
                )}
                
                {/* Navigation Controls */}
                {!hasStartedCreation ? (
                  introSteps[currentIntroStep].type !== 'hero' && (
                    <div className="w-full mt-6">
                      <div className="flex justify-between items-center">
                        <Button onClick={prevIntroStep} variant="ghost" className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm" disabled={currentIntroStep === 0}>
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <div className="flex items-center space-x-2">
                          {introSteps.slice(1, 4).map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full transition-colors ${currentIntroStep === index + 1 ? 'bg-white' : 'bg-white/30'}`} />
                          ))}
                        </div>
                        <Button onClick={nextIntroStep} className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm">
                          {currentIntroStep === introSteps.length - 1 ? introSteps[currentIntroStep].buttonText : 'Next'}
                        </Button>
                      </div>
                    </div>
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
          </CardContent>
        </Card>
      </div>

      {/* Footer for intro flow - made more compact */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-black/50 text-white mt-6 w-full text-center border-t-2 border-white/20 py-3">
          <p className="text-sm font-black font-mono">
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </div>
  );
};

export default Creation;

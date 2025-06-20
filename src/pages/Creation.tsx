
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
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

  // Enhanced transition handling
  const handleStepTransition = (transitionFn: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      transitionFn();
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
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
        return <div className="text-center max-w-6xl mx-0 px-0 bg-inherit my-0 py-0">
                        <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="KissOn Logo" className="mx-auto mb-8 w-64 mix-blend-screen" />
                        
                        <p className="text-xl text-white font-bold max-w-3xl mx-auto drop-shadow-lg mb-12 md:text-xl">
                            {step.description}
                        </p>
                        <Button onClick={nextIntroStep} size="lg" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm px-10 py-6 text-2xl rounded-2xl bg-inherit">
                            {step.buttonText}
                            <ArrowRight className="ml-3 h-6 w-6" />
                        </Button>
                    </div>;
      case 'explanation':
        const Icon = step.icon;
        return <Card className={`bg-transparent border-4 ${step.theme?.border} backdrop-blur-md transition-all duration-300 shadow-2xl ${step.theme?.shadow} w-full max-w-md`}>
                        <CardContent className="p-10 text-center my-0 mx-0 py-[10px] px-[10px]">
                            {Icon && <div className={`w-20 h-20 bg-gradient-to-r ${step.theme?.iconGradient} rounded-full flex items-center justify-center mx-auto mb-8`}>
                                <Icon className="h-10 w-10 text-white" />
                            </div>}
                            <h3 className="font-black text-white mb-6 drop-shadow-lg text-3xl">
                                {(step.title as string[])[0]}
                                <br />
                                <span className={`bg-gradient-to-r ${step.theme?.titleGradient} bg-clip-text text-transparent`}>
                                    {(step.title as string[])[1]}
                                </span>
                            </h3>
                            <p className="text-white font-bold py-[10px] text-base">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>;
      case 'quote':
        return <div className="text-center max-w-4xl mx-auto">
                        <blockquote className="text-4xl md:text-6xl font-black leading-tight mb-8">
                            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                                {step.title}
                            </span>
                        </blockquote>
                        <p className="text-2xl text-white font-black mb-12">
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

  // Determine current theme
  let theme;
  if (!hasStartedCreation) {
    theme = { 
      bg: "from-purple-900 via-pink-900 to-orange-900",
      progress: "from-pink-500 to-purple-500",
      cardShadow: "shadow-purple-500/25"
    };
  } else {
    theme = stepThemes[creationStep] || stepThemes[0];
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start transition-all duration-700 ease-out pt-24`}>
      {/* Background effects for intro */}
      {!hasStartedCreation && (
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient py-0 px-0 my-0 mx-0"></div>
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-60 right-10 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Progress Bar at top */}
        <div className="w-full animate-breathe-in">
          <ProgressBar progress={progress} theme={theme} />
        </div>

        {/* Main Content Card */}
        <Card className={`relative w-full ${recipeResult ? 'max-w-4xl' : 'max-w-2xl'} mx-auto bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-all duration-700 ease-out transform ${isTransitioning ? 'animate-morph-out' : 'animate-morph-in'}`}>
          <CardHeader className="animate-flow-up">
            {!recipeResult && !isCreatingRecipe && (
              <CardTitle className={`text-2xl md:text-3xl font-black text-center bg-gradient-to-r ${theme.title || 'from-white to-white'} bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center transition-all duration-700 ease-out`}>
                {!hasStartedCreation 
                  ? introSteps[currentIntroStep].title 
                  : (creationStepData.type === 'question' ? creationStepData.question : creationStepData.title)
                }
              </CardTitle>
            )}
          </CardHeader>
          
          <CardContent className="py-0 px-0 mx-[15px]">
            {isCreatingRecipe ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-breathe-in">
                <Loader2 className="h-16 w-16 animate-spin text-white" />
                <p className="text-2xl font-semibold text-white/80 animate-flow-up">Creating your recipe...</p>
              </div>
            ) : recipeResult ? (
              <div className="animate-slide-morph-in">
                <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />
              </div>
            ) : (
              <div className={`transition-all duration-500 ${isTransitioning ? 'animate-morph-out' : 'animate-content-transition stagger-children'}`}>
                {!hasStartedCreation ? (
                  <main className="flex flex-col items-center justify-center flex-grow w-full my-[29px]">
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
                    <div className="w-full max-w-2xl mt-8">
                      <div className="flex justify-between items-center">
                        <Button onClick={prevIntroStep} variant="ghost" className="text-white hover:bg-white/10 disabled:opacity-50" disabled={currentIntroStep === 0}>
                          <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <div className="flex items-center space-x-2">
                          {introSteps.slice(1, 4).map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full transition-colors ${currentIntroStep === index + 1 ? 'bg-white' : 'bg-white/30'}`} />
                          ))}
                        </div>
                        <Button onClick={nextIntroStep} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          {currentIntroStep === introSteps.length - 1 ? introSteps[currentIntroStep].buttonText : 'Next'} <ArrowRight className="ml-2" />
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

      {/* Footer for intro flow */}
      {!hasStartedCreation && (
        <footer className="relative z-10 bg-black/50 backdrop-blur-md text-white mt-8 w-full text-center border-t-2 border-white/20 py-[10px] my-[30px]">
          <p className="text-lg font-black">
            A DESIGN PROJECT BY <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
          </p>
        </footer>
      )}
    </div>
  );
};

export default Creation;

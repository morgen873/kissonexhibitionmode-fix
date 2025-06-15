
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

const Creation = () => {
    const {
        currentStep,
        currentStepData,
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
        nextStep,
        prevStep,
        handleSubmit,
        handleReset,
    } = useCreationForm();

    const progress = recipeResult ? 100 : ((currentStep + 1) / steps.length) * 100;
    const theme = stepThemes[currentStep] || stepThemes[0];
    
    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-4 sm:p-6 md:p-8 flex items-center justify-center transition-all duration-500`}>
            <Card className={`w-full ${recipeResult ? 'max-w-4xl' : 'max-w-2xl'} bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-all duration-500`}>
                <CardHeader>
                    <ProgressBar progress={progress} theme={theme} />
                    {!recipeResult && !isCreatingRecipe && (
                        <CardTitle className={`text-2xl md:text-3xl font-black text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center transition-all duration-500`}>
                            {currentStepData.type === 'question' ? currentStepData.question : currentStepData.title}
                        </CardTitle>
                    )}
                </CardHeader>
                <CardContent>
                    {isCreatingRecipe ? (
                        <div className="flex flex-col items-center justify-center h-96 space-y-4">
                            <Loader2 className="h-16 w-16 animate-spin text-white" />
                            <p className="text-2xl font-semibold text-white/80">Creating your recipe...</p>
                        </div>
                    ) : recipeResult ? (
                        <RecipeResultScreen recipe={recipeResult} onReset={handleReset} />
                    ) : (
                        <>
                            {currentStepData.type === 'explanation' ? (
                                <ExplanationScreen description={currentStepData.description} />
                            ) : currentStepData.type === 'question' ? (
                                <QuestionScreen
                                    stepData={currentStepData as QuestionStep}
                                    answers={answers}
                                    handleAnswerSelect={handleAnswerSelect}
                                    customAnswers={customAnswers}
                                    handleCustomAnswerChange={handleCustomAnswerChange}
                                    theme={theme}
                                />
                            ) : currentStepData.type === 'timeline' ? (
                                <TimelineScreen
                                    stepData={currentStepData as TimelineStep}
                                    selectedValue={answers[currentStepData.id] || ''}
                                    onSelect={handleAnswerSelect}
                                    theme={theme}
                                />
                            ) : (currentStepData.type === 'controls' && controlValues[currentStepData.id]) ? (
                                <ControlsScreen
                                    stepData={currentStepData as ControlsStep}
                                    controlValues={controlValues[currentStepData.id]}
                                    onTemperatureChange={handleTemperatureChange}
                                    onShapeChange={handleShapeChange}
                                    onFlavorChange={handleFlavorChange}
                                    onEnhancerChange={handleEnhancerChange}
                                />
                            ) : null}
                            <NavigationControls
                                currentStep={currentStep}
                                stepsLength={steps.length}
                                prevStep={prevStep}
                                nextStep={nextStep}
                                handleSubmit={handleSubmit}
                                isNextDisabled={isNextDisabled}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Creation;

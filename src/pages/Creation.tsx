import React, { useState, useEffect } from 'react';
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

interface RecipeResult {
    name: string;
    imageUrl: string;
    qrData: string;
}

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
    const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});
    const [recipeResult, setRecipeResult] = useState<RecipeResult | null>(null);
    const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

    const currentStepData = steps[currentStep];

    useEffect(() => {
        if (currentStepData.type === 'controls' && !controlValues[currentStepData.id]) {
            const { controls } = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    temperature: controls.temperature.defaultValue,
                    shape: controls.shape.defaultValue,
                    flavor: controls.flavor.defaultValue,
                    enhancer: '',
                }
            }));
        }
    }, [currentStep, currentStepData, controlValues]);

    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question' || step.type === 'timeline') {
            setAnswers({ ...answers, [step.id]: optionTitle });
        }
    };

    const handleCustomAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const step = steps[currentStep];
        if (step.type === 'question') {
            setCustomAnswers({
                ...customAnswers,
                [step.id]: e.target.value,
            });
        }
    };

    const handleEnhancerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (currentStepData.type === 'controls') {
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    enhancer: e.target.value
                }
            }));
        }
    };

    const handleTemperatureChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    temperature: value
                }
            }));
        }
    };
    
    const handleShapeChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    shape: step.controls.shape.options[value]
                }
            }));
        }
    };

    const handleFlavorChange = (value: number) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    flavor: step.controls.flavor.options[value]
                }
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleSubmit = async () => {
        setIsCreatingRecipe(true);
        const questionAnswers: { [key:string]: string } = {};
        const timelineAnswers: { [key: string]: string } = {};

        Object.entries(answers).forEach(([stepId, answer]) => {
            const step = steps.find(s => 'id' in s && s.id === Number(stepId));
            if (step) {
                if (step.type === 'question') {
                    const questionStep = step as QuestionStep;
                    if (questionStep.customOption && answer === questionStep.customOption.title) {
                        questionAnswers[stepId] = customAnswers[Number(stepId)] || '';
                    } else {
                        questionAnswers[stepId] = answer;
                    }
                } else if (step.type === 'timeline') {
                    timelineAnswers[stepId] = answer;
                }
            }
        });

        const finalPayload = {
            questions: questionAnswers,
            timeline: timelineAnswers,
            controls: controlValues,
        };

        console.log("Final payload:", finalPayload);
        
        // This is where you'll call your API.
        // For now, we simulate a delay and use mock data.
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockRecipe: RecipeResult = {
            name: "Spicy Sichuan Wontons",
            imageUrl: "/placeholder.svg", // Replace with actual image URL from API
            qrData: "https://example.com/recipe/spicy-sichuan-wontons" // Replace with data for QR code
        };

        setRecipeResult(mockRecipe);
        setIsCreatingRecipe(false);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers({});
        setCustomAnswers({});
        setControlValues({});
        setRecipeResult(null);
        setIsCreatingRecipe(false);
    };

    const progress = recipeResult ? 100 : ((currentStep + 1) / steps.length) * 100;
    const theme = stepThemes[currentStep] || stepThemes[0];
    
    const isNextDisabled = (() => {
        if (currentStepData.type === 'question') {
            const answer = answers[currentStepData.id];
            if (!answer) return true;

            if (currentStepData.customOption && answer === currentStepData.customOption.title) {
                const customAnswer = customAnswers[currentStepData.id];
                return !customAnswer || !customAnswer.trim();
            }
        }
        if (currentStepData.type === 'timeline') {
            const answer = answers[currentStepData.id];
            if (!answer) return true;
        }
        return false;
    })();

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

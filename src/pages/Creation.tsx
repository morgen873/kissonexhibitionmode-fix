import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { steps, stepThemes } from '@/data/creation';
import { QuestionStep, ControlsStep } from '@/types/creation';
import ProgressBar from '@/components/creation/ProgressBar';
import ExplanationScreen from '@/components/creation/ExplanationScreen';
import QuestionScreen from '@/components/creation/QuestionScreen';
import NavigationControls from '@/components/creation/NavigationControls';
import ControlsScreen from '@/components/creation/ControlsScreen';

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
    const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; } }>({});

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
                }
            }));
        }
    }, [currentStep, currentStepData, controlValues]);

    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question') {
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

    const handleTemperatureChange = (value: number[]) => {
        if (currentStepData.type === 'controls') {
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    temperature: value[0]
                }
            }));
        }
    };
    
    const handleShapeChange = (value: number[]) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    shape: step.controls.shape.options[value[0]]
                }
            }));
        }
    };

    const handleFlavorChange = (value: number[]) => {
        if (currentStepData.type === 'controls') {
            const step = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    ...prev[currentStepData.id],
                    flavor: step.controls.flavor.options[value[0]]
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
    
    const handleSubmit = () => {
        const finalAnswersPayload = Object.entries(answers).reduce((acc, [stepId, answer]) => {
            const step = steps.find(s => s.type === 'question' && s.id === Number(stepId)) as QuestionStep | undefined;
            if (step && step.customOption && answer === step.customOption.title) {
                acc[stepId] = customAnswers[Number(stepId)] || '';
            } else {
                acc[stepId] = answer;
            }
            return acc;
        }, {} as { [key: string]: string });

        const finalPayload = {
            questions: finalAnswersPayload,
            controls: controlValues,
        };

        console.log("Final payload:", finalPayload);
        alert("Recipe is being created with your answers!");
    };

    const progress = ((currentStep + 1) / steps.length) * 100;
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
        return false;
    })();

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-4 sm:p-6 md:p-8 flex items-center justify-center transition-all duration-500`}>
            <Card className={`w-full max-w-2xl bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-all duration-500`}>
                <CardHeader>
                    <ProgressBar progress={progress} theme={theme} />
                    <CardTitle className={`text-2xl md:text-3xl font-black text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center transition-all duration-500`}>
                        {currentStepData.type === 'question' ? currentStepData.question : currentStepData.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                    ) : (currentStepData.type === 'controls' && controlValues[currentStepData.id]) ? (
                        <ControlsScreen
                            stepData={currentStepData as ControlsStep}
                            controlValues={controlValues[currentStepData.id]}
                            onTemperatureChange={handleTemperatureChange}
                            onShapeChange={handleShapeChange}
                            onFlavorChange={handleFlavorChange}
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
                </CardContent>
            </Card>
        </div>
    );
};

export default Creation;

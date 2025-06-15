
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { steps, stepThemes } from '@/data/creation';
import { QuestionStep } from '@/types/creation';
import ProgressBar from '@/components/creation/ProgressBar';
import ExplanationScreen from '@/components/creation/ExplanationScreen';
import QuestionScreen from '@/components/creation/QuestionScreen';
import NavigationControls from '@/components/creation/NavigationControls';

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});

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

        console.log("Final answers:", finalAnswersPayload);
        alert("Recipe is being created with your answers!");
    };

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentStepData = steps[currentStep];
    const theme = stepThemes[currentStep] || stepThemes[0];
    
    const isNextDisabled = (() => {
        if (currentStepData.type !== 'question') return false;

        const answer = answers[currentStepData.id];
        if (!answer) return true;

        if (currentStepData.customOption && answer === currentStepData.customOption.title) {
            const customAnswer = customAnswers[currentStepData.id];
            return !customAnswer || !customAnswer.trim();
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
                    ) : (
                        <QuestionScreen
                            stepData={currentStepData as QuestionStep}
                            answers={answers}
                            handleAnswerSelect={handleAnswerSelect}
                            customAnswers={customAnswers}
                            handleCustomAnswerChange={handleCustomAnswerChange}
                            theme={theme}
                        />
                    )}
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

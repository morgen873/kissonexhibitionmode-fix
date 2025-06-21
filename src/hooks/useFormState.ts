
import { useState } from 'react';

export const useFormState = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
    const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const resetState = () => {
        setCurrentStep(0);
        setAnswers({});
        setCustomAnswers({});
        setControlValues({});
    };

    return {
        currentStep,
        answers,
        customAnswers,
        controlValues,
        setCurrentStep,
        setAnswers,
        setCustomAnswers,
        setControlValues,
        nextStep,
        prevStep,
        resetState
    };
};

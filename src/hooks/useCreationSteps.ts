
import { useState } from 'react';
import { steps } from '@/data/creation';

export const useCreationSteps = () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const currentStepData = steps[currentStep];

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const resetStep = () => {
        setCurrentStep(0);
    };

    return {
        currentStep,
        currentStepData,
        setCurrentStep,
        nextStep,
        prevStep,
        resetStep
    };
};

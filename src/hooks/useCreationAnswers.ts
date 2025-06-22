
import { useState } from 'react';
import { useAnswerHandlers } from './useAnswerHandlers';
import { useControlsInitialization } from './useControlsInitialization';

export const useCreationAnswers = (currentStep: number) => {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});
    const [controlValues, setControlValues] = useState<{ [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }>({});

    useControlsInitialization({
        currentStep,
        controlValues,
        setControlValues
    });

    const {
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange
    } = useAnswerHandlers({
        answers,
        customAnswers,
        controlValues,
        setAnswers,
        setCustomAnswers,
        setControlValues,
        currentStep
    });

    const resetAnswers = () => {
        setAnswers({});
        setCustomAnswers({});
        setControlValues({});
    };

    return {
        answers,
        customAnswers,
        controlValues,
        setAnswers,
        setCustomAnswers,
        setControlValues,
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange,
        resetAnswers
    };
};

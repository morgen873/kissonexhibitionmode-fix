
import { steps } from '@/data/creation';
import { ControlsStep } from '@/types/creation';

interface UseAnswerHandlersProps {
    answers: { [key: number]: string | string[] };
    customAnswers: { [key: number]: string };
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
    setAnswers: (answers: { [key: number]: string | string[] }) => void;
    setCustomAnswers: (customAnswers: { [key: number]: string }) => void;
    setControlValues: (controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } } | ((prev: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }) => { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } })) => void;
    currentStep: number;
}

export const useAnswerHandlers = ({
    answers,
    customAnswers,
    controlValues,
    setAnswers,
    setCustomAnswers,
    setControlValues,
    currentStep
}: UseAnswerHandlersProps) => {
    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question' || step.type === 'timeline') {
            if (step.type === 'question' && step.multiSelect) {
                // Handle multi-select for question steps
                const currentAnswers = Array.isArray(answers[step.id]) ? answers[step.id] as string[] : [];
                const isSelected = currentAnswers.includes(optionTitle);
                
                if (isSelected) {
                    // Remove the option if already selected
                    const newAnswers = currentAnswers.filter(answer => answer !== optionTitle);
                    setAnswers({ ...answers, [step.id]: newAnswers });
                } else {
                    // Add the option to the array
                    setAnswers({ ...answers, [step.id]: [...currentAnswers, optionTitle] });
                }
            } else {
                // Handle single-select (existing behavior)
                setAnswers({ ...answers, [step.id]: optionTitle });
            }
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
        const currentStepData = steps[currentStep];
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
        const currentStepData = steps[currentStep];
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
        const currentStepData = steps[currentStep];
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
        const currentStepData = steps[currentStep];
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

    return {
        handleAnswerSelect,
        handleCustomAnswerChange,
        handleEnhancerChange,
        handleTemperatureChange,
        handleShapeChange,
        handleFlavorChange
    };
};

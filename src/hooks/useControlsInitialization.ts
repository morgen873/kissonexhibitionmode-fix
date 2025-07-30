
import { useEffect } from 'react';
import { steps } from '@/data/creation';
import { ControlsStep } from '@/types/creation';

interface UseControlsInitializationProps {
    currentStep: number;
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } };
    setControlValues: (controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } } | ((prev: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } }) => { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } })) => void;
}

export const useControlsInitialization = ({
    currentStep,
    controlValues,
    setControlValues
}: UseControlsInitializationProps) => {
    useEffect(() => {
        const currentStepData = steps[currentStep];
        if (currentStepData.type === 'controls' && !controlValues[currentStepData.id]) {
            const { controls } = currentStepData as ControlsStep;
            setControlValues(prev => ({
                ...prev,
                [currentStepData.id]: {
                    temperature: controls.temperature.defaultValue,
                    shape: controls.shape.defaultValue,
                    flavor: controls.flavor.defaultValue,
                    enhancer: '',
                    dietary: {
                        vegan: false,
                        vegetarian: false,
                        allergies: '',
                        specialDiet: false,
                    }
                }
            }));
        }
    }, [currentStep, controlValues, setControlValues]);
};

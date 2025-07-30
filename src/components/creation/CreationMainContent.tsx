
import React from 'react';
import { QuestionStep, ControlsStep, TimelineStep } from '@/types/creation';
import ExplanationScreen from './ExplanationScreen';
import QuestionScreen from './QuestionScreen';
import ControlsScreen from './ControlsScreen';
import TimelineScreen from './TimelineScreen';
import { containsProfanity } from '@/utils/profanityFilter';

interface CreationMainContentProps {
    stepData: any;
    answers: { [key: number]: string | string[] };
    customAnswers: { [key: number]: string };
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } };
    theme: {
        optionSelectedBorder: string;
        optionSelectedShadow: string;
        optionHover: string;
        textAreaFocus: string;
    };
    onAnswerSelect: (optionTitle: string) => void;
    onCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onTemperatureChange: (value: number) => void;
    onShapeChange: (value: number) => void;
    onFlavorChange: (value: number) => void;
    onEnhancerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onDietaryChange: (field: 'vegan' | 'vegetarian' | 'allergies' | 'specialDiet', value: boolean | string) => void;
    onAutoAdvance?: () => void;
}

const CreationMainContent: React.FC<CreationMainContentProps> = ({
    stepData,
    answers,
    customAnswers,
    controlValues,
    theme,
    onAnswerSelect,
    onCustomAnswerChange,
    onTemperatureChange,
    onShapeChange,
    onFlavorChange,
    onEnhancerChange,
    onDietaryChange,
    onAutoAdvance
}) => {
    // Create a profanity-filtered enhancer change handler
    const handleEnhancerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        
        // Check for profanity and only update if no profanity is detected
        if (!containsProfanity(text)) {
            onEnhancerChange(e);
        }
    };

    if (stepData.type === 'explanation') {
        return <ExplanationScreen description={stepData.description} />;
    }

    if (stepData.type === 'question') {
        return (
            <QuestionScreen 
                stepData={stepData as QuestionStep} 
                answers={answers} 
                handleAnswerSelect={onAnswerSelect} 
                customAnswers={customAnswers} 
                handleCustomAnswerChange={onCustomAnswerChange} 
                onAutoAdvance={onAutoAdvance}
                theme={theme} 
            />
        );
    }

    if (stepData.type === 'timeline') {
        return (
            <TimelineScreen 
                stepData={stepData as TimelineStep} 
                selectedValue={(() => {
                    const answer = answers[stepData.id];
                    return Array.isArray(answer) ? answer[0] || '' : answer || '';
                })()}
                onSelect={onAnswerSelect} 
                onAutoAdvance={onAutoAdvance}
                theme={theme} 
            />
        );
    }

    if (stepData.type === 'controls' && controlValues[stepData.id]) {
        return (
            <ControlsScreen 
                stepData={stepData as ControlsStep} 
                controlValues={controlValues[stepData.id]} 
                onTemperatureChange={onTemperatureChange} 
                onShapeChange={onShapeChange} 
                onFlavorChange={onFlavorChange} 
                onEnhancerChange={handleEnhancerChange} 
                onDietaryChange={onDietaryChange}
            />
        );
    }

    return null;
};

export default CreationMainContent;

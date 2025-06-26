
import React, { useState } from 'react';
import { QuestionStep } from '@/types/creation';
import { containsProfanity } from '@/utils/profanityFilter';

interface QuestionScreenProps {
    stepData: QuestionStep;
    answers: { [key: number]: string };
    handleAnswerSelect: (optionTitle: string) => void;
    customAnswers: { [key: number]: string };
    handleCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    theme: {
        optionSelectedBorder: string;
        optionSelectedShadow: string;
        optionHover: string;
        textAreaFocus: string;
    };
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
    stepData,
    answers,
    handleAnswerSelect,
    customAnswers,
    handleCustomAnswerChange,
    theme
}) => {
    const [profanityWarning, setProfanityWarning] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        
        // Check for profanity
        if (containsProfanity(text)) {
            setProfanityWarning(true);
            // Don't update the value if it contains profanity
            return;
        } else {
            setProfanityWarning(false);
            handleCustomAnswerChange(e);
        }
    };

    // Separate regular options from custom option
    const regularOptions = stepData.options;
    const hasCustomOption = stepData.customOption;

    return (
        <>
            {/* Grid layout for regular options */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {regularOptions.map((option) => (
                    <div
                        key={option.title}
                        onClick={() => handleAnswerSelect(option.title)}
                        className={`
                            p-4 rounded-lg transition-all duration-300 cursor-pointer font-mono text-center
                            ${answers[stepData.id] === option.title
                                ? `bg-white/20 border-2 ${theme.optionSelectedBorder} scale-105 shadow-lg ${theme.optionSelectedShadow}`
                                : `bg-white/10 border-2 border-white/20 ${theme.optionHover}`
                            }
                        `}
                    >
                        <h4 className="font-bold text-base text-white font-mono text-center">{option.title}</h4>
                        <p className="text-sm text-white/80 mt-2 font-mono text-center">{option.description}</p>
                    </div>
                ))}
            </div>

            {/* Custom option spanning full width */}
            {hasCustomOption && (
                <div className="w-full">
                    <div
                        onClick={() => handleAnswerSelect(stepData.customOption!.title)}
                        className={`
                            p-4 rounded-lg transition-all duration-300 cursor-pointer font-mono text-center w-full
                            ${answers[stepData.id] === stepData.customOption!.title
                                ? `bg-white/20 border-2 ${theme.optionSelectedBorder} scale-105 shadow-lg ${theme.optionSelectedShadow}`
                                : `bg-white/10 border-2 border-white/20 ${theme.optionHover}`
                            }
                        `}
                    >
                        <h4 className="font-bold text-base text-white font-mono text-center">{stepData.customOption!.title}</h4>
                        <p className="text-sm text-white/80 mt-2 font-mono text-center">Share your own special memory</p>
                    </div>

                    {/* Custom textarea when selected */}
                    {answers[stepData.id] === stepData.customOption!.title && (
                        <div className="mt-4">
                            <label htmlFor="custom-answer" className="block text-sm font-medium text-white/80 mb-2 font-mono text-center">
                                {stepData.customOption!.title}:
                            </label>
                            <textarea
                                id="custom-answer"
                                rows={4}
                                className={`w-full bg-white/10 border-white/20 rounded-lg p-4 text-white block transition ${theme.textAreaFocus} font-mono text-center ${profanityWarning ? 'border-red-500 border-2' : ''}`}
                                value={customAnswers[stepData.id] || ''}
                                onChange={handleTextChange}
                                placeholder={stepData.customOption!.placeholder}
                            />
                            {profanityWarning && (
                                <p className="text-red-400 text-sm mt-2 font-mono text-center">
                                    Please use appropriate language. Food-related terms like "black coffee" or "white chocolate" are allowed.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default QuestionScreen;

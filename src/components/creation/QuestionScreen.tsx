
import React, { useState } from 'react';
import { QuestionStep } from '@/types/creation';
import { containsProfanity } from '@/utils/profanityFilter';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface QuestionScreenProps {
    stepData: QuestionStep;
    answers: { [key: number]: string | string[] };
    handleAnswerSelect: (optionTitle: string) => void;
    customAnswers: { [key: number]: string };
    handleCustomAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onAutoAdvance?: () => void;
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
    onAutoAdvance,
    theme
}) => {
    const [profanityWarning, setProfanityWarning] = useState(false);

    const handleOptionSelect = (optionTitle: string) => {
        handleAnswerSelect(optionTitle);
        
        // For single-select questions, auto-advance for non-custom options
        if (!stepData.multiSelect && (!stepData.customOption || optionTitle !== stepData.customOption.title)) {
            setTimeout(() => {
                onAutoAdvance?.();
            }, 300); // Small delay for visual feedback
        }
    };

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

    // Filter out the custom option from regular options to avoid duplication
    const regularOptions = stepData.options.filter(option => 
        !stepData.customOption || option.title !== stepData.customOption.title
    );
    const hasCustomOption = stepData.customOption;
    
    // Helper function to check if an option is selected
    const isOptionSelected = (optionTitle: string) => {
        if (stepData.multiSelect) {
            const currentAnswers = Array.isArray(answers[stepData.id]) ? answers[stepData.id] as string[] : [];
            return currentAnswers.includes(optionTitle);
        } else {
            return answers[stepData.id] === optionTitle;
        }
    };

    return (
        <>
            {/* Grid layout for regular options */}
            <div className="touch-grid mb-6">
                {regularOptions.map((option) => (
                    <div
                        key={option.title}
                        onClick={() => handleOptionSelect(option.title)}
                        className={`
                            touch-padding rounded-lg transition-all duration-300 cursor-pointer font-mono text-center touch-target active:scale-95 relative
                            ${isOptionSelected(option.title)
                                ? `bg-white/20 border-2 ${theme.optionSelectedBorder} scale-105 shadow-lg ${theme.optionSelectedShadow}`
                                : `bg-white/10 border-2 border-white/20 ${theme.optionHover} hover:scale-102`
                            }
                        `}
                    >
                        {stepData.multiSelect && (
                            <div className="absolute top-3 right-3">
                                <Checkbox 
                                    checked={isOptionSelected(option.title)}
                                    className="bg-white/20 border-white/40 pointer-events-none"
                                />
                            </div>
                        )}
                        <h4 className="font-bold responsive-text text-white font-mono text-center pr-8">{option.title}</h4>
                        <p className="responsive-text-sm text-white/80 mt-2 font-mono text-center pr-8">{option.description}</p>
                    </div>
                ))}
            </div>

            {/* Continue button for multi-select questions */}
            {stepData.multiSelect && (
                <div className="w-full mb-6 flex justify-center">
                    <Button 
                        onClick={() => onAutoAdvance?.()} 
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-3 text-lg font-mono"
                        disabled={(() => {
                            const currentAnswers = Array.isArray(answers[stepData.id]) ? answers[stepData.id] as string[] : [];
                            return currentAnswers.length === 0;
                        })()}
                    >
                        Continue with Selected Ingredients
                    </Button>
                </div>
            )}

            {/* Custom option spanning full width */}
            {hasCustomOption && (
                <div className="w-full">
                    <div
                        onClick={() => handleOptionSelect(stepData.customOption!.title)}
                        className={`
                            touch-padding rounded-lg transition-all duration-300 cursor-pointer font-mono text-center w-full touch-target active:scale-95 relative
                            ${isOptionSelected(stepData.customOption!.title)
                                ? `bg-white/20 border-2 ${theme.optionSelectedBorder} scale-105 shadow-lg ${theme.optionSelectedShadow}`
                                : `bg-white/10 border-2 border-white/20 ${theme.optionHover} hover:scale-102`
                            }
                        `}
                    >
                        {stepData.multiSelect && (
                            <div className="absolute top-3 right-3">
                                <Checkbox 
                                    checked={isOptionSelected(stepData.customOption!.title)}
                                    className="bg-white/20 border-white/40 pointer-events-none"
                                />
                            </div>
                        )}
                        <h4 className="font-bold responsive-text text-white font-mono text-center pr-8">{stepData.customOption!.title}</h4>
                        <p className="responsive-text-sm text-white/80 mt-2 font-mono text-center pr-8">Share your own special memory</p>
                    </div>

                    {/* Custom textarea when selected */}
                    {isOptionSelected(stepData.customOption!.title) && (
                        <div className="mt-6">
                            <label htmlFor="custom-answer" className="block responsive-text-sm font-medium text-white/80 mb-3 font-mono text-center">
                                {stepData.customOption!.title}:
                            </label>
                            <textarea
                                id="custom-answer"
                                rows={4}
                                className={`w-full bg-white/10 border-white/20 border-2 rounded-lg touch-padding responsive-text text-white block transition ${theme.textAreaFocus} font-mono text-center touch-target ${profanityWarning ? 'border-red-500' : ''}`}
                                value={customAnswers[stepData.id] || ''}
                                onChange={handleTextChange}
                                placeholder={stepData.customOption!.placeholder}
                                onBlur={() => {
                                    // Auto-advance when user finishes typing and has content
                                    if (customAnswers[stepData.id] && customAnswers[stepData.id].trim().length > 0) {
                                        setTimeout(() => {
                                            onAutoAdvance?.();
                                        }, 500);
                                    }
                                }}
                            />
                            {profanityWarning && (
                                <p className="text-red-400 responsive-text-sm mt-3 font-mono text-center">
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

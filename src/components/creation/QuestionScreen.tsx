
import React from 'react';
import { QuestionStep } from '@/types/creation';

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
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                {stepData.options.map((option) => (
                    <div
                        key={option.title}
                        onClick={() => handleAnswerSelect(option.title)}
                        className={`
                            p-6 rounded-lg transition-all duration-300 h-full cursor-pointer border-2
                            ${answers[stepData.id] === option.title
                                ? 'bg-card border-foreground scale-105 shadow-lg shadow-foreground/10'
                                : 'bg-card/50 border-border hover:border-foreground/50 hover:bg-card/70 hover:shadow-md'
                            }
                        `}
                    >
                        <h4 className="font-bold text-lg text-foreground">{option.title}</h4>
                        <p className="text-base text-foreground/80 mt-2">{option.description}</p>
                    </div>
                ))}
            </div>
            {stepData.customOption && answers[stepData.id] === stepData.customOption.title && (
                <div className="my-4">
                    <label htmlFor="custom-answer" className="block text-sm font-medium text-foreground/80 mb-2">
                        {stepData.customOption.title}:
                    </label>
                    <textarea
                        id="custom-answer"
                        rows={4}
                        className="w-full bg-input border-border rounded-lg p-2 text-foreground block transition focus:ring-2 focus:ring-foreground/20 focus:border-foreground"
                        value={customAnswers[stepData.id] || ''}
                        onChange={handleCustomAnswerChange}
                        placeholder={stepData.customOption.placeholder}
                    />
                </div>
            )}
        </>
    );
};

export default QuestionScreen;

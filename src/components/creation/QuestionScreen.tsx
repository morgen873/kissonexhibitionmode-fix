
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
            <div className="flex flex-col gap-4">
                {stepData.options.map((option) => (
                    <div
                        key={option.title}
                        onClick={() => handleAnswerSelect(option.title)}
                        className={`
                            p-6 rounded-lg transition-all duration-300 cursor-pointer
                            ${answers[stepData.id] === option.title
                                ? `bg-white/20 border-2 ${theme.optionSelectedBorder} scale-105 shadow-lg ${theme.optionSelectedShadow}`
                                : `bg-white/10 border-2 border-white/20 ${theme.optionHover}`
                            }
                        `}
                    >
                        <h4 className="font-bold text-lg text-white">{option.title}</h4>
                        <p className="text-base text-white/80 mt-2">{option.description}</p>
                    </div>
                ))}
            </div>
            {stepData.customOption && answers[stepData.id] === stepData.customOption.title && (
                <div className="mt-6">
                    <label htmlFor="custom-answer" className="block text-sm font-medium text-white/80 mb-2">
                        {stepData.customOption.title}:
                    </label>
                    <textarea
                        id="custom-answer"
                        rows={4}
                        className={`w-full bg-white/10 border-white/20 rounded-lg p-4 text-white block transition ${theme.textAreaFocus}`}
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

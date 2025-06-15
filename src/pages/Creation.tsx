import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface QuestionStep {
    type: 'question';
    id: number;
    question: string;
    options: { title: string; description: string; }[];
    customOption?: {
        title: string;
        placeholder: string;
    };
}

interface ExplanationStep {
    type: 'explanation';
    title: string;
    description: string;
}

type Step = QuestionStep | ExplanationStep;

const stepThemes = [
    { // Original theme for step 0
        bg: "from-purple-900 via-pink-900 to-orange-900",
        cardShadow: "shadow-purple-500/20",
        progress: "from-pink-500 to-cyan-500",
        title: "from-cyan-300 via-pink-300 to-yellow-300",
        optionSelectedBorder: "border-cyan-400",
        optionSelectedShadow: "shadow-cyan-400/30",
        optionHover: "hover:border-pink-500",
        textAreaFocus: "focus:ring-pink-500 focus:border-pink-500",
    },
    { // Red theme for step 1
        bg: "from-red-900 via-rose-900 to-orange-800",
        cardShadow: "shadow-red-500/20",
        progress: "from-rose-500 to-red-500",
        title: "from-red-300 via-rose-300 to-orange-300",
        optionSelectedBorder: "border-red-400",
        optionSelectedShadow: "shadow-red-400/30",
        optionHover: "hover:border-rose-500",
        textAreaFocus: "focus:ring-rose-500 focus:border-rose-500",
    },
    { // Blue theme for step 2
        bg: "from-blue-900 via-cyan-900 to-teal-800",
        cardShadow: "shadow-blue-500/20",
        progress: "from-cyan-500 to-blue-500",
        title: "from-blue-300 via-cyan-300 to-teal-300",
        optionSelectedBorder: "border-cyan-400",
        optionSelectedShadow: "shadow-cyan-400/30",
        optionHover: "hover:border-cyan-500",
        textAreaFocus: "focus:ring-cyan-500 focus:border-cyan-500",
    },
    { // Orange theme for step 3
        bg: "from-orange-900 via-amber-900 to-yellow-800",
        cardShadow: "shadow-orange-500/20",
        progress: "from-amber-500 to-orange-500",
        title: "from-orange-300 via-amber-300 to-yellow-300",
        optionSelectedBorder: "border-orange-400",
        optionSelectedShadow: "shadow-orange-400/30",
        optionHover: "hover:border-amber-500",
        textAreaFocus: "focus:ring-amber-500 focus:border-amber-500",
    }
];

const steps: Step[] = [
    {
        type: 'explanation' as const,
        title: "A Moment of Reflection",
        description: "Before we start cooking, let's pause for a moment. Imagine you're standing in front of an empty table. You can choose any type of dumpling and any emotional connection."
    },
    {
        type: 'question' as const,
        id: 1,
        question: "What kind of memory are you ready to transform into a recipe?",
        options: [
            { title: "A childhood memory", description: "Revisit the flavors and emotions of your early years." },
            { title: "A feeling you want to cherish", description: "Preserve an emotion that brings you warmth." },
            { title: "A profound emotional event", description: "Transform a meaningful life moment into taste." },
            { title: "A story you'd like to pass on to someone", description: "Share wisdom or experience through flavor." },
            { title: "Write your own memory", description: "Express your memory in your own words." },
        ],
        customOption: {
            title: "Write your own memory",
            placeholder: "Describe the memory that inspires your dumpling..."
        }
    },
    {
        type: 'explanation' as const,
        title: "Preparing the Ingredients",
        description: "You've chosen what we're going to cook together.\nNow it's time to prepare the ingredients that will give your story its flavors."
    },
    {
        type: 'question' as const,
        id: 2,
        question: "What emotional ingredients are in your dumpling?",
        options: [
            { title: "Warmth", description: "A comforting and gentle feeling." },
            { title: "Nostalgia", description: "A fond remembrance of the past." },
            { title: "Adventure", description: "A thrilling sense of the unknown." },
            { title: "Curiosity", description: "A desire to explore and understand." },
            { title: "Bittersweet sadness", description: "A beautiful ache of what was." },
            { title: "Silence", description: "A peaceful and contemplative state." },
            { title: "Love", description: "A deep and affectionate connection." },
            { title: "Add your own emotional ingredient", description: "Define a unique emotion for your recipe." },
        ],
        customOption: {
            title: "Add your own emotional ingredient",
            placeholder: "Enter an emotion not listed above..."
        }
    }
];

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customAnswers, setCustomAnswers] = useState<{ [key: number]: string }>({});

    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question') {
            setAnswers({ ...answers, [step.id]: optionTitle });
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

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleSubmit = () => {
        const finalAnswersPayload = Object.entries(answers).reduce((acc, [stepId, answer]) => {
            const step = steps.find(s => s.type === 'question' && s.id === Number(stepId)) as QuestionStep | undefined;
            if (step && step.customOption && answer === step.customOption.title) {
                acc[stepId] = customAnswers[Number(stepId)] || '';
            } else {
                acc[stepId] = answer;
            }
            return acc;
        }, {} as { [key: string]: string });

        console.log("Final answers:", finalAnswersPayload);
        alert("Recipe is being created with your answers!");
    };

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentStepData = steps[currentStep];
    const theme = stepThemes[currentStep] || stepThemes[0]; // Fallback to the first theme
    
    const isNextDisabled = (() => {
        if (currentStepData.type !== 'question') return false;

        const answer = answers[currentStepData.id];
        if (!answer) return true;

        if (currentStepData.customOption && answer === currentStepData.customOption.title) {
            const customAnswer = customAnswers[currentStepData.id];
            return !customAnswer || !customAnswer.trim();
        }

        return false;
    })();

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-4 sm:p-6 md:p-8 flex items-center justify-center transition-all duration-500`}>
            <Card className={`w-full max-w-2xl bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-all duration-500`}>
                <CardHeader>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-4">
                        <div className={`bg-gradient-to-r ${theme.progress} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                    </div>
                    <CardTitle className={`text-2xl md:text-3xl font-black text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center transition-all duration-500`}>
                        {currentStepData.type === 'question' ? currentStepData.question : currentStepData.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentStepData.type === 'explanation' ? (
                        <div className="text-center my-8">
                            <p className="text-lg text-white/80 leading-relaxed max-w-prose mx-auto whitespace-pre-line">
                                {currentStepData.description}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                                {currentStepData.options.map((option) => (
                                    <div
                                        key={option.title}
                                        onClick={() => handleAnswerSelect(option.title)}
                                        className={`
                                            p-6 rounded-lg transition-all duration-300 h-full cursor-pointer
                                            ${answers[currentStepData.id] === option.title
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
                            {currentStepData.type === 'question' && currentStepData.customOption && answers[currentStepData.id] === currentStepData.customOption.title && (
                                <div className="my-4">
                                    <label htmlFor="custom-answer" className="block text-sm font-medium text-white/80 mb-2">
                                        {currentStepData.customOption.title}:
                                    </label>
                                    <textarea
                                        id="custom-answer"
                                        rows={4}
                                        className={`w-full bg-white/10 border-white/20 rounded-lg p-2 text-white block transition ${theme.textAreaFocus}`}
                                        value={customAnswers[currentStepData.id] || ''}
                                        onChange={handleCustomAnswerChange}
                                        placeholder={currentStepData.customOption.placeholder}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    <div className="flex justify-between mt-8">
                        <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" className="text-white hover:bg-white/10 disabled:opacity-50">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        {currentStep === steps.length - 1 ? (
                            <Button onClick={handleSubmit} disabled={isNextDisabled}>
                                Create Recipe <Zap className="ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={nextStep} disabled={isNextDisabled}>
                                Next <ArrowRight className="ml-2" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Creation;

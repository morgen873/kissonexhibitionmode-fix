
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const steps = [
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
    }
];

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [customMemory, setCustomMemory] = useState('');

    const handleAnswerSelect = (optionTitle: string) => {
        const step = steps[currentStep];
        if (step.type === 'question') {
            setAnswers({ ...answers, [step.id]: optionTitle });
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
        const finalAnswers = { ...answers };
        const currentStepData = steps[currentStep];
        if (currentStepData.type === 'question' && answers[currentStepData.id] === 'Write your own memory' && customMemory) {
            finalAnswers[currentStepData.id] = customMemory;
        }
        console.log("Final answers:", finalAnswers);
        // Here we would call the AI to generate the recipe
        alert("Recipe is being created with your answers!");
    };

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentStepData = steps[currentStep];
    const isNextDisabled = currentStepData.type === 'question' 
        ? !answers[currentStepData.id] || (answers[currentStepData.id] === 'Write your own memory' && !customMemory.trim())
        : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl shadow-purple-500/20">
                <CardHeader>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-4">
                        <div className="bg-gradient-to-r from-pink-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center">
                        {currentStepData.type === 'question' ? currentStepData.question : currentStepData.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentStepData.type === 'explanation' ? (
                        <div className="text-center my-8">
                            <p className="text-lg text-white/80 leading-relaxed max-w-prose mx-auto">
                                {currentStepData.description}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                                {currentStepData.options.map((option) => (
                                    <Button
                                        key={option.title}
                                        onClick={() => handleAnswerSelect(option.title)}
                                        variant={answers[currentStepData.id] === option.title ? "default" : "outline"}
                                        className={`
                                            text-left p-6 rounded-lg transition-all duration-300 h-auto flex flex-col items-start
                                            ${answers[currentStepData.id] === option.title
                                                ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white border-transparent scale-105 shadow-lg shadow-pink-500/30'
                                                : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                            }
                                        `}
                                    >
                                        <span className="font-bold text-lg">{option.title}</span>
                                        <span className="font-normal text-base text-white/80 mt-1">{option.description}</span>
                                    </Button>
                                ))}
                            </div>
                            {currentStepData.type === 'question' && answers[currentStepData.id] === 'Write your own memory' && (
                                <div className="my-4">
                                    <label htmlFor="custom-memory" className="block text-sm font-medium text-white/80 mb-2">
                                        Express your memory in your own words:
                                    </label>
                                    <textarea
                                        id="custom-memory"
                                        rows={4}
                                        className="w-full bg-white/10 border-white/20 rounded-lg p-2 text-white focus:ring-pink-500 focus:border-pink-500 block transition"
                                        value={customMemory}
                                        onChange={(e) => setCustomMemory(e.target.value)}
                                        placeholder="Describe the memory that inspires your dumpling..."
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

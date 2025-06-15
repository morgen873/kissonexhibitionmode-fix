
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const steps = [
    {
        id: 1,
        question: "How are you feeling today?",
        options: ["Joyful", "Melancholy", "Adventurous", "Nostalgic"],
    },
    {
        id: 2,
        question: "What kind of memory does this feeling evoke?",
        options: ["A childhood birthday party", "A quiet evening with a book", "Traveling to a new city", "A dinner with old friends"],
    },
    {
        id: 3,
        question: "Choose a primary flavor profile:",
        options: ["Sweet", "Savory", "Spicy", "Sour"],
    },
    {
        id: 4,
        question: "Select a texture:",
        options: ["Crispy", "Chewy", "Soft", "Juicy"],
    },
    {
        id: 5,
        question: "What's your desired 'dumpling personality'?",
        options: ["Comforting & Familiar", "Bold & Daring", "Elegant & Refined", "Playful & Surprising"],
    }
];

const Creation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});

    const handleAnswerSelect = (option: string) => {
        setAnswers({ ...answers, [steps[currentStep].id]: option });
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
        console.log("Final answers:", answers);
        // Here we would call the AI to generate the recipe
        alert("Recipe is being created with your answers!");
    };

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentQuestion = steps[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-black/30 backdrop-blur-xl border-2 border-white/20 shadow-2xl shadow-purple-500/20">
                <CardHeader>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-4">
                        <div className="bg-gradient-to-r from-pink-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg min-h-[100px] flex items-center justify-center">
                        {currentQuestion.question}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                        {currentQuestion.options.map((option) => (
                            <Button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                                className={`
                                    text-lg font-bold p-8 rounded-lg transition-all duration-300 h-auto
                                    ${answers[currentQuestion.id] === option
                                        ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white border-transparent scale-105 shadow-lg shadow-pink-500/30'
                                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                    }
                                `}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8">
                        <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" className="text-white hover:bg-white/10 disabled:opacity-50">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        {currentStep === steps.length - 1 ? (
                            <Button onClick={handleSubmit} disabled={!answers[currentQuestion.id]}>
                                Create Recipe <Zap className="ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={nextStep} disabled={!answers[currentQuestion.id]}>
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

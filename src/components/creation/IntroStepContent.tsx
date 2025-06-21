
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IntroStepContentProps {
    step: any;
    onNext: () => void;
}

const IntroStepContent: React.FC<IntroStepContentProps> = ({ step, onNext }) => {
    const renderStepContent = () => {
        switch (step.type) {
            case 'hero':
                return (
                    <div className="text-center max-w-sm mx-auto px-4">
                        <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="KissOn Logo" className="mx-auto mb-6 w-48 filter grayscale" />
                        
                        <p className="text-lg text-white font-bold mb-8 font-mono">
                            {step.description}
                        </p>
                        <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-8 py-4 text-xl rounded-xl font-mono">
                            {step.buttonText}
                        </Button>
                    </div>
                );
            case 'explanation':
                const Icon = step.icon;
                return (
                    <Card className="bg-transparent border-4 border-white/20 transition-all duration-300 shadow-2xl shadow-black/25 w-full max-w-sm mx-auto">
                        <CardContent className="p-4">
                            {Icon && <div className="w-16 h-16 bg-gradient-to-r from-black via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon className="h-8 w-8 text-white" />
                            </div>}
                            <h3 className="font-black text-white mb-4 drop-shadow-lg text-2xl text-center font-mono">
                                {(step.title as string[])[0]}
                                <br />
                                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                                    {(step.title as string[])[1]}
                                </span>
                            </h3>
                            <p className="text-white font-bold text-sm text-center font-mono">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            case 'quote':
                return (
                    <div className="text-center max-w-sm mx-auto px-4">
                        <blockquote className="text-3xl md:text-4xl font-black leading-tight mb-6 font-mono">
                            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
                                {step.title}
                            </span>
                        </blockquote>
                        <p className="text-xl text-white font-black mb-8 font-mono">
                            {step.description}
                        </p>
                        {step.buttonText && (
                            <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-8 py-4 text-xl rounded-xl font-mono">
                                {step.buttonText}
                            </Button>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full">
            {renderStepContent()}
        </main>
    );
};

export default IntroStepContent;

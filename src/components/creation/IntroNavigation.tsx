
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface IntroNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrev: () => void;
    onNext: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    buttonText: string;
}

const IntroNavigation: React.FC<IntroNavigationProps> = ({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    isFirstStep,
    isLastStep,
    buttonText
}) => {
    return (
        <div className="w-full mt-6">
            <div className="flex justify-between items-center">
                <Button 
                    onClick={onPrev} 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm" 
                    disabled={isFirstStep}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex items-center space-x-2">
                    {Array.from({ length: totalSteps - 1 }).map((_, index) => (
                        <div 
                            key={index} 
                            className={`w-2 h-2 rounded-full transition-colors ${
                                currentStep === index + 1 ? 'bg-white' : 'bg-white/30'
                            }`} 
                        />
                    ))}
                </div>
                <Button onClick={onNext} className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm">
                    {isLastStep ? buttonText : 'Next'}
                </Button>
            </div>
        </div>
    );
};

export default IntroNavigation;

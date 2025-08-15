
import React from 'react';
import { Button } from "@/components/ui/button";

interface IntroNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrev: () => void;
    onNext: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    buttonText: string;
    onTransitionNext?: () => void;
    onTransitionPrev?: () => void;
}

const IntroNavigation: React.FC<IntroNavigationProps> = ({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    isFirstStep,
    isLastStep,
    buttonText,
    onTransitionNext,
    onTransitionPrev
}) => {
    const handleNextClick = () => {
        console.log('IntroNavigation: Next button clicked');
        if (onTransitionNext) {
            onTransitionNext();
        } else {
            onNext();
        }
    };

    const handlePrevClick = () => {
        console.log('IntroNavigation: Previous button clicked');
        if (onTransitionPrev) {
            onTransitionPrev();
        } else {
            onPrev();
        }
    };

    return (
        <div className="w-full mt-6">
            {isLastStep ? (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0 relative">
                    <Button 
                        onClick={handlePrevClick} 
                        variant="ghost" 
                        className="text-white hover:bg-white/10 disabled:opacity-50 font-sans text-lg px-8 py-4 w-full sm:w-auto sm:absolute sm:left-0 order-2 sm:order-1 touch-target" 
                        disabled={currentStep === 1}
                    >
                        Back
                    </Button>
                    
                    <Button 
                        onClick={handleNextClick} 
                        className="bg-gradient-to-r from-black to-gray-800 text-white font-sans text-lg px-8 py-4 hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-2 touch-target"
                    >
                        {buttonText}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center relative gap-4 sm:gap-0">
                    <Button 
                        onClick={handlePrevClick} 
                        variant="ghost" 
                        className="text-white hover:bg-white/10 disabled:opacity-50 font-sans text-lg px-8 py-4 w-full sm:w-auto order-2 sm:order-1 touch-target" 
                        disabled={currentStep === 1}
                    >
                        Back
                    </Button>
                    
                    <div className="flex items-center space-x-2 order-3 sm:order-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                        {Array.from({ length: totalSteps - 1 }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    currentStep === index + 1 ? 'bg-white' : 'bg-white/30'
                                }`} 
                            />
                        ))}
                    </div>
                    
                    <Button 
                        onClick={handleNextClick} 
                        className="bg-gradient-to-r from-black to-gray-800 text-white font-sans text-lg px-8 py-4 hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-3 touch-target"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default IntroNavigation;

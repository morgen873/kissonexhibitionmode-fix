
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface IntroNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrev: () => void;
    onNext: (gifUrl?: string) => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    buttonText: string;
    step?: any; // Add step prop to access GIF URL
}

const IntroNavigation: React.FC<IntroNavigationProps> = ({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    isFirstStep,
    isLastStep,
    buttonText,
    step
}) => {
    const handleNextClick = () => {
        console.log('IntroNavigation: Next button clicked');
        // If this step has a GIF URL, trigger the transition
        if (step?.gifUrl) {
            console.log('Triggering GIF transition from navigation with URL:', step.gifUrl);
            onNext(step.gifUrl);
        } else {
            onNext();
        }
    };

    const handlePrevClick = () => {
        console.log('IntroNavigation: Previous button clicked');
        onPrev();
    };

    return (
        <div className="w-full mt-6">
            {isLastStep ? (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                    <Button 
                        onClick={handlePrevClick} 
                        variant="ghost" 
                        className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm w-full sm:w-auto order-2 sm:order-1" 
                        disabled={isFirstStep}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    
                    <Button 
                        onClick={handleNextClick} 
                        className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-2"
                    >
                        {buttonText}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row justify-between items-center relative gap-4 sm:gap-0">
                    <Button 
                        onClick={handlePrevClick} 
                        variant="ghost" 
                        className="text-white hover:bg-white/10 disabled:opacity-50 font-mono text-sm w-full sm:w-auto order-2 sm:order-1" 
                        disabled={isFirstStep}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    
                    <div className="flex items-center space-x-2 order-3 sm:order-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                        {Array.from({ length: totalSteps - 1 }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    currentStep === index + 1 ? 'bg-white' : 'bg-white/30'
                                }`} 
                            />
                        ))}
                    </div>
                    
                    <Button 
                        onClick={handleNextClick} 
                        className="bg-gradient-to-r from-black to-gray-800 text-white font-mono text-sm hover:from-gray-800 hover:to-black w-full sm:w-auto order-1 sm:order-3"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default IntroNavigation;

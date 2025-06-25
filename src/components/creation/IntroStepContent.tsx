
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IntroStepContentProps {
  step: any;
  onNext: () => void;
}

const IntroStepContent: React.FC<IntroStepContentProps> = ({
  step,
  onNext
}) => {
  const handleNextClick = () => {
    console.log('IntroStepContent: Next button clicked');
    onNext();
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'hero':
        return (
          <div className="text-center max-w-lg mx-auto px-4 flex flex-col items-center justify-center">
            <img 
              src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" 
              alt="KissOn Logo" 
              className="mx-auto mb-4 sm:mb-6 w-32 sm:w-40 lg:w-48 filter grayscale" 
            />
            
            <p className="text-base sm:text-lg text-white font-bold mb-6 sm:mb-8 font-mono leading-relaxed text-center">
              Our AI transforms your feelings into delicious,{'\n'}one-of-a-kind dumpling recipes.
            </p>
            
            <div className="flex justify-center w-full">
              <Button 
                onClick={handleNextClick} 
                size="lg" 
                className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl rounded-xl font-mono w-full sm:w-auto max-w-xs"
              >
                {step.buttonText}
              </Button>
            </div>
          </div>
        );
      case 'explanation':
        const Icon = step.icon;
        return (
          <div className="flex justify-center w-full">
            <Card className="bg-transparent border-4 border-white/20 transition-all duration-300 shadow-2xl shadow-black/25 w-full max-w-xs sm:max-w-sm">
              <CardContent className="p-3 sm:p-4">
                {Icon && (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-black via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                )}
                <h3 className="font-black text-white mb-3 sm:mb-4 drop-shadow-lg text-lg sm:text-xl lg:text-2xl text-center font-mono">
                  {(step.title as string[])[0]} <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    {(step.title as string[])[1]}
                  </span>
                </h3>
                <p className="text-white font-bold text-xs sm:text-sm text-center font-mono leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'quote':
        return (
          <div className="text-center max-w-xs sm:max-w-sm mx-auto px-4 flex flex-col items-center justify-center">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4 sm:mb-6 font-mono">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl text-lg sm:text-xl text-center font-extrabold block">
                {step.title}
              </span>
            </blockquote>
            <p className="text-lg sm:text-xl text-white font-black mb-6 sm:mb-8 font-mono text-center leading-relaxed">
              {step.description}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full min-h-[50vh] px-4">
      {renderStepContent()}
    </main>
  );
};

export default IntroStepContent;

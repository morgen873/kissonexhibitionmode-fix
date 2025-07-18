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
        return <div className="flex flex-col items-center justify-center text-center px-4 py-4 space-y-4 sm:space-y-6 sm:py-0 sm:px-0">
            <img src="https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//stove.mp4" alt="Cooking on stovetop" className="w-full max-w-4xl h-auto max-h-[60vh] object-cover rounded-lg mb-2" />
            
            <p className="text-base sm:text-lg lg:text-xl text-white font-bold font-sans leading-relaxed max-w-md sm:max-w-lg px-4">
              Our AI transforms your feelings into delicious, one-of-a-kind dumpling recipes.
            </p>
            
            <Button onClick={handleNextClick} size="lg" className="bg-gradient-to-r from-black via-gray-800 to-black hover:from-gray-800 hover:via-black hover:to-gray-800 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/20 px-8 py-4 sm:px-10 sm:py-5 text-lg sm:text-xl rounded-xl font-sans mt-2">
              {step.buttonText}
            </Button>
          </div>;
      case 'explanation':
        const Icon = step.icon;
        return <div className="flex justify-center px-6 sm:px-8 py-8 sm:py-12">
            <Card className="bg-transparent border-4 border-white/20 transition-all duration-300 shadow-2xl shadow-black/25 w-full max-w-sm">
              <CardContent className="p-6 sm:p-8 text-center">
                {Icon && <div className="w-16 h-16 bg-gradient-to-r from-black via-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>}
                <h3 className="font-black text-white mb-4 drop-shadow-lg font-sans text-3xl">
                  {(step.title as string[])[0]} <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    {(step.title as string[])[1]}
                  </span>
                </h3>
                <p className="text-white font-sans leading-relaxed font-extralight text-base">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </div>;
      case 'quote':
        return <div className="flex flex-col items-center justify-center text-center px-6 sm:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-black leading-tight font-sans max-w-lg px-4">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-2xl font-extrabold">
                {step.title}
              </span>
            </blockquote>
            <p className="text-lg sm:text-xl text-white font-black font-sans leading-relaxed px-4">
              {step.description}
            </p>
          </div>;
      default:
        return null;
    }
  };
  return <div className="flex items-center justify-center min-h-[40vh] w-full">
      {renderStepContent()}
    </div>;
};
export default IntroStepContent;
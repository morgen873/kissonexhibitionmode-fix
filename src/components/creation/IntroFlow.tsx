
import { useState } from 'react';
import { introSteps, IntroStepData } from '@/data/introSteps';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface IntroFlowProps {
  onComplete: () => void;
}

const IntroFlow = ({ onComplete }: IntroFlowProps) => {
  // Start at step 1 (heart icon) instead of step 0 (hero)
  const [currentStep, setCurrentStep] = useState(1);
  const stepData = introSteps[currentStep];

  const nextStep = () => {
    console.log('Next step clicked, current step:', currentStep);
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Completing intro flow');
      onComplete();
    }
  };

  const prevStep = () => {
    console.log('Previous step clicked, current step:', currentStep);
    // Don't allow going back to step 0 (hero step)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = (step: IntroStepData) => {
    switch (step.type) {
      case 'explanation':
        const Icon = step.icon;
        return (
          <Card className={`bg-transparent border-4 ${step.theme?.border} backdrop-blur-md transition-all duration-300 shadow-2xl ${step.theme?.shadow} w-full max-w-md`}>
            <CardContent className="p-10 text-center my-0 mx-0 py-[10px] px-[10px]">
              {Icon && (
                <div className={`w-20 h-20 bg-gradient-to-r ${step.theme?.iconGradient} rounded-full flex items-center justify-center mx-auto mb-8`}>
                  <Icon className="h-10 w-10 text-white" />
                </div>
              )}
              <h3 className="font-black text-white mb-6 drop-shadow-lg text-3xl">
                {(step.title as string[])[0]} <span className={`bg-gradient-to-r ${step.theme?.titleGradient} bg-clip-text text-transparent`}>
                  {(step.title as string[])[1]}
                </span>
              </h3>
              <p className="text-white font-bold py-[10px] text-lg leading-relaxed max-w-[200px] mx-auto">
                {step.description}
              </p>
            </CardContent>
          </Card>
        );
      
      case 'quote':
        return (
          <div className="text-center max-w-4xl mx-auto">
            <blockquote className="text-4xl md:text-6xl font-black leading-tight mb-8">
              <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                EVERY DUMPLING IS A PORTAL,<br />
                EVERY BITE A TIME MACHINE
              </div>
            </blockquote>
            <p className="text-2xl md:text-3xl text-white font-black mb-12 leading-relaxed">
              {step.description}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white flex flex-col items-center p-4 relative">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient py-0 px-0 my-0 mx-0"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-10 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center flex-grow w-full my-[29px] max-w-4xl mx-auto">
        <div className="relative flex items-center justify-center w-full">
          {/* Left Arrow (Back) */}
          <Button 
            onClick={prevStep} 
            variant="ghost" 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 disabled:opacity-30 w-12 h-12 rounded-full p-0 z-10" 
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          
          {/* Main Content */}
          <div className="flex-1 flex justify-center">
            {renderStepContent(stepData)}
          </div>
          
          {/* Right Arrow (Next) */}
          <Button 
            onClick={nextStep} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-400 hover:to-purple-400 w-12 h-12 rounded-full p-0 z-10"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center space-x-2 mt-8">
          {/* Show dots for steps 1-3 (explanation steps) */}
          {introSteps.slice(1, 4).map((_, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === index + 1 ? 'bg-white' : 'bg-white/30'
              }`} 
            />
          ))}
        </div>
        
        {/* Special button for last step */}
        {currentStep === introSteps.length - 1 && (
          <Button 
            onClick={nextStep} 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-400 hover:to-purple-400 mt-6 px-8 py-3 text-lg font-mono"
          >
            {stepData.buttonText}
          </Button>
        )}
      </main>
      
      <footer className="relative z-10 bg-black/50 backdrop-blur-md text-white mt-8 w-full text-center border-t-2 border-white/20 py-[10px] my-[30px]">
        <p className="text-lg font-black">
          A DESIGN PROJECT BY <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
        </p>
      </footer>
    </div>
  );
};

export default IntroFlow;

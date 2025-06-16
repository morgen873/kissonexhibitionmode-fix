import { useState } from 'react';
import { introSteps, IntroStepData } from '@/data/introSteps';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
interface IntroFlowProps {
  onComplete: () => void;
}
const IntroFlow = ({
  onComplete
}: IntroFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepData = introSteps[currentStep];
  const nextStep = () => {
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const renderStepContent = (step: IntroStepData) => {
    switch (step.type) {
      case 'hero':
        return <div className="text-center max-w-6xl mx-0 px-0 bg-inherit my-0 py-0">
                        <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="KissOn Logo" className="mx-auto mb-8 w-64 mix-blend-screen" />
                        
                        <p className="text-xl text-white font-bold max-w-3xl mx-auto drop-shadow-lg mb-12 md:text-xl">
                            {step.description}
                        </p>
                        <Button onClick={nextStep} size="lg" className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-bold shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm px-10 py-6 text-2xl rounded-2xl bg-inherit">
                            {step.buttonText}
                            <ArrowRight className="ml-3 h-6 w-6" />
                        </Button>
                    </div>;
      case 'explanation':
        const Icon = step.icon;
        return <Card className={`bg-transparent border-4 ${step.theme?.border} backdrop-blur-md transition-all duration-300 shadow-2xl ${step.theme?.shadow} w-full max-w-md`}>
                        <CardContent className="p-10 text-center my-0 mx-0 px-[10px] py-[10px]">
                            {Icon && <div className={`w-20 h-20 bg-gradient-to-r ${step.theme?.iconGradient} rounded-full flex items-center justify-center mx-auto mb-8`}>
                                <Icon className="h-10 w-10 text-white" />
                            </div>}
                            <h3 className="text-3xl font-black text-white mb-6 drop-shadow-lg">
                                {(step.title as string[])[0]}
                                <br />
                                <span className={`bg-gradient-to-r ${step.theme?.titleGradient} bg-clip-text text-transparent`}>
                                    {(step.title as string[])[1]}
                                </span>
                            </h3>
                            <p className="text-white font-bold text-lg py-[10px]">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>;
      case 'quote':
        return <div className="text-center max-w-4xl mx-auto">
                        <blockquote className="text-4xl md:text-6xl font-black leading-tight mb-8">
                            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                                {step.title}
                            </span>
                        </blockquote>
                        <p className="text-2xl text-white font-black mb-12">
                            {step.description}
                        </p>
                    </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white flex flex-col items-center p-4 relative">
            <div className="absolute inset-0 opacity-30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient"></div>
                <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl animate-bounce"></div>
                <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full blur-2xl animate-float"></div>
                <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center flex-grow w-full my-[50px]">
                {renderStepContent(stepData)}
            </main>

            {stepData.type !== 'hero' && <div className="relative z-10 w-full max-w-2xl mt-8">
                    <div className="flex justify-between items-center">
                        <Button onClick={prevStep} variant="ghost" className="text-white hover:bg-white/10 disabled:opacity-50" disabled={currentStep === 0}>
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <div className="flex items-center space-x-2">
                            {introSteps.slice(1, 4).map((_, index) => <div key={index} className={`w-3 h-3 rounded-full transition-colors ${currentStep === index + 1 ? 'bg-white' : 'bg-white/30'}`} />)}
                        </div>
                        <Button onClick={nextStep} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                            {currentStep === introSteps.length - 1 ? stepData.buttonText : 'Next'} <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </div>}
            
            <footer className="relative z-10 bg-black/50 backdrop-blur-md text-white mt-8 w-full text-center border-t-2 border-white/20 py-[10px] my-[30px]">
                <p className="text-lg font-black">
                    A DESIGN PROJECT BY <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mx-1">OREN/LUPE</span>
                </p>
            </footer>
        </div>;
};
export default IntroFlow;
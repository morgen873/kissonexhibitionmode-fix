import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import NetworkBackground from '@/components/ui/NetworkBackground';
import { AnimatedEggIcon, AnimatedLeafIcon, AnimatedChefHatIcon, AnimatedCarrotIcon, AnimatedAppleIcon } from '@/components/ui/AnimatedCulinaryIcons';

interface CreationContainerProps {
  progress: number;
  theme: {
    bg: string;
    progress: string;
    cardShadow: string;
    title: string;
    optionSelectedBorder: string;
    optionSelectedShadow: string;
    optionHover: string;
    textAreaFocus: string;
  };
  title?: string;
  showTitle: boolean;
  hasStartedCreation: boolean;
  children: React.ReactNode;
}

const CreationContainer: React.FC<CreationContainerProps> = ({
  progress,
  theme,
  title,
  showTitle,
  hasStartedCreation,
  children
}) => {
  return (
    <div className={`h-screen w-full bg-gradient-to-br ${theme.bg} transition-all duration-500 relative overflow-hidden`}>
      <NetworkBackground className="z-0" />
      
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
        <AnimatedEggIcon className="absolute top-16 left-8 text-foreground opacity-30" />
        <AnimatedLeafIcon className="absolute top-24 right-16 text-foreground opacity-40" />
        <AnimatedChefHatIcon className="absolute bottom-32 left-16 text-foreground opacity-25" />
        <AnimatedCarrotIcon className="absolute top-48 left-1/3 text-foreground opacity-35" />
        <AnimatedAppleIcon className="absolute bottom-16 right-8 text-foreground opacity-30" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 z-0"></div>

      <div className="relative z-10 h-full flex flex-col p-6">
        <div className="w-full mb-4">
          <ProgressBar progress={progress} theme={theme} />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className={`w-full max-w-6xl bg-card ${theme.cardShadow} backdrop-blur-2xl border-2 border-border shadow-2xl rounded-xl h-fit max-h-[calc(100vh-150px)] overflow-hidden`}>
            {showTitle && (
              <CardHeader className="px-8 py-6">
                <CardTitle className={`text-4xl text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent font-bold`}>
                  {title}
                </CardTitle>
              </CardHeader>
            )}
            
            <CardContent className="px-8 pb-8 overflow-y-auto">
              <div className="text-xl">
                {children}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreationContainer;
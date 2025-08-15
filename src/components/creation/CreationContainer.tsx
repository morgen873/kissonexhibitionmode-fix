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
    <div className={`h-screen max-h-screen w-full bg-gradient-to-br ${theme.bg} transition-all duration-500 relative overflow-hidden`}>
      {/* Network Background */}
      <NetworkBackground className="z-0" />
      
      {/* Floating Animated Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
        <AnimatedEggIcon className="absolute top-16 left-8 text-foreground opacity-30 touch-icon-32" />
        <AnimatedLeafIcon className="absolute top-24 right-16 text-foreground opacity-40 touch-icon-32" />
        <AnimatedChefHatIcon className="absolute bottom-32 left-16 text-foreground opacity-25 touch-icon-32" />
        <AnimatedCarrotIcon className="absolute top-48 left-1/3 text-foreground opacity-35 touch-icon-32" />
        <AnimatedAppleIcon className="absolute bottom-16 right-8 text-foreground opacity-30 touch-icon-32" />
        <AnimatedEggIcon className="absolute top-1/2 right-1/4 text-foreground opacity-20 touch-icon-32" />
        <AnimatedLeafIcon className="absolute bottom-48 left-1/2 text-foreground opacity-25 touch-icon-32" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Progress Bar at top */}
        <div className="w-full px-8 py-4">
          <div className="w-full max-w-none mx-auto">
            <ProgressBar progress={progress} theme={theme} />
          </div>
        </div>

        {/* Main Content Card - Optimized for 32-inch no-scroll */}
        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <Card className={`w-full max-w-none bg-card ${theme.cardShadow} transition-all duration-500 backdrop-blur-2xl border-2 border-border shadow-2xl touch-32-card max-h-[85vh] overflow-hidden`}>
            <CardHeader className="px-8 py-4">
              {showTitle && (
                <CardTitle className={`touch-32-heading text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center font-bold`}>
                  {title}
                </CardTitle>
              )}
            </CardHeader>
            
            <CardContent className="px-8 pb-8 h-full overflow-hidden">
              <div className="h-full overflow-y-auto touch-32-optimized">
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
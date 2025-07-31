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
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bg} transition-all duration-500 relative overflow-hidden touch-container-32 touch-32-safe-area`}>
      {/* Network Background */}
      <NetworkBackground className="z-0" />
      
      {/* Floating Animated Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
        <AnimatedEggIcon className="absolute top-20 touch:top-32 left-10 touch:left-20 text-foreground opacity-30 touch-icon-32" />
        <AnimatedLeafIcon className="absolute top-32 touch:top-48 right-20 touch:right-32 text-foreground opacity-40 touch-icon-32" />
        <AnimatedChefHatIcon className="absolute bottom-40 touch:bottom-64 left-20 touch:left-32 text-foreground opacity-25 touch-icon-32" />
        <AnimatedCarrotIcon className="absolute top-60 touch:top-80 left-1/3 text-foreground opacity-35 touch-icon-32" />
        <AnimatedAppleIcon className="absolute bottom-20 touch:bottom-32 right-10 touch:right-20 text-foreground opacity-30 touch-icon-32" />
        <AnimatedEggIcon className="absolute top-1/2 right-1/4 text-foreground opacity-20 touch-icon-32" />
        <AnimatedLeafIcon className="absolute bottom-60 touch:bottom-80 left-1/2 text-foreground opacity-25 touch-icon-32" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar at top */}
        <div className="w-full touch-container-32 responsive-padding-sm">
          <div className="w-full responsive-container-xl">
            <ProgressBar progress={progress} theme={theme} />
          </div>
        </div>

        {/* Main Content Card - Centered with responsive sizing */}
        <div className="flex-1 flex items-center justify-center touch-container-32 touch-spacing">
          <Card className={`w-full responsive-container-xl bg-card ${theme.cardShadow} transition-all duration-500 backdrop-blur-2xl border-2 border-border shadow-2xl touch-card-32 touch-32-card`}>
            <CardHeader className="touch-padding py-0 px-0">
              {showTitle && (
                <CardTitle className={`responsive-heading-lg text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg touch-heading-32 touch-32-heading flex items-center justify-center font-bold`}>
                  {title}
                </CardTitle>
              )}
            </CardHeader>
            
            <CardContent className="touch-padding touch-32-optimized touch-32-container">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreationContainer;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import NetworkBackground from '@/components/ui/NetworkBackground';
import { AnimatedEggIcon, AnimatedLeafIcon, AnimatedChefHatIcon, AnimatedCarrotIcon, AnimatedAppleIcon } from '@/components/ui/AnimatedCulinaryIcons';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { currentTheme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bg} ${currentTheme.colors.text} transition-all duration-500 relative overflow-hidden`}>
      {/* Network Background */}
      <NetworkBackground className="z-0" />
      
      {/* Floating Animated Icons - Hidden on mobile for better performance */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
        <AnimatedEggIcon className="absolute top-20 left-10 text-green-400 opacity-30" />
        <AnimatedLeafIcon className="absolute top-32 right-20 text-emerald-300 opacity-40" />
        <AnimatedChefHatIcon className="absolute bottom-40 left-20 text-green-500 opacity-25" />
        <AnimatedCarrotIcon className="absolute top-60 left-1/3 text-green-400 opacity-35" />
        <AnimatedAppleIcon className="absolute bottom-20 right-10 text-emerald-400 opacity-30" />
        <AnimatedEggIcon className="absolute top-1/2 right-1/4 text-green-300 opacity-20" />
        <AnimatedLeafIcon className="absolute bottom-60 left-1/2 text-emerald-500 opacity-25" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar at top */}
        <div className="w-full touch-container pt-4 sm:pt-8 touch:pt-12">
          <div className="w-full max-w-6xl touch:max-w-none mx-auto">
            <ProgressBar progress={progress} theme={theme} />
          </div>
        </div>

        {/* Main Content Card - Centered */}
        <div className="flex-1 flex items-center justify-center touch-container py-4 sm:py-6 touch:py-8">
          <Card className={`w-full max-w-6xl touch:max-w-none ${currentTheme.colors.surface} ${theme.cardShadow} ${currentTheme.effects.borderRadius} transition-all duration-500 backdrop-blur-2xl border-2 touch:border-4 ${currentTheme.colors.border} shadow-2xl`}>
            <CardHeader className="touch-padding py-0 px-0">
              {showTitle && (
                <CardTitle className={`responsive-heading-lg touch:text-5xl text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[60px] sm:min-h-[80px] touch:min-h-[120px] flex items-center justify-center ${currentTheme.fonts.primary} font-bold`}>
                  {title}
                </CardTitle>
              )}
            </CardHeader>
            
            <CardContent className="touch-padding">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreationContainer;

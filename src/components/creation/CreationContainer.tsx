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
  const {
    currentTheme
  } = useTheme();
  return <div className={`min-h-screen w-full ${currentTheme.colors.background} ${currentTheme.colors.text} transition-all duration-300 relative overflow-hidden`}>
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-emerald-900/10 z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0"></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Progress Bar at top */}
                <div className="w-full px-3 sm:px-4 lg:px-8 pt-4 sm:pt-8">
                    <div className="w-full max-w-4xl mx-auto">
                        <ProgressBar progress={progress} theme={theme} />
                    </div>
                </div>

                {/* Main Content Card - Centered */}
                <div className="flex-1 flex items-center justify-center px-3 lg:px-8 py-4 sm:py-0 sm:px-0">
                    <Card className={`w-full max-w-4xl ${currentTheme.colors.surface} ${currentTheme.effects.shadow} ${currentTheme.effects.borderRadius} transition-all duration-300 backdrop-blur-2xl border-2 ${currentTheme.colors.border} shadow-2xl shadow-green-400/5`}>
                        <CardHeader className="p-3 sm:p-4 lg:p-6 py-0 px-0">
                            {showTitle && <CardTitle className={`text-lg sm:text-xl lg:text-2xl text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[60px] sm:min-h-[80px] flex items-center justify-center ${currentTheme.fonts.primary} font-bold`}>
                                    {title}
                                </CardTitle>}
                        </CardHeader>
                        
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>;
};
export default CreationContainer;
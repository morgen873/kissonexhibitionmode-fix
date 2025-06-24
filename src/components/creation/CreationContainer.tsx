
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
        <div className={`min-h-screen ${currentTheme.colors.background} ${currentTheme.colors.text} responsive-padding flex flex-col items-center justify-start transition-all duration-300 pt-16 lg:pt-8 relative overflow-hidden`}>
            {/* Network Background */}
            <NetworkBackground className="z-0" />
            
            {/* Floating Animated Icons */}
            <div className="absolute inset-0 z-0 pointer-events-none">
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

            <div className="responsive-container-xl space-y-6 relative z-10">
                {/* Progress Bar at top */}
                <div className="w-full">
                    <ProgressBar progress={progress} theme={theme} />
                </div>

                {/* Main Content Card - using current theme with enhanced styling */}
                <Card className={`relative w-full mx-auto ${currentTheme.colors.surface} ${currentTheme.effects.shadow} ${currentTheme.effects.borderRadius} transition-all duration-300 backdrop-blur-2xl border-2 ${currentTheme.colors.border} shadow-2xl shadow-green-400/5`}>
                    <CardHeader className="responsive-padding-sm">
                        {showTitle && (
                            <CardTitle className={`responsive-heading-lg text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[80px] flex items-center justify-center ${currentTheme.fonts.primary} font-bold`}>
                                {title}
                            </CardTitle>
                        )}
                    </CardHeader>
                    
                    <CardContent className="responsive-padding-sm">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreationContainer;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
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
        <div className={`min-h-screen ${currentTheme.colors.background} ${currentTheme.colors.text} responsive-padding flex flex-col items-center justify-start transition-all duration-300 pt-16 lg:pt-8`}>
            {/* Background effects adapted to current theme */}
            {!hasStartedCreation && (
                <div className="absolute inset-0 opacity-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-current via-transparent to-current"></div>
                    <div className={`absolute top-20 left-20 w-32 h-32 ${currentTheme.colors.surface} ${currentTheme.effects.borderRadius}`}></div>
                    <div className={`absolute top-60 right-10 w-48 h-48 ${currentTheme.colors.surface} ${currentTheme.effects.borderRadius}`}></div>
                    <div className={`absolute bottom-20 left-1/3 w-24 h-24 ${currentTheme.colors.surface} ${currentTheme.effects.borderRadius}`}></div>
                </div>
            )}

            <div className="responsive-container-xl space-y-6 relative z-10">
                {/* Progress Bar at top */}
                <div className="w-full">
                    <ProgressBar progress={progress} theme={theme} />
                </div>

                {/* Main Content Card - using current theme */}
                <Card className={`relative w-full mx-auto ${currentTheme.colors.surface} ${currentTheme.effects.shadow} ${currentTheme.effects.borderRadius} transition-opacity duration-300`}>
                    <CardHeader className="responsive-padding-sm">
                        {showTitle && (
                            <CardTitle className={`responsive-heading-lg text-center ${currentTheme.colors.primary} drop-shadow-lg min-h-[80px] flex items-center justify-center ${currentTheme.fonts.primary}`}>
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

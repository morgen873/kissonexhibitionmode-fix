
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from './ProgressBar';

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
        <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-white p-3 sm:p-4 lg:p-8 flex flex-col items-center justify-start transition-all duration-300 pt-16 lg:pt-8`}>
            {/* Simplified background effects - no blur */}
            {!hasStartedCreation && (
                <div className="absolute inset-0 opacity-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-800 via-black to-gray-800"></div>
                    <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-gray-600 to-black rounded-full"></div>
                    <div className="absolute top-60 right-10 w-48 h-48 bg-gradient-to-r from-black to-gray-700 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-gray-500 to-black rounded-full"></div>
                </div>
            )}

            <div className="w-full max-w-sm lg:max-w-4xl xl:max-w-6xl space-y-6 relative z-10">
                {/* Progress Bar at top */}
                <div className="w-full">
                    <ProgressBar progress={progress} theme={theme} />
                </div>

                {/* Main Content Card - responsive width */}
                <Card className={`relative w-full mx-auto bg-black/50 border-2 border-white/20 shadow-2xl ${theme.cardShadow} transition-opacity duration-300`}>
                    <CardHeader className="p-4 lg:p-6">
                        {showTitle && (
                            <CardTitle className={`text-xl md:text-2xl lg:text-3xl font-black text-center bg-gradient-to-r ${theme.title} bg-clip-text text-transparent drop-shadow-lg min-h-[80px] flex items-center justify-center font-mono`}>
                                {title}
                            </CardTitle>
                        )}
                    </CardHeader>
                    
                    <CardContent className="p-4 lg:p-6">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreationContainer;

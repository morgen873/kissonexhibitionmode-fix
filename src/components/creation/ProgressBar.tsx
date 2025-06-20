
import React from 'react';

interface ProgressBarProps {
    progress: number;
    theme: {
        progress: string;
    };
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, theme }) => {
    return (
        <div className="w-full bg-muted/30 rounded-full h-2.5 mb-4 border border-border/50">
            <div 
                className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground h-2.5 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;

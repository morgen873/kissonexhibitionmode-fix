
import React from 'react';

interface ProgressBarProps {
    progress: number;
    theme: {
        progress: string;
    };
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, theme }) => {
    return (
        <div className="w-full bg-gray-800/50 rounded-full h-2.5 mb-4">
            <div className={`bg-gradient-to-r ${theme.progress} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;

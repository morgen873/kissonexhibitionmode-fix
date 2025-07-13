
import React from 'react';
import { TimelineStep } from '@/types/creation';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface TimelineScreenProps {
    stepData: TimelineStep;
    selectedValue: string;
    onSelect: (value: string) => void;
    onAutoAdvance?: (value?: string) => void; // Updated to accept optional value
    theme: {
        optionSelectedBorder: string;
        optionSelectedShadow: string;
        optionHover: string;
    };
}

const TimelineScreen: React.FC<TimelineScreenProps> = ({ stepData, selectedValue, onSelect, onAutoAdvance, theme }) => {
    const handleOptionSelect = (value: string) => {
        console.log('Timeline option selected:', value);
        
        // Save the selection first
        onSelect(value);
        
        // For timeline step, trigger auto-advance with the selected value
        if (onAutoAdvance) {
            console.log('Timeline selection complete, triggering auto-advance with value:', value);
            // Pass the selected value directly to bypass race condition
            setTimeout(() => {
                onAutoAdvance(value); // Pass value directly
            }, 200);
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6 text-white/90">
             <p className="text-center text-white/80 whitespace-pre-line font-sans text-sm">{stepData.description}</p>
            <div className="grid grid-cols-2 gap-3 w-full">
                {stepData.options.map((option, index) => (
                    <Card
                        key={index}
                        onClick={() => handleOptionSelect(option.value || option.title)}
                        className={cn(
                            'cursor-pointer transition-all duration-300 bg-black/20 border-2 min-h-24 flex items-center justify-center text-center',
                            selectedValue === (option.value || option.title)
                                ? `${theme.optionSelectedBorder} ${theme.optionSelectedShadow} scale-105` 
                                : `border-white/20 ${theme.optionHover}`
                        )}
                    >
                        <CardContent className="p-3 flex flex-col items-center justify-center space-y-2">
                            <span className="text-sm font-semibold font-sans text-white text-center">{option.title}</span>
                            <p className="text-xs font-sans text-white/70 text-center leading-tight">{option.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TimelineScreen;

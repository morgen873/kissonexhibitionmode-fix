
import React from 'react';
import { TimelineStep } from '@/types/creation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface TimelineScreenProps {
    stepData: TimelineStep;
    selectedValue: string;
    onSelect: (value: string) => void;
    onAutoAdvance?: () => void;
    theme: {
        optionSelectedBorder: string;
        optionSelectedShadow: string;
        optionHover: string;
    };
}

const TimelineScreen: React.FC<TimelineScreenProps> = ({ stepData, selectedValue, onSelect, onAutoAdvance, theme }) => {
    const handleOptionSelect = (value: string) => {
        console.log('Timeline option selected:', value);
        onSelect(value);
        
        // For timeline step, trigger auto-advance immediately since this is the final selection
        if (onAutoAdvance) {
            console.log('Timeline selection complete, triggering auto-advance');
            // Small delay to ensure the selection is processed
            setTimeout(() => {
                onAutoAdvance();
            }, 100); // Reduced delay for faster response
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6 text-white/90">
             <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm">{stepData.description}</p>
            <TooltipProvider>
                <div className="grid grid-cols-2 gap-3 w-full">
                    {stepData.options.map((option, index) => (
                        <Tooltip key={index} delayDuration={200}>
                            <TooltipTrigger asChild>
                                <Card
                                    onClick={() => handleOptionSelect(option.value || option.title)}
                                    className={cn(
                                        'cursor-pointer transition-all duration-300 bg-black/20 border-2 h-20 flex items-center justify-center text-center',
                                        selectedValue === (option.value || option.title)
                                            ? `${theme.optionSelectedBorder} ${theme.optionSelectedShadow} scale-105` 
                                            : `border-white/20 ${theme.optionHover}`
                                    )}
                                >
                                    <CardContent className="p-3 flex items-center justify-center">
                                        <span className="text-sm font-semibold font-mono text-white text-center">{option.title}</span>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-black/80 text-white border-white/20 p-3">
                                <p className="font-mono text-sm text-center">{option.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
};

export default TimelineScreen;

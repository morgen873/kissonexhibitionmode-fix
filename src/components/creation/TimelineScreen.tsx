
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
    theme: {
        optionSelectedBorder: string;
        optionSelectedShadow: string;
        optionHover: string;
    };
}

const TimelineScreen: React.FC<TimelineScreenProps> = ({ stepData, selectedValue, onSelect, theme }) => {
    return (
        <div className="w-full flex flex-col items-center space-y-8 text-white/90">
             <p className="text-center text-white/80 whitespace-pre-line">{stepData.description}</p>
            <TooltipProvider>
                <div className="flex flex-wrap justify-center gap-4">
                    {stepData.options.map((option, index) => (
                        <Tooltip key={index} delayDuration={200}>
                            <TooltipTrigger asChild>
                                <Card
                                    onClick={() => onSelect(option.title)}
                                    className={cn(
                                        'cursor-pointer transition-all duration-300 bg-black/20 border-2 h-24 w-36 flex items-center justify-center text-center',
                                        selectedValue === option.title 
                                            ? `${theme.optionSelectedBorder} ${theme.optionSelectedShadow} scale-105` 
                                            : `border-white/20 ${theme.optionHover}`
                                    )}
                                >
                                    <CardContent className="p-4">
                                        <span className="text-base font-semibold">{option.title}</span>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-black/80 text-white border-white/20 p-3">
                                <p>{option.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
};

export default TimelineScreen;

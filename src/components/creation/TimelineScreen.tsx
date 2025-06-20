
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
        <div className="w-full flex flex-col items-center space-y-8 my-8 text-foreground/90">
             <p className="text-center text-foreground/80 whitespace-pre-line">{stepData.description}</p>
            <TooltipProvider>
                <div className="flex flex-wrap justify-center gap-4">
                    {stepData.options.map((option, index) => (
                        <Tooltip key={index} delayDuration={200}>
                            <TooltipTrigger asChild>
                                <Card
                                    onClick={() => onSelect(option.title)}
                                    className={cn(
                                        'cursor-pointer transition-all duration-300 bg-card/50 border-2 h-24 w-36 flex items-center justify-center text-center p-2 hover:shadow-lg',
                                        selectedValue === option.title 
                                            ? 'border-foreground shadow-lg shadow-foreground/20 scale-105 bg-card' 
                                            : 'border-border hover:border-foreground/50 hover:bg-card/70'
                                    )}
                                >
                                    <CardContent className="p-0">
                                        <span className="text-base font-semibold text-foreground">{option.title}</span>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-card/90 text-foreground border-border/50 p-3">
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

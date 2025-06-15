
import React from 'react';
import { TimelineStep } from '@/types/creation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
        <div className="w-full flex flex-col items-center space-y-8 my-8 text-white/90">
             <p className="text-center text-white/80 whitespace-pre-line">{stepData.description}</p>
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full max-w-md"
            >
                <CarouselContent>
                    {stepData.options.map((option, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3">
                            <div className="p-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Card
                                                onClick={() => onSelect(option.title)}
                                                className={cn(
                                                    'cursor-pointer transition-all duration-300 bg-black/20 border-2 h-24 flex items-center justify-center',
                                                    selectedValue === option.title 
                                                        ? `${theme.optionSelectedBorder} ${theme.optionSelectedShadow} scale-105` 
                                                        : `border-white/20 ${theme.optionHover}`
                                                )}
                                            >
                                                <CardContent className="p-0">
                                                    <span className="text-base font-semibold text-center">{option.title}</span>
                                                </CardContent>
                                            </Card>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-xs bg-black/80 text-white border-white/20 p-3">
                                            <p>{option.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="text-white bg-black/30 hover:bg-white/20 border-white/20" />
                <CarouselNext className="text-white bg-black/30 hover:bg-white/20 border-white/20" />
            </Carousel>
        </div>
    );
};

export default TimelineScreen;

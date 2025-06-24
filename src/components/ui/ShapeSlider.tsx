
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import ShapeIcon from './ShapeIcon';

interface ShapeSliderProps {
    value: number;
    options: string[];
    selectedOption: string;
    onValueChange: (value: number) => void;
}

const ShapeSlider: React.FC<ShapeSliderProps> = ({
    value,
    options,
    selectedOption,
    onValueChange
}) => {
    const handleSliderChange = (values: number[]) => {
        onValueChange(values[0]);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="font-bold text-base font-mono text-white">Shape</Label>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/30 border border-white/20">
                    <ShapeIcon shape={selectedOption} size={16} className="text-white" />
                    <span className="capitalize font-mono text-sm text-white">
                        {selectedOption}
                    </span>
                </div>
            </div>
            <div className="px-2">
                <Slider
                    value={[value]}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={options.length - 1}
                    step={1}
                    className="w-full"
                />
            </div>
            <div className="flex justify-between px-2">
                {options.map((option, index) => (
                    <div
                        key={option}
                        className={`flex flex-col items-center gap-1 transition-all ${
                            index === value ? 'scale-110' : 'scale-90 opacity-60'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            index === value 
                                ? 'bg-white/20 shadow-lg shadow-white/25' 
                                : 'bg-black/20'
                        }`}>
                            <ShapeIcon 
                                shape={option} 
                                size={14} 
                                className={`transition-colors ${
                                    index === value ? 'text-white' : 'text-white/40'
                                }`}
                            />
                        </div>
                        <span className={`text-xs font-mono capitalize transition-colors ${
                            index === value ? 'text-white' : 'text-white/40'
                        }`}>
                            {option}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShapeSlider;

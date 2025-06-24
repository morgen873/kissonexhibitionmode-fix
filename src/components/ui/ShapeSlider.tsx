
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
                <Label className="font-bold text-lg font-mono text-green-400">Shape</Label>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400/30 shadow-lg shadow-green-400/20">
                    <ShapeIcon shape={selectedOption} size={20} className="text-black" />
                    <span className="capitalize font-mono text-base text-black">
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
                        className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                            index === value ? 'scale-110' : 'scale-90 opacity-60'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            index === value 
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/20 border border-green-300' 
                                : 'bg-green-900/20 border border-green-400/20'
                        }`}>
                            <ShapeIcon 
                                shape={option} 
                                size={16} 
                                className={`transition-colors duration-300 ${
                                    index === value ? 'text-black' : 'text-green-400'
                                }`}
                            />
                        </div>
                        <span className={`text-sm font-mono capitalize transition-colors duration-300 ${
                            index === value ? 'text-green-400 font-semibold' : 'text-green-600'
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

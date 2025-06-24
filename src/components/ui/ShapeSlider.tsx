
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
                <Label className="font-bold text-lg font-serif text-amber-900">Shape</Label>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 shadow-sm">
                    <ShapeIcon shape={selectedOption} size={20} className="text-amber-800" />
                    <span className="capitalize font-serif text-base text-amber-900">
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
                                ? 'bg-gradient-to-br from-amber-200 to-orange-200 shadow-lg shadow-amber-900/20 border border-amber-300' 
                                : 'bg-amber-50/50 border border-amber-100'
                        }`}>
                            <ShapeIcon 
                                shape={option} 
                                size={16} 
                                className={`transition-colors duration-300 ${
                                    index === value ? 'text-amber-800' : 'text-amber-400'
                                }`}
                            />
                        </div>
                        <span className={`text-sm font-serif capitalize transition-colors duration-300 ${
                            index === value ? 'text-amber-900 font-semibold' : 'text-amber-600'
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

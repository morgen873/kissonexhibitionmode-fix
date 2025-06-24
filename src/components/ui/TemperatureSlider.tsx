
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface TemperatureSliderProps {
    value: number;
    min: number;
    max: number;
    unit: string;
    onValueChange: (value: number) => void;
}

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
    value,
    min,
    max,
    unit,
    onValueChange
}) => {
    const handleSliderChange = (values: number[]) => {
        onValueChange(values[0]);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="font-bold text-lg font-mono text-green-400">Temperature</Label>
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 font-mono text-base text-black border border-green-400/30 shadow-lg shadow-green-400/20">
                    {value} {unit}
                </span>
            </div>
            <div className="px-2">
                <Slider
                    value={[value]}
                    onValueChange={handleSliderChange}
                    min={min}
                    max={max}
                    step={10}
                    className="w-full"
                />
            </div>
            <div className="flex justify-between text-sm text-green-300 font-mono px-2">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
};

export default TemperatureSlider;

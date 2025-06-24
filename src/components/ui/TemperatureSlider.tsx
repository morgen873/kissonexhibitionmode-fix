
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
                <Label className="font-bold text-base font-mono text-white">Temperature</Label>
                <span className="px-3 py-1 rounded-md bg-black/30 font-mono text-sm text-white border border-white/20">
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
            <div className="flex justify-between text-xs text-white/60 font-mono px-2">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
};

export default TemperatureSlider;

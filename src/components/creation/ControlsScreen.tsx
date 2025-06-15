
import React from 'react';
import { ControlsStep } from '@/types/creation';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ControlsScreenProps {
    stepData: ControlsStep;
    controlValues: {
        temperature: number;
        shape: string;
        flavor: string;
    };
    onTemperatureChange: (value: number[]) => void;
    onShapeChange: (value: number[]) => void;
    onFlavorChange: (value: number[]) => void;
}

const ControlsScreen: React.FC<ControlsScreenProps> = ({
    stepData,
    controlValues,
    onTemperatureChange,
    onShapeChange,
    onFlavorChange,
}) => {
    const { controls } = stepData;
    const shapeIndex = controls.shape.options.indexOf(controlValues.shape);
    const flavorIndex = controls.flavor.options.indexOf(controlValues.flavor);

    return (
        <div className="space-y-8 my-8 text-white/90">
            <p className="text-center text-white/80 whitespace-pre-line">{stepData.description}</p>
            
            <div className="space-y-4">
                <Label className="font-bold text-lg">Temperature</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        step={1}
                        value={[controlValues.temperature]}
                        onValueChange={onTemperatureChange}
                    />
                    <span className="w-28 text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.temperature} {controls.temperature.unit}</span>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="font-bold text-lg">Shape</Label>
                 <div className="flex items-center gap-4">
                    <Slider
                        min={0}
                        max={controls.shape.options.length - 1}
                        step={1}
                        value={[shapeIndex]}
                        onValueChange={onShapeChange}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.shape}</span>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="font-bold text-lg">Flavor</Label>
                 <div className="flex items-center gap-4">
                    <Slider
                        min={0}
                        max={controls.flavor.options.length - 1}
                        step={1}
                        value={[flavorIndex]}
                        onValueChange={onFlavorChange}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.flavor}</span>
                </div>
            </div>
        </div>
    );
};

export default ControlsScreen;

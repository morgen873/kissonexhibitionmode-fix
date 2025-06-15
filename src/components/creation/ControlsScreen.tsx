
import React from 'react';
import { ControlsStep } from '@/types/creation';
import Knob from '@/components/ui/Knob';
import { Label } from '@/components/ui/label';

interface ControlsScreenProps {
    stepData: ControlsStep;
    controlValues: {
        temperature: number;
        shape: string;
        flavor: string;
    };
    onTemperatureChange: (value: number) => void;
    onShapeChange: (value: number) => void;
    onFlavorChange: (value: number) => void;
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg">Temperature</Label>
                    <Knob
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        step={1}
                        value={controlValues.temperature}
                        onValueChange={onTemperatureChange}
                        size={120}
                    />
                    <span className="w-28 text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.temperature} {controls.temperature.unit}</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg">Shape</Label>
                     <Knob
                        min={0}
                        max={controls.shape.options.length - 1}
                        step={1}
                        value={shapeIndex}
                        onValueChange={onShapeChange}
                        size={120}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.shape}</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg">Flavor</Label>
                     <Knob
                        min={0}
                        max={controls.flavor.options.length - 1}
                        step={1}
                        value={flavorIndex}
                        onValueChange={onFlavorChange}
                        size={120}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-black/20 font-mono">{controlValues.flavor}</span>
                </div>
            </div>
        </div>
    );
};

export default ControlsScreen;

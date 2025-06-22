
import React from 'react';
import { ControlsStep } from '@/types/creation';
import Knob from '@/components/ui/Knob';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ControlsScreenProps {
    stepData: ControlsStep;
    controlValues: {
        temperature: number;
        shape: string;
        flavor: string;
        enhancer: string;
    };
    onTemperatureChange: (value: number) => void;
    onShapeChange: (value: number) => void;
    onFlavorChange: (value: number) => void;
    onEnhancerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ControlsScreen: React.FC<ControlsScreenProps> = ({
    stepData,
    controlValues,
    onTemperatureChange,
    onShapeChange,
    onFlavorChange,
    onEnhancerChange,
}) => {
    const { controls } = stepData;
    const shapeIndex = controls.shape.options.indexOf(controlValues.shape);
    const flavorIndex = controls.flavor.options.indexOf(controlValues.flavor);

    return (
        <div className="space-y-8 text-white/90">
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm">{stepData.description}</p>
            
            {/* Horizontal layout for knobs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Temperature</Label>
                    <Knob
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        step={1}
                        value={controlValues.temperature}
                        onValueChange={onTemperatureChange}
                        size={80}
                    />
                    <span className="w-20 text-center p-2 rounded-md bg-black/20 font-mono text-sm">{controlValues.temperature} {controls.temperature.unit}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Shape</Label>
                     <Knob
                        min={0}
                        max={controls.shape.options.length - 1}
                        step={1}
                        value={shapeIndex}
                        onValueChange={onShapeChange}
                        size={80}
                    />
                    <span className="w-20 capitalize text-center p-2 rounded-md bg-black/20 font-mono text-sm">{controlValues.shape}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Flavor</Label>
                     <Knob
                        min={0}
                        max={controls.flavor.options.length - 1}
                        step={1}
                        value={flavorIndex}
                        onValueChange={onFlavorChange}
                        size={80}
                    />
                    <span className="w-20 capitalize text-center p-2 rounded-md bg-black/20 font-mono text-sm">{controlValues.flavor}</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-4">
                <Label htmlFor="enhancer" className="font-bold text-base text-center font-mono">What spice or condiment would enhance this experience?</Label>
                <p className="text-xs text-center text-white/70 max-w-full font-mono">Salt, pepper, cinnamon, honey... This will add the final touch of flavor to your memory recipe.</p>
                <Textarea
                    id="enhancer"
                    value={controlValues.enhancer}
                    onChange={onEnhancerChange}
                    placeholder="e.g., A pinch of cinnamon"
                    className="mt-2 w-full max-w-md bg-black/20 border-white/20 text-white placeholder:text-white/50 focus:ring-white focus:border-white p-3 font-mono text-sm"
                    rows={2}
                />
            </div>
        </div>
    );
};

export default ControlsScreen;

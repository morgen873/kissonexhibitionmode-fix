
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
        <div className="space-y-8 my-8 text-foreground/90">
            <p className="text-center text-foreground/80 whitespace-pre-line">{stepData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg text-foreground">Temperature</Label>
                    <Knob
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        step={1}
                        value={controlValues.temperature}
                        onValueChange={onTemperatureChange}
                        size={120}
                    />
                    <span className="w-28 text-center p-2 rounded-md bg-card/50 border border-border font-mono text-foreground">{controlValues.temperature} {controls.temperature.unit}</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg text-foreground">Shape</Label>
                     <Knob
                        min={0}
                        max={controls.shape.options.length - 1}
                        step={1}
                        value={shapeIndex}
                        onValueChange={onShapeChange}
                        size={120}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-card/50 border border-border font-mono text-foreground">{controlValues.shape}</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Label className="font-bold text-lg text-foreground">Flavor</Label>
                     <Knob
                        min={0}
                        max={controls.flavor.options.length - 1}
                        step={1}
                        value={flavorIndex}
                        onValueChange={onFlavorChange}
                        size={120}
                    />
                    <span className="w-28 capitalize text-center p-2 rounded-md bg-card/50 border border-border font-mono text-foreground">{controlValues.flavor}</span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-4">
                <Label htmlFor="enhancer" className="font-bold text-lg text-center text-foreground">What spice or condiment would enhance this experience?</Label>
                <p className="text-sm text-center text-foreground/70 max-w-md">Salt, pepper, cinnamon, honey... This will add the final touch of flavor to your memory recipe.</p>
                <Textarea
                    id="enhancer"
                    value={controlValues.enhancer}
                    onChange={onEnhancerChange}
                    placeholder="e.g., A pinch of cinnamon"
                    className="mt-2 w-full max-w-sm bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-foreground/20 focus:border-foreground"
                    rows={2}
                />
            </div>
        </div>
    );
};

export default ControlsScreen;

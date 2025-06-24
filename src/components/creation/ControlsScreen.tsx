
import React from 'react';
import { ControlsStep } from '@/types/creation';
import Knob from '@/components/ui/Knob';
import KnobWithIcons from '@/components/ui/KnobWithIcons';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

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

    const handleFlavorToggle = (pressed: boolean) => {
        // When pressed (true), set to "sweet" (index 1), when not pressed (false), set to "savory" (index 0)
        const newIndex = pressed ? 1 : 0;
        onFlavorChange(newIndex);
    };

    const isFlavorSweet = controlValues.flavor === 'sweet';

    return (
        <div className="space-y-8 text-white/90">
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm">{stepData.description}</p>
            
            {/* Horizontal layout for controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Temperature</Label>
                    <Knob
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        step={10}
                        value={controlValues.temperature}
                        onValueChange={onTemperatureChange}
                        size={80}
                    />
                    <span className="w-20 text-center p-2 rounded-md bg-black/20 font-mono text-sm">{controlValues.temperature} {controls.temperature.unit}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Shape</Label>
                    <KnobWithIcons
                        min={0}
                        max={controls.shape.options.length - 1}
                        step={1}
                        value={shapeIndex}
                        onValueChange={onShapeChange}
                        size={80}
                        options={controls.shape.options}
                        selectedOption={controlValues.shape}
                    />
                    <span className="w-20 capitalize text-center p-2 rounded-md bg-black/20 font-mono text-sm">{controlValues.shape}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Label className="font-bold text-base font-mono">Flavor</Label>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                            <span className={`font-mono text-sm transition-colors ${!isFlavorSweet ? 'text-white' : 'text-white/50'}`}>
                                Savory
                            </span>
                            <Toggle
                                pressed={isFlavorSweet}
                                onPressedChange={handleFlavorToggle}
                                className="data-[state=on]:bg-white/30 data-[state=off]:bg-white/10 border border-white/20 text-white hover:bg-white/20"
                                size="sm"
                            />
                            <span className={`font-mono text-sm transition-colors ${isFlavorSweet ? 'text-white' : 'text-white/50'}`}>
                                Sweet
                            </span>
                        </div>
                    </div>
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

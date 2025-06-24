
import React from 'react';
import { ControlsStep } from '@/types/creation';
import TemperatureSlider from '@/components/ui/TemperatureSlider';
import ShapeSlider from '@/components/ui/ShapeSlider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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

    const handleFlavorSwitch = (checked: boolean) => {
        // When checked (true), set to "sweet" (index 1), when not checked (false), set to "savory" (index 0)
        const newIndex = checked ? 1 : 0;
        onFlavorChange(newIndex);
    };

    const isFlavorSweet = controlValues.flavor === 'sweet';

    return (
        <div className="max-w-2xl mx-auto space-y-12 text-white/90">
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm leading-relaxed">
                {stepData.description}
            </p>
            
            {/* Vertical layout for controls */}
            <div className="space-y-10">
                {/* Temperature Control */}
                <div className="bg-black/10 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <TemperatureSlider
                        value={controlValues.temperature}
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        unit={controls.temperature.unit}
                        onValueChange={onTemperatureChange}
                    />
                </div>

                {/* Shape Control */}
                <div className="bg-black/10 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <ShapeSlider
                        value={shapeIndex}
                        options={controls.shape.options}
                        selectedOption={controlValues.shape}
                        onValueChange={onShapeChange}
                    />
                </div>

                {/* Flavor Control */}
                <div className="bg-black/10 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="space-y-4">
                        <Label className="font-bold text-base font-mono text-white">Flavor Profile</Label>
                        <div className="flex justify-center">
                            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/10">
                                <span className={`font-mono text-sm transition-colors ${!isFlavorSweet ? 'text-white font-semibold' : 'text-white/50'}`}>
                                    Savory
                                </span>
                                <Switch
                                    checked={isFlavorSweet}
                                    onCheckedChange={handleFlavorSwitch}
                                    className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/10 border border-white/20"
                                />
                                <span className={`font-mono text-sm transition-colors ${isFlavorSweet ? 'text-white font-semibold' : 'text-white/50'}`}>
                                    Sweet
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="px-3 py-1 rounded-md bg-black/30 font-mono text-sm text-white border border-white/20 capitalize">
                                {controlValues.flavor}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enhancer Control */}
                <div className="bg-black/10 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="space-y-4">
                        <Label htmlFor="enhancer" className="font-bold text-base text-center font-mono text-white block">
                            What spice or condiment would enhance this experience?
                        </Label>
                        <p className="text-xs text-center text-white/70 font-mono leading-relaxed">
                            Salt, pepper, cinnamon, honey... This will add the final touch of flavor to your memory recipe.
                        </p>
                        <Textarea
                            id="enhancer"
                            value={controlValues.enhancer}
                            onChange={onEnhancerChange}
                            placeholder="e.g., A pinch of cinnamon"
                            className="w-full bg-black/20 border-white/20 text-white placeholder:text-white/50 focus:ring-white focus:border-white p-4 font-mono text-sm resize-none"
                            rows={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlsScreen;

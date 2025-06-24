
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
        <div className="max-w-3xl mx-auto space-y-8 text-green-100">
            <p className="text-center text-green-200 whitespace-pre-line font-mono text-lg leading-relaxed">
                {stepData.description}
            </p>
            
            {/* Vertical layout for controls */}
            <div className="space-y-8">
                {/* Temperature Control */}
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-green-400/20 shadow-xl shadow-green-400/10">
                    <TemperatureSlider
                        value={controlValues.temperature}
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        unit={controls.temperature.unit}
                        onValueChange={onTemperatureChange}
                    />
                </div>

                {/* Shape Control */}
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-green-400/20 shadow-xl shadow-green-400/10">
                    <ShapeSlider
                        value={shapeIndex}
                        options={controls.shape.options}
                        selectedOption={controlValues.shape}
                        onValueChange={onShapeChange}
                    />
                </div>

                {/* Flavor Control */}
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-green-400/20 shadow-xl shadow-green-400/10">
                    <div className="space-y-6">
                        <Label className="font-bold text-lg font-mono text-green-400 block text-center">Flavor Profile</Label>
                        <div className="flex justify-center">
                            <div className="flex items-center gap-6 bg-green-900/20 p-6 rounded-xl border border-green-400/30 shadow-inner">
                                <span className={`font-mono text-lg transition-colors duration-300 ${!isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                                    Savory
                                </span>
                                <Switch
                                    checked={isFlavorSweet}
                                    onCheckedChange={handleFlavorSwitch}
                                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-emerald-500 data-[state=unchecked]:bg-green-900/50 border border-green-400/30"
                                />
                                <span className={`font-mono text-lg transition-colors duration-300 ${isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                                    Sweet
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 font-mono text-base text-black border border-green-400/30 shadow-lg shadow-green-400/20 capitalize">
                                {controlValues.flavor}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enhancer Control */}
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-green-400/20 shadow-xl shadow-green-400/10">
                    <div className="space-y-6">
                        <Label htmlFor="enhancer" className="font-bold text-lg text-center font-mono text-green-400 block">
                            What spice or condiment would enhance this experience?
                        </Label>
                        <p className="text-base text-center text-green-300 font-mono leading-relaxed">
                            Salt, pepper, cinnamon, honey... This will add the final touch of flavor to your memory recipe.
                        </p>
                        <Textarea
                            id="enhancer"
                            value={controlValues.enhancer}
                            onChange={onEnhancerChange}
                            placeholder="e.g., A pinch of cinnamon"
                            className="w-full bg-green-900/20 border border-green-400/30 text-green-100 placeholder:text-green-500 focus:ring-green-400 focus:border-green-400 p-6 font-mono text-base resize-none rounded-xl shadow-inner"
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlsScreen;


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
        <div className="max-w-3xl mx-auto space-y-8 text-amber-900">
            <p className="text-center text-amber-800 whitespace-pre-line font-serif text-lg leading-relaxed">
                {stepData.description}
            </p>
            
            {/* Vertical layout for controls */}
            <div className="space-y-8">
                {/* Temperature Control */}
                <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-xl p-8 rounded-2xl border border-amber-200/50 shadow-xl shadow-amber-900/10">
                    <TemperatureSlider
                        value={controlValues.temperature}
                        min={controls.temperature.min}
                        max={controls.temperature.max}
                        unit={controls.temperature.unit}
                        onValueChange={onTemperatureChange}
                    />
                </div>

                {/* Shape Control */}
                <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-xl p-8 rounded-2xl border border-amber-200/50 shadow-xl shadow-amber-900/10">
                    <ShapeSlider
                        value={shapeIndex}
                        options={controls.shape.options}
                        selectedOption={controlValues.shape}
                        onValueChange={onShapeChange}
                    />
                </div>

                {/* Flavor Control */}
                <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-xl p-8 rounded-2xl border border-amber-200/50 shadow-xl shadow-amber-900/10">
                    <div className="space-y-6">
                        <Label className="font-bold text-lg font-serif text-amber-900 block text-center">Flavor Profile</Label>
                        <div className="flex justify-center">
                            <div className="flex items-center gap-6 bg-gradient-to-r from-amber-100/80 to-orange-100/80 p-6 rounded-xl border border-amber-200/50 shadow-sm">
                                <span className={`font-serif text-lg transition-colors duration-300 ${!isFlavorSweet ? 'text-amber-900 font-semibold' : 'text-amber-600'}`}>
                                    Savory
                                </span>
                                <Switch
                                    checked={isFlavorSweet}
                                    onCheckedChange={handleFlavorSwitch}
                                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-400 data-[state=checked]:to-red-500 data-[state=unchecked]:bg-amber-200 border border-amber-300"
                                />
                                <span className={`font-serif text-lg transition-colors duration-300 ${isFlavorSweet ? 'text-amber-900 font-semibold' : 'text-amber-600'}`}>
                                    Sweet
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 font-serif text-base text-amber-900 border border-amber-200/50 shadow-sm capitalize">
                                {controlValues.flavor}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enhancer Control */}
                <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-xl p-8 rounded-2xl border border-amber-200/50 shadow-xl shadow-amber-900/10">
                    <div className="space-y-6">
                        <Label htmlFor="enhancer" className="font-bold text-lg text-center font-serif text-amber-900 block">
                            What spice or condiment would enhance this experience?
                        </Label>
                        <p className="text-base text-center text-amber-700 font-serif leading-relaxed">
                            Salt, pepper, cinnamon, honey... This will add the final touch of flavor to your memory recipe.
                        </p>
                        <Textarea
                            id="enhancer"
                            value={controlValues.enhancer}
                            onChange={onEnhancerChange}
                            placeholder="e.g., A pinch of cinnamon"
                            className="w-full bg-gradient-to-br from-white/90 to-amber-50/90 border-amber-200 text-amber-900 placeholder:text-amber-500 focus:ring-amber-400 focus:border-amber-400 p-6 font-serif text-base resize-none rounded-xl shadow-sm"
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlsScreen;


import React from 'react';
import { ControlsStep } from '@/types/creation';
import TemperatureSlider from '@/components/ui/TemperatureSlider';
import ShapeSlider from '@/components/ui/ShapeSlider';
import KnobWithIcons from '@/components/ui/KnobWithIcons';
import EnhancerInput from './EnhancerInput';

interface ControlsScreenProps {
    stepData: ControlsStep;
    controlValues: { temperature: number; shape: string; flavor: string; enhancer: string; };
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
    onEnhancerChange
}) => {
    const { controls } = stepData;

    const getShapeIndex = () => {
        return controls.shape.options.indexOf(controlValues.shape);
    };

    const getFlavorIndex = () => {
        return controls.flavor.options.indexOf(controlValues.flavor);
    };

    return (
        <div className="w-full space-y-8 text-white/90">
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm mb-8">
                {stepData.description}
            </p>
            
            {/* Temperature Control */}
            <div className="bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <TemperatureSlider
                    value={controlValues.temperature}
                    min={controls.temperature.min}
                    max={controls.temperature.max}
                    unit={controls.temperature.unit}
                    onValueChange={onTemperatureChange}
                />
            </div>

            {/* Shape Control */}
            <div className="bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <ShapeSlider
                    value={getShapeIndex()}
                    options={controls.shape.options}
                    selectedOption={controlValues.shape}
                    onValueChange={onShapeChange}
                />
            </div>

            {/* Flavor Control - Restored toggle functionality */}
            <div className="bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <KnobWithIcons
                    label="Flavor"
                    value={getFlavorIndex()}
                    options={controls.flavor.options}
                    selectedOption={controlValues.flavor}
                    onValueChange={onFlavorChange}
                />
            </div>

            {/* Enhancer Input */}
            <div className="bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <EnhancerInput 
                    value={controlValues.enhancer}
                    onChange={onEnhancerChange}
                    placeholder={controls.enhancer?.placeholder || "Add any special touches or modifications..."}
                />
            </div>
        </div>
    );
};

export default ControlsScreen;


import React from 'react';
import { ControlsStep } from '@/types/creation';
import KnobWithIcons from '@/components/ui/KnobWithIcons';
import TemperatureKnob from './TemperatureKnob';
import FlavorControl from './FlavorControl';

interface ControlsKnobsProps {
    controls: ControlsStep['controls'];
    controlValues: { temperature: number; shape: string; flavor: string; enhancer: string; };
    onTemperatureChange: (value: number) => void;
    onShapeChange: (value: number) => void;
    onFlavorChange: (value: number) => void;
}

const ControlsKnobs: React.FC<ControlsKnobsProps> = ({
    controls,
    controlValues,
    onTemperatureChange,
    onShapeChange,
    onFlavorChange
}) => {
    const getShapeIndex = () => {
        return controls.shape.options.indexOf(controlValues.shape);
    };

    return (
        <div className="flex justify-center items-center gap-8">
            {/* Temperature Control */}
            <TemperatureKnob
                min={controls.temperature.min}
                max={controls.temperature.max}
                value={controlValues.temperature}
                onValueChange={onTemperatureChange}
            />

            {/* Shape Control */}
            <div className="flex flex-col items-center justify-center">
                <KnobWithIcons
                    min={0}
                    max={controls.shape.options.length - 1}
                    value={getShapeIndex()}
                    onValueChange={onShapeChange}
                    size={120}
                    step={1}
                    options={controls.shape.options}
                    selectedOption={controlValues.shape}
                />
            </div>

            {/* Flavor Control */}
            <FlavorControl
                flavor={controlValues.flavor}
                onFlavorChange={onFlavorChange}
            />
        </div>
    );
};

export default ControlsKnobs;

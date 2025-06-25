
import React, { useEffect, useRef } from 'react';
import { ControlsStep } from '@/types/creation';
import TemperatureSlider from '@/components/ui/TemperatureSlider';
import ShapeSlider from '@/components/ui/ShapeSlider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const { controls } = stepData;

    // Force scroll to top when component mounts
    useEffect(() => {
        console.log('ControlsScreen mounted, forcing scroll to top');
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            console.log('Container scrollTop set to 0');
        }
        
        // Also try to scroll any parent containers to top
        const scrollableParents = document.querySelectorAll('[class*="overflow"]');
        scrollableParents.forEach(parent => {
            (parent as HTMLElement).scrollTop = 0;
        });
        
        // Force window scroll to top as well
        window.scrollTo(0, 0);
    }, []);

    const getShapeIndex = () => {
        return controls.shape.options.indexOf(controlValues.shape);
    };

    const handleFlavorToggle = (checked: boolean) => {
        // Convert boolean to index: false = 0 (savory), true = 1 (sweet)
        onFlavorChange(checked ? 1 : 0);
    };

    const isFlavorSweet = controlValues.flavor === 'sweet';

    return (
        <div 
            ref={containerRef}
            className="w-full flex flex-col space-y-6 text-white/90 overflow-y-auto"
            style={{ scrollBehavior: 'auto' }}
        >
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm mb-6 w-full">
                {stepData.description}
            </p>
            
            {/* Temperature Control */}
            <div className="w-full bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <TemperatureSlider
                    value={controlValues.temperature}
                    min={controls.temperature.min}
                    max={controls.temperature.max}
                    onValueChange={onTemperatureChange}
                />
            </div>

            {/* Shape Control */}
            <div className="w-full bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <ShapeSlider
                    value={getShapeIndex()}
                    options={controls.shape.options}
                    selectedOption={controlValues.shape}
                    onValueChange={onShapeChange}
                />
            </div>

            {/* Flavor Control - TOGGLE SWITCH ONLY */}
            <div className="w-full bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="font-bold text-lg font-mono text-green-400">Flavor</Label>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400/30 shadow-lg shadow-green-400/20">
                            <span className="capitalize font-mono text-base text-black">
                                {controlValues.flavor}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`font-mono text-base transition-colors ${!isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                            Savory
                        </span>
                        <Switch
                            checked={isFlavorSweet}
                            onCheckedChange={handleFlavorToggle}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-900/50"
                        />
                        <span className={`font-mono text-base transition-colors ${isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                            Sweet
                        </span>
                    </div>
                </div>
            </div>

            {/* Enhancer Input */}
            <div className="w-full bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
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

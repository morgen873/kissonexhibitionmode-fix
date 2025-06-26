
import React, { useEffect, useRef } from 'react';
import { ControlsStep } from '@/types/creation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Knob from '@/components/ui/Knob';
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

    // Generate temperature markings for analog oven dial
    const generateTempMarkings = () => {
        const markings = [];
        const minTemp = controls.temperature.min;
        const maxTemp = controls.temperature.max;
        const step = 50; // Show markings every 50 degrees
        const minAngle = -135;
        const maxAngle = 135;
        const totalAngle = maxAngle - minAngle;
        
        for (let temp = minTemp; temp <= maxTemp; temp += step) {
            const percent = (temp - minTemp) / (maxTemp - minTemp);
            const angle = minAngle + (percent * totalAngle);
            const radians = (angle * Math.PI) / 180;
            const radius = 120 * 0.65; // Position markings outside the knob
            
            const x = Math.sin(radians) * radius;
            const y = -Math.cos(radians) * radius;
            
            markings.push({
                temp,
                x,
                y,
                angle
            });
        }
        
        return markings;
    };

    const tempMarkings = generateTempMarkings();

    return (
        <div 
            ref={containerRef}
            className="w-full flex flex-col space-y-6 text-white/90 overflow-y-auto"
            style={{ scrollBehavior: 'auto' }}
        >
            <p className="text-center text-white/80 whitespace-pre-line font-mono text-sm mb-6 w-full">
                {stepData.description}
            </p>
            
            {/* Labels Row */}
            <div className="flex justify-center items-center gap-8 px-8">
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <Label className="font-bold text-lg font-mono text-green-400">Temperature</Label>
                </div>
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <Label className="font-bold text-lg font-mono text-green-400">Shape</Label>
                </div>
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <Label className="font-bold text-lg font-mono text-green-400">Flavor</Label>
                </div>
            </div>

            {/* Knobs Row */}
            <div className="flex justify-center items-center gap-8">
                {/* Temperature Control */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative" style={{ width: 120 * 1.6, height: 120 * 1.6 }}>
                        {/* Temperature markings around the knob */}
                        {tempMarkings.map((marking) => (
                            <div
                                key={marking.temp}
                                className="absolute flex items-center justify-center"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${marking.x}px, ${marking.y}px)`,
                                }}
                            >
                                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
                                    <span className="text-xs font-mono text-white/80">
                                        {marking.temp}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {/* Temperature knob */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Knob
                                min={controls.temperature.min}
                                max={controls.temperature.max}
                                value={controlValues.temperature}
                                onValueChange={onTemperatureChange}
                                size={120}
                                step={10}
                            />
                        </div>
                    </div>
                </div>

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
                <div className="flex flex-col items-center justify-center" style={{ width: 120 * 1.6, height: 120 * 1.6 }}>
                    <div className="flex flex-col items-center space-y-4">
                        <span className={`font-mono text-sm transition-colors ${isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                            Sweet
                        </span>
                        <Switch
                            checked={!isFlavorSweet}
                            onCheckedChange={(checked) => handleFlavorToggle(!checked)}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-900/50 rotate-90"
                        />
                        <span className={`font-mono text-sm transition-colors ${!isFlavorSweet ? 'text-green-400 font-semibold' : 'text-green-600'}`}>
                            Savory
                        </span>
                    </div>
                </div>
            </div>

            {/* Parameter Values Row */}
            <div className="flex justify-center items-center gap-8 px-8">
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400/30 shadow-lg shadow-green-400/20">
                        <span className="font-mono text-base text-black">
                            {controlValues.temperature}{controls.temperature.unit}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400/30 shadow-lg shadow-green-400/20">
                        <span className="capitalize font-mono text-base text-black">
                            {controlValues.shape}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center" style={{ width: 120 * 1.6 }}>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400/30 shadow-lg shadow-green-400/20">
                        <span className="capitalize font-mono text-base text-black">
                            {controlValues.flavor}
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

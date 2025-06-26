
import React from 'react';
import Knob from '@/components/ui/Knob';

interface TemperatureKnobProps {
    min: number;
    max: number;
    value: number;
    onValueChange: (value: number) => void;
}

const TemperatureKnob: React.FC<TemperatureKnobProps> = ({
    min,
    max,
    value,
    onValueChange
}) => {
    const generateTempMarkings = () => {
        const markings = [];
        const step = 50; // Show markings every 50 degrees
        const minAngle = -135;
        const maxAngle = 135;
        const totalAngle = maxAngle - minAngle;
        
        for (let temp = min; temp <= max; temp += step) {
            const percent = (temp - min) / (max - min);
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
                        min={min}
                        max={max}
                        value={value}
                        onValueChange={onValueChange}
                        size={120}
                        step={10}
                    />
                </div>
            </div>
        </div>
    );
};

export default TemperatureKnob;

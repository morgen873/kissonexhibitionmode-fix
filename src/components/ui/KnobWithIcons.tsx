
import React, { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import ShapeIcon from './ShapeIcon';

interface KnobWithIconsProps {
    min?: number;
    max?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    size?: number;
    step?: number;
    className?: string;
    options?: string[];
    selectedOption?: string;
}

const KnobWithIcons: React.FC<KnobWithIconsProps> = ({
    min = 0,
    max = 100,
    value = 0,
    onValueChange,
    size = 100,
    step = 1,
    className,
    options = [],
    selectedOption = '',
}) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const minAngle = -135;
    const maxAngle = 135;

    const angleToValue = useCallback((angle: number) => {
        const percent = (angle - minAngle) / (maxAngle - minAngle);
        let newValue = min + percent * (max - min);
        
        newValue = Math.round(newValue / step) * step;
        
        return Math.max(min, Math.min(max, newValue));
    }, [min, max, minAngle, maxAngle, step]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!knobRef.current) return;
        const { left, top, width, height } = knobRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        let angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);

        angleDeg = Math.max(minAngle, Math.min(maxAngle, angleDeg));

        const newValue = angleToValue(angleDeg);
        
        if (onValueChange && newValue !== value) {
            onValueChange(newValue);
        }
    }, [angleToValue, maxAngle, minAngle, onValueChange, value]);

    const handleMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);
    
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        let newValue = value;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            newValue = Math.min(max, value + step);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            newValue = Math.max(min, value - step);
        } else {
            return;
        }
        e.preventDefault();
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    const valueToAngle = (v: number) => {
        const range = max - min;
        if (range === 0) return minAngle;
        const percent = (v - min) / range;
        return minAngle + percent * (maxAngle - minAngle);
    };
    
    const currentAngleDeg = valueToAngle(value);

    // Calculate icon positions around the knob
    const getIconPosition = (index: number, total: number) => {
        const angleStep = (maxAngle - minAngle) / (total - 1);
        const angle = minAngle + (angleStep * index);
        const radians = (angle * Math.PI) / 180;
        const radius = size * 0.65; // Position icons outside the knob
        
        return {
            x: Math.sin(radians) * radius,
            y: -Math.cos(radians) * radius,
            angle: angle
        };
    };

    return (
        <div className="relative" style={{ width: size * 1.6, height: size * 1.6 }}>
            {/* Icons around the knob */}
            {options.map((option, index) => {
                const position = getIconPosition(index, options.length);
                const isSelected = selectedOption === option;
                
                return (
                    <div
                        key={option}
                        className="absolute flex items-center justify-center"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                        }}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isSelected 
                                ? "bg-white/20 shadow-lg shadow-white/50 scale-110" 
                                : "bg-black/20 hover:bg-white/10"
                        )}>
                            <ShapeIcon 
                                shape={option} 
                                size={14} 
                                className={cn(
                                    "transition-colors",
                                    isSelected ? "text-white" : "text-white/60"
                                )}
                            />
                        </div>
                    </div>
                );
            })}
            
            {/* Main knob */}
            <div
                ref={knobRef}
                className={cn(
                    "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    "rounded-full bg-gray-900 border-2 border-gray-700 shadow-inner cursor-pointer select-none",
                    "flex items-center justify-center",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white",
                    className
                )}
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
            >
                <div className="absolute w-[85%] h-[85%] bg-gray-800/50 rounded-full shadow-inner" />
                <div
                    className="absolute w-full h-full"
                    style={{ transform: `rotate(${currentAngleDeg}deg)` }}
                >
                    <div
                        className="absolute bg-white rounded-full shadow-md shadow-white/50"
                        style={{
                            top: '10%',
                            left: '50%',
                            width: '12%',
                            height: '12%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    ></div>
                </div>
                <div className="absolute w-3/4 h-3/4 bg-black rounded-full shadow-md" />
            </div>
        </div>
    );
};

export default KnobWithIcons;

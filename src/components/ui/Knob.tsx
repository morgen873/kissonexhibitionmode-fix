
import React, { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface KnobProps {
    min?: number;
    max?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    size?: number;
    step?: number;
    className?: string;
}

const Knob: React.FC<KnobProps> = ({
    min = 0,
    max = 100,
    value = 0,
    onValueChange,
    size = 100,
    step = 1,
    className,
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

    return (
        <div
            ref={knobRef}
            className={cn(
                "relative rounded-full bg-muted border-2 border-border shadow-inner cursor-pointer select-none",
                "flex items-center justify-center",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-foreground/20",
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
            <div className="absolute w-[85%] h-[85%] bg-muted/50 rounded-full shadow-inner" />
            <div
                className="absolute w-full h-full"
                style={{ transform: `rotate(${currentAngleDeg}deg)` }}
            >
                <div
                    className="absolute bg-foreground rounded-full shadow-md shadow-foreground/20"
                    style={{
                        top: '10%',
                        left: '50%',
                        width: '12%',
                        height: '12%',
                        transform: 'translate(-50%, -50%)',
                    }}
                ></div>
            </div>
            <div className="absolute w-3/4 h-3/4 bg-background rounded-full shadow-md border border-border/30" />
        </div>
    );
};

export default Knob;

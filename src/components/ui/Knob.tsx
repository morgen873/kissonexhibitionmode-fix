
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

    const calculateAngleFromPosition = useCallback((clientX: number, clientY: number) => {
        if (!knobRef.current) return null;
        const { left, top, width, height } = knobRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        
        let angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);
        angleDeg = Math.max(minAngle, Math.min(maxAngle, angleDeg));
        
        return angleDeg;
    }, [minAngle, maxAngle]);

    const handleMove = useCallback((clientX: number, clientY: number) => {
        const angleDeg = calculateAngleFromPosition(clientX, clientY);
        if (angleDeg === null) return;

        const newValue = angleToValue(angleDeg);
        
        if (onValueChange && newValue !== value) {
            onValueChange(newValue);
        }
    }, [calculateAngleFromPosition, angleToValue, onValueChange, value]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    }, [handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            handleMove(touch.clientX, touch.clientY);
        }
    }, [handleMove]);

    const handleMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleTouchEnd = useCallback(() => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    }, [handleTouchMove]);
    
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    }, [handleTouchMove, handleTouchEnd]);

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
                "relative rounded-full bg-gray-900 border-2 border-gray-700 shadow-inner cursor-pointer select-none",
                "flex items-center justify-center touch-none",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white",
                className
            )}
            style={{ width: size, height: size }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
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
    );
};

export default Knob;

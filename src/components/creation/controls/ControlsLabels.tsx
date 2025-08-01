
import React from 'react';
import { Label } from '@/components/ui/label';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

const ControlsLabels: React.FC = () => {
    const { isMobile, isTouch } = useResponsiveLayout();
    
    const containerClass = isMobile 
        ? "flex justify-center items-center mobile-gap mobile-padding" 
        : "flex justify-center items-center gap-8 px-8";
    
    const labelClass = isMobile 
        ? "font-bold mobile-text font-mono text-green-400" 
        : isTouch 
        ? "font-bold touch-text-sm font-mono text-green-400"
        : "font-bold text-lg font-mono text-green-400";
    
    const itemWidth = isMobile ? "auto" : `${120 * 1.6}px`;
    
    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center" style={{ width: itemWidth }}>
                <Label className={labelClass}>Temperature</Label>
            </div>
            <div className="flex flex-col items-center" style={{ width: itemWidth }}>
                <Label className={labelClass}>Shape</Label>
            </div>
            <div className="flex flex-col items-center" style={{ width: itemWidth }}>
                <Label className={labelClass}>Flavor</Label>
            </div>
        </div>
    );
};

export default ControlsLabels;

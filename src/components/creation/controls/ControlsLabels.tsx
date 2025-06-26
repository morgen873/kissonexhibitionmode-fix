
import React from 'react';
import { Label } from '@/components/ui/label';

const ControlsLabels: React.FC = () => {
    return (
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
    );
};

export default ControlsLabels;

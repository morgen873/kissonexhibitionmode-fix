
import React from 'react';
import { ControlsStep } from '@/types/creation';

interface ControlsValuesProps {
    controls: ControlsStep['controls'];
    controlValues: { temperature: number; shape: string; flavor: string; enhancer: string; };
}

const ControlsValues: React.FC<ControlsValuesProps> = ({
    controls,
    controlValues
}) => {
    return (
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
    );
};

export default ControlsValues;

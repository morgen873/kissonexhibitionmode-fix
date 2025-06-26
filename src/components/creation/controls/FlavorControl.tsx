
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface FlavorControlProps {
    flavor: string;
    onFlavorChange: (value: number) => void;
}

const FlavorControl: React.FC<FlavorControlProps> = ({
    flavor,
    onFlavorChange
}) => {
    const handleFlavorToggle = (checked: boolean) => {
        // Convert boolean to index: false = 0 (savory), true = 1 (sweet)
        onFlavorChange(checked ? 1 : 0);
    };

    const isFlavorSweet = flavor === 'sweet';

    return (
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
    );
};

export default FlavorControl;

import React, { useEffect, useRef } from 'react';
import { ControlsStep } from '@/types/creation';
import EnhancerInput from './EnhancerInput';
import ControlsLabels from './controls/ControlsLabels';
import ControlsKnobs from './controls/ControlsKnobs';
import ControlsValues from './controls/ControlsValues';
interface ControlsScreenProps {
  stepData: ControlsStep;
  controlValues: {
    temperature: number;
    shape: string;
    flavor: string;
    enhancer: string;
  };
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
  const {
    controls
  } = stepData;

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
  return <div ref={containerRef} className="w-full flex flex-col space-y-6 text-white/90 overflow-y-auto" style={{
    scrollBehavior: 'auto'
  }}>
            <p className="text-center text-white/80 whitespace-pre-line font-mono mb-6 w-full text-lg font-bold">
                {stepData.description}
            </p>
            
            {/* Labels Row */}
            <ControlsLabels />

            {/* Knobs Row */}
            <ControlsKnobs controls={controls} controlValues={controlValues} onTemperatureChange={onTemperatureChange} onShapeChange={onShapeChange} onFlavorChange={onFlavorChange} />

            {/* Parameter Values Row */}
            <ControlsValues controls={controls} controlValues={controlValues} />

            {/* Enhancer Input */}
            <div className="w-full bg-black/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 shadow-lg shadow-green-400/5">
                <EnhancerInput value={controlValues.enhancer} onChange={onEnhancerChange} placeholder={controls.enhancer?.placeholder || "Add any special touches or modifications..."} />
            </div>
        </div>;
};
export default ControlsScreen;
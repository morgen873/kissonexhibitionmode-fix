
import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { RecipeResult } from '@/types/creation';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface RecipeLabelPreviewProps {
    recipe: RecipeResult;
}

const RecipeLabelPreview: React.FC<RecipeLabelPreviewProps> = ({ recipe }) => {
    const { isMobile, isTouch } = useResponsiveLayout();
    
    const containerClass = isMobile 
        ? "flex flex-col items-center mobile-gap" 
        : "flex flex-col items-center gap-3";
    
    const headingClass = isMobile 
        ? "mobile-heading-md" 
        : isTouch 
        ? "touch-text-sm font-semibold font-mono"
        : "text-lg font-semibold font-mono";
    
    const cardClass = isMobile 
        ? "w-full max-w-[200px] aspect-square p-2 bg-white text-black flex flex-col justify-between rounded-lg shadow-lg" 
        : "w-full max-w-[250px] lg:max-w-[300px] aspect-square p-2 bg-white text-black flex flex-col justify-between rounded-lg shadow-lg";
    
    const titleClass = isMobile 
        ? "text-[10px] font-bold truncate px-1 font-mono" 
        : "text-xs font-bold truncate px-2 font-mono";
    
    const qrSize = isMobile ? 80 : 120;
    const logoHeight = isMobile ? "h-6" : "h-10";
    
    return (
        <div className={containerClass}>
            <h3 className={headingClass}>Label Preview</h3>
            <div className={cardClass}>
                <div className="text-center pt-1">
                    <h4 className={titleClass}>{recipe.name}</h4>
                </div>
                <div className="flex-grow flex items-center justify-center p-3">
                     <QRCode value={recipe.qrData} size={qrSize} />
                </div>
                <div className="text-center pb-1">
                    <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="" className={`${logoHeight} mx-auto filter grayscale`} />
                </div>
            </div>
        </div>
    );
};

export default RecipeLabelPreview;

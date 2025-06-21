
import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { RecipeResult } from '@/types/creation';

interface RecipeLabelPreviewProps {
    recipe: RecipeResult;
}

const RecipeLabelPreview: React.FC<RecipeLabelPreviewProps> = ({ recipe }) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-semibold font-mono">Label Preview</h3>
            <div className="w-full max-w-[250px] lg:max-w-[300px] aspect-square p-2 bg-white text-black flex flex-col justify-between rounded-lg shadow-lg">
                <div className="text-center pt-1">
                    <h4 className="text-xs font-bold truncate px-2 font-mono">{recipe.name}</h4>
                </div>
                <div className="flex-grow flex items-center justify-center p-3">
                     <QRCode value={recipe.qrData} size={120} />
                </div>
                <div className="text-center pb-1">
                    <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="" className="h-10 mx-auto filter grayscale" />
                </div>
            </div>
        </div>
    );
};

export default RecipeLabelPreview;

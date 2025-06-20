
import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { RecipeResult } from '@/types/creation';

interface RecipePrintTemplateProps {
    recipe: RecipeResult;
}

const RecipePrintTemplate: React.FC<RecipePrintTemplateProps> = ({ recipe }) => {
    return (
        <div className="hidden">
            <div id="recipe-label-print">
                <div className="print-container">
                    <div className="title-section">
                        <h4>{recipe.name}</h4>
                    </div>
                    <div className="qr-section">
                        <QRCode value={recipe.qrData} size={160} />
                    </div>
                    <div className="logo-section">
                        <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="KISS ON logo" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePrintTemplate;

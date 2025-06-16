import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Printer, Save, Mail, RotateCcw } from 'lucide-react';
import { RecipeResult } from '@/types/creation';

interface RecipeResultScreenProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({ recipe, onReset }) => {
    
    const printRecipe = () => {
        const printContents = document.getElementById('recipe-label-print')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`
                <html>
                    <head>
                        <title>Print Recipe</title>
                        <style>
                            @page { size: 4in 6in; margin: 0.1in; }
                            body { 
                                margin: 0; 
                                font-family: Arial, sans-serif;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                            }
                        </style>
                    </head>
                    <body>${printContents}</body>
                </html>
            `);
            printWindow?.document.close();
            printWindow?.focus();
            setTimeout(() => {
                printWindow?.print();
                printWindow?.close();
            }, 250);
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-8 text-white/90 pb-8">
            <h2 className="text-3xl font-bold text-center">Your Memory KissOn Recipe</h2>

            {/* This is a hidden version for printing */}
            <div className="hidden">
                 <div id="recipe-label-print" style={{
                     width: '3.8in', 
                     height: '5.8in', 
                     padding: '0.3in 0.2in', 
                     display: 'flex', 
                     flexDirection: 'column', 
                     justifyContent: 'space-between', 
                     boxSizing: 'border-box',
                     backgroundColor: 'white',
                     color: 'black',
                     textAlign: 'center'
                 }}>
                     <div style={{paddingTop: '0.2in'}}>
                         <h4 style={{
                             fontSize: '18pt', 
                             fontWeight: 'bold', 
                             margin: '0',
                             lineHeight: '1.2',
                             wordWrap: 'break-word'
                         }}>{recipe.name}</h4>
                     </div>
                     <div style={{
                         flexGrow: 1, 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center',
                         padding: '0.3in 0'
                     }}>
                          <QRCode value={recipe.qrData} size={180} />
                     </div>
                     <div style={{paddingBottom: '0.2in'}}>
                         <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="" style={{
                             height: '0.8in', 
                             margin: '0 auto',
                             display: 'block'
                         }} />
                     </div>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-semibold">Generated Dumpling</h3>
                    <div className="w-full max-w-[300px]">
                        <img src={recipe.imageUrl} alt="Generated Dumpling" className="rounded-lg shadow-lg w-full aspect-square object-cover" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-semibold">Label Preview</h3>
                    <div className="w-full max-w-[300px] aspect-square p-2 bg-white text-black flex flex-col justify-between rounded-lg shadow-lg">
                        <div className="text-center pt-2">
                            <h4 className="text-sm font-bold truncate px-2">{recipe.name}</h4>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-4">
                             <QRCode value={recipe.qrData} size={140} />
                        </div>
                        <div className="text-center pb-2">
                            <img src="/lovable-uploads/64d3de25-5e40-498e-8a21-28d15db9a050.png" alt="" className="h-12 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={printRecipe}><Printer/> Print Label</Button>
                <Button variant="secondary"> <Save/> Save Recipe</Button>
                <Button variant="secondary"><Mail/> Email Recipe</Button>
            </div>
             <Button onClick={onReset} variant="outline" className="bg-transparent hover:bg-white/10 text-white mb-8">
                <RotateCcw className="mr-2" /> Create Another
            </Button>
        </div>
    );
};

export default RecipeResultScreen;

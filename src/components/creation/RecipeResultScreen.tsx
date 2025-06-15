
import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Printer, Save, Mail, RotateCcw } from 'lucide-react';

interface RecipeResult {
    name: string;
    imageUrl: string;
    qrData: string;
}

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
                            @page { size: 4in 6in; margin: 0; }
                            body { margin: 0; }
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
        <div className="w-full flex flex-col items-center space-y-8 text-white/90">
            <h2 className="text-3xl font-bold text-center">Your Memory KissOn Recipe</h2>

            {/* This is a hidden version for printing */}
            <div className="hidden">
                 <div id="recipe-label-print" style={{width: '4in', height: '6in', padding: '0.25in', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box'}}>
                     <div style={{textAlign: 'center'}}>
                         <h4 style={{fontSize: '24pt', fontWeight: 'bold', margin: '0'}}>{recipe.name}</h4>
                     </div>
                     <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <QRCode value={recipe.qrData} size={200} />
                     </div>
                     <div style={{textAlign: 'center'}}>
                         <img src="/kisson-logo.png" alt="" style={{height: '1in', margin: '0 auto'}} />
                     </div>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full">
                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-semibold">Generated Dumpling</h3>
                    <img src={recipe.imageUrl} alt="Generated Dumpling" className="rounded-lg shadow-lg w-full aspect-square object-cover" />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-xl font-semibold">Label Preview</h3>
                    <div className="w-full max-w-[250px] aspect-[4/6] p-2 bg-white text-black flex flex-col justify-between rounded-lg shadow-lg">
                        <div className="text-center">
                            <h4 className="text-sm font-bold truncate">{recipe.name}</h4>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-2">
                             <QRCode value={recipe.qrData} size={128} />
                        </div>
                        <div className="text-center">
                            <img src="/kisson-logo.png" alt="" className="h-8 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={printRecipe}><Printer/> Print Label</Button>
                <Button variant="secondary"> <Save/> Save Recipe</Button>
                <Button variant="secondary"><Mail/> Email Recipe</Button>
            </div>
             <Button onClick={onReset} variant="outline" className="bg-transparent hover:bg-white/10 text-white">
                <RotateCcw className="mr-2" /> Create Another
            </Button>
        </div>
    );
};

export default RecipeResultScreen;


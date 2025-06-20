
import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Printer, Save, Mail, RotateCcw } from 'lucide-react';
import { RecipeResult } from '@/types/creation';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface RecipeResultScreenProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({ recipe, onReset }) => {
    
    const printRecipe = () => {
        const printContents = document.getElementById('recipe-label-print')?.innerHTML;
        if (printContents) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`
                <html>
                    <head>
                        <title>Print Recipe</title>
                        <style>
                            @page { 
                                size: 4in 6in; 
                                margin: 0.1in; 
                            }
                            body { 
                                margin: 0; 
                                font-family: Arial, sans-serif;
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .print-container {
                                width: 3.8in;
                                height: 5.8in;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.3in 0.2in;
                                box-sizing: border-box;
                                background-color: white;
                                color: black;
                                text-align: center;
                            }
                            .title-section {
                                flex: 0 0 auto;
                                padding-top: 0.1in;
                                width: 100%;
                            }
                            .title-section h4 {
                                font-size: 16pt;
                                font-weight: bold;
                                margin: 0;
                                line-height: 1.2;
                                word-wrap: break-word;
                                hyphens: auto;
                            }
                            .qr-section {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 100%;
                            }
                            .logo-section {
                                flex: 0 0 auto;
                                padding-bottom: 0.1in;
                                width: 100%;
                            }
                            .logo-section img {
                                height: 0.7in;
                                width: auto;
                                max-width: 100%;
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

    const saveRecipe = async () => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                toast.error('Please sign in to save recipes');
                return;
            }

            // Check if recipe already exists in user's saved recipes
            const { data: existingRecipe, error: checkError } = await supabase
                .from('user_saved_recipes')
                .select('id')
                .eq('user_id', user.id)
                .eq('recipe_name', recipe.name)
                .maybeSingle();

            if (checkError) {
                console.error('Error checking existing recipe:', checkError);
                toast.error('Failed to check existing recipes');
                return;
            }

            if (existingRecipe) {
                toast.info('Recipe already saved to your collection');
                return;
            }

            // Save recipe to user's collection
            const { error: saveError } = await supabase
                .from('user_saved_recipes')
                .insert({
                    user_id: user.id,
                    recipe_name: recipe.name,
                    recipe_image_url: recipe.imageUrl,
                    qr_data: recipe.qrData
                });

            if (saveError) {
                console.error('Error saving recipe:', saveError);
                toast.error('Failed to save recipe');
                return;
            }

            toast.success('Recipe saved to your collection!');
        } catch (error) {
            console.error('Error saving recipe:', error);
            toast.error('Failed to save recipe');
        }
    };

    const emailRecipe = async () => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user?.email) {
                toast.error('Please sign in to email recipes');
                return;
            }

            // Call edge function to send email
            const { error } = await supabase.functions.invoke('send-recipe-email', {
                body: {
                    recipeName: recipe.name,
                    recipeImageUrl: recipe.imageUrl,
                    qrData: recipe.qrData,
                    userEmail: user.email
                }
            });

            if (error) {
                console.error('Error sending email:', error);
                toast.error('Failed to send recipe via email');
                return;
            }

            toast.success('Recipe sent to your email!');
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send recipe via email');
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-8 text-white/90 pb-8">
            <h2 className="text-3xl font-bold text-center">Your Memory KissOn Recipe</h2>

            {/* Hidden print version with proper vertical layout */}
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
                <Button variant="secondary" onClick={saveRecipe}> <Save/> Save Recipe</Button>
                <Button variant="secondary" onClick={emailRecipe}><Mail/> Email Recipe</Button>
            </div>
             <Button onClick={onReset} variant="outline" className="bg-transparent hover:bg-white/10 text-white mb-8">
                <RotateCcw className="mr-2" /> Create Another
            </Button>
        </div>
    );
};

export default RecipeResultScreen;

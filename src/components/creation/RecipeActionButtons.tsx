
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, RotateCcw } from 'lucide-react';
import { RecipeResult } from '@/types/creation';
import { useRecipePrint } from '@/hooks/useRecipePrint';

interface RecipeActionButtonsProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeActionButtons: React.FC<RecipeActionButtonsProps> = ({ recipe, onReset }) => {
    const { printRecipe } = useRecipePrint();

    const handlePrint = () => printRecipe(recipe);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handlePrint}>
                    <Printer /> Print Label
                </Button>
            </div>
            <Button 
                onClick={onReset} 
                variant="outline" 
                className="bg-transparent hover:bg-white/10 text-white mb-8"
            >
                <RotateCcw className="mr-2" /> Create Another
            </Button>
        </div>
    );
};

export default RecipeActionButtons;

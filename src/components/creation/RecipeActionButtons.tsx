
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Save, Mail, RotateCcw } from 'lucide-react';
import { RecipeResult } from '@/types/creation';
import { useRecipePrint } from '@/hooks/useRecipePrint';
import { useRecipeSave } from '@/hooks/useRecipeSave';
import { useRecipeEmail } from '@/hooks/useRecipeEmail';

interface RecipeActionButtonsProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeActionButtons: React.FC<RecipeActionButtonsProps> = ({ recipe, onReset }) => {
    const { printRecipe } = useRecipePrint();
    const { saveRecipe } = useRecipeSave();
    const { emailRecipe } = useRecipeEmail();

    const handlePrint = () => printRecipe(recipe);
    const handleSave = () => saveRecipe(recipe);
    const handleEmail = () => emailRecipe(recipe);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handlePrint}>
                    <Printer /> Print Label
                </Button>
                <Button variant="secondary" onClick={handleSave}>
                    <Save /> Save Recipe
                </Button>
                <Button variant="secondary" onClick={handleEmail}>
                    <Mail /> Email Recipe
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

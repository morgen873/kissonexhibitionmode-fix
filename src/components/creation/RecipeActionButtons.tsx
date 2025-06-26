
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipeResult } from '@/types/creation';
import { useRecipePrint } from '@/hooks/useRecipePrint';

interface RecipeActionButtonsProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeActionButtons: React.FC<RecipeActionButtonsProps> = ({ recipe, onReset }) => {
    const { printRecipe } = useRecipePrint();
    const navigate = useNavigate();

    const handlePrint = () => printRecipe(recipe);

    const handleGoHome = () => {
        onReset(); // Still call reset to clean up state
        navigate('/standby'); // Navigate to standby page
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handlePrint} className="bg-gradient-to-r from-black to-gray-800 text-white font-mono">
                    <Printer /> Print Label
                </Button>
            </div>
            <Button 
                onClick={handleGoHome} 
                variant="outline" 
                size="icon"
                className="bg-transparent hover:bg-white/10 text-white mb-8 border-white"
            >
                <Home />
            </Button>
        </div>
    );
};

export default RecipeActionButtons;

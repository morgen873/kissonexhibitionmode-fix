
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
        <div className="flex flex-col items-center touch-gap touch-dead-zone-bottom">
            <div className="flex flex-wrap justify-center touch-gap">
                <Button 
                    onClick={handlePrint} 
                    size="touch"
                    variant="touch"
                    className="bg-gradient-to-r from-black to-gray-800 text-white font-mono touch-target"
                >
                    <Printer className="mr-3 touch:mr-4 h-5 w-5 touch:h-8 touch:w-8" /> Print Label
                </Button>
            </div>
            <Button 
                onClick={handleGoHome} 
                variant="touch-outline" 
                size="touch-icon"
                className="bg-transparent hover:bg-white/10 text-white border-white touch-target"
            >
                <Home className="h-6 w-6 touch:h-10 touch:w-10" />
            </Button>
        </div>
    );
};

export default RecipeActionButtons;

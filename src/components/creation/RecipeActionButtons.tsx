
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipeResult } from '@/types/creation';
import { useRecipePrint } from '@/hooks/useRecipePrint';
import { useResponsiveLayout, getResponsiveButtonSize, getResponsiveButtonVariant, getResponsiveIconButtonSize } from '@/hooks/useResponsiveLayout';

interface RecipeActionButtonsProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeActionButtons: React.FC<RecipeActionButtonsProps> = ({ recipe, onReset }) => {
    const { printRecipe } = useRecipePrint();
    const { isMobile, isTouch } = useResponsiveLayout();
    const navigate = useNavigate();

    const handlePrint = () => printRecipe(recipe);

    const handleGoHome = () => {
        onReset(); // Still call reset to clean up state
        navigate('/standby'); // Navigate to standby page
    };

    const buttonSize = getResponsiveButtonSize(isMobile, isTouch);
    const buttonVariant = getResponsiveButtonVariant(isMobile, isTouch);
    const iconButtonSize = getResponsiveIconButtonSize(isMobile, isTouch);
    
    const containerClass = isMobile 
        ? "flex flex-col items-center mobile-gap mobile-safe-area" 
        : "flex flex-col items-center touch-gap touch-dead-zone-bottom";
    
    const buttonContainerClass = isMobile 
        ? "flex flex-wrap justify-center mobile-gap" 
        : "flex flex-wrap justify-center touch-gap";

    return (
        <div className={containerClass}>
            <div className={buttonContainerClass}>
                <Button 
                    onClick={handlePrint} 
                    size={buttonSize}
                    variant={buttonVariant}
                    className="bg-gradient-to-r from-black to-gray-800 text-white font-mono"
                >
                    <Printer className={`${isMobile ? 'mr-2 h-4 w-4' : 'mr-3 h-5 w-5'}`} /> 
                    {isMobile ? 'Print' : 'Print Label'}
                </Button>
            </div>
            <Button 
                onClick={handleGoHome} 
                variant={isMobile ? 'outline' : 'touch-outline'} 
                size={iconButtonSize}
                className="bg-transparent hover:bg-white/10 text-white border-white"
            >
                <Home className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
            </Button>
        </div>
    );
};

export default RecipeActionButtons;

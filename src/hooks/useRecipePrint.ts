
import { RecipeResult } from '@/types/creation';
import { getPrintContent } from '@/utils/printContent';
import { createPrintWindow, executePrint } from '@/utils/printWindow';

export const useRecipePrint = () => {
    const printRecipe = (recipe: RecipeResult) => {
        const printContents = getPrintContent();
        
        if (printContents) {
            const printWindow = createPrintWindow(printContents);
            if (printWindow) {
                executePrint(printWindow);
            }
        }
    };

    return { printRecipe };
};

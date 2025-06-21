
import React from 'react';
import { RecipeResult } from '@/types/creation';
import RecipePrintTemplate from './RecipePrintTemplate';
import RecipeImageDisplay from './RecipeImageDisplay';
import RecipeLabelPreview from './RecipeLabelPreview';
import RecipeActionButtons from './RecipeActionButtons';

interface RecipeResultScreenProps {
    recipe: RecipeResult;
    onReset: () => void;
}

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({ recipe, onReset }) => {
    return (
        <div className="w-full flex flex-col items-center space-y-6 text-white/90">
            <h2 className="text-2xl font-bold text-center font-mono">Your Memory KissOn Recipe</h2>

            <RecipePrintTemplate recipe={recipe} />

            <div className="flex flex-col gap-6 w-full">
                <RecipeImageDisplay recipe={recipe} />
                <RecipeLabelPreview recipe={recipe} />
            </div>

            <RecipeActionButtons recipe={recipe} onReset={onReset} />
        </div>
    );
};

export default RecipeResultScreen;

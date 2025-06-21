
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
    console.log('RecipeResultScreen rendering with recipe:', recipe);
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center space-y-6 text-white p-6">
            <h2 className="text-3xl font-bold text-center font-mono text-white mt-8">Your Memory KissOn Recipe</h2>

            <div className="w-full flex justify-center">
                <RecipePrintTemplate recipe={recipe} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl justify-center items-center">
                <RecipeImageDisplay recipe={recipe} />
                <RecipeLabelPreview recipe={recipe} />
            </div>

            <div className="w-full flex justify-center pb-8">
                <RecipeActionButtons recipe={recipe} onReset={onReset} />
            </div>
        </div>
    );
};

export default RecipeResultScreen;

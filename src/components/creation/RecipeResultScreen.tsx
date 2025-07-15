
import React from 'react';
import { RecipeResult } from '@/types/creation';
import RecipePrintTemplate from './RecipePrintTemplate';
import RecipeImageDisplay from './RecipeImageDisplay';
import RecipeVideoDisplay from './RecipeVideoDisplay';
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

            <div className="w-full flex justify-center">
                <RecipePrintTemplate recipe={recipe} />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full justify-center items-center">
                <RecipeImageDisplay recipe={recipe} />
                {recipe.videoUrl && (
                    <RecipeVideoDisplay 
                        videoUrl={recipe.videoUrl} 
                        recipeName={recipe.name}
                    />
                )}
                <RecipeLabelPreview recipe={recipe} />
            </div>

            <div className="w-full flex justify-center">
                <RecipeActionButtons recipe={recipe} onReset={onReset} />
            </div>
        </div>
    );
};

export default RecipeResultScreen;

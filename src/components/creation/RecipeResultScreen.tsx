
import React, { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import RecipePrintTemplate from './RecipePrintTemplate';
import RecipeImageDisplay from './RecipeImageDisplay';
import RecipeLabelPreview from './RecipeLabelPreview';
import RecipeActionButtons from './RecipeActionButtons';
import CSS360RotationButton from './CSS360RotationButton';
import CSS360ImageDisplay from './CSS360ImageDisplay';

interface RecipeResultScreenProps {
    recipe: RecipeResult;
    recipeId: string;
    onReset: () => void;
}

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({ recipe, recipeId, onReset }) => {
    const [show360View, setShow360View] = useState(false);

    const handle360Activated = () => {
        setShow360View(true);
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6 text-white/90">
            <h2 className="text-2xl font-bold text-center font-mono">Your Memory KissOn Recipe</h2>

            <div className="w-full flex justify-center">
                <RecipePrintTemplate recipe={recipe} />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full justify-center items-center">
                <RecipeImageDisplay recipe={recipe} />
                {show360View ? (
                    <CSS360ImageDisplay imageUrl={recipe.imageUrl} recipeTitle={recipe.name} />
                ) : (
                    <RecipeLabelPreview recipe={recipe} />
                )}
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                {!show360View && recipe.imageUrl !== '/placeholder.svg' && (
                    <CSS360RotationButton 
                        imageUrl={recipe.imageUrl}
                        recipeName={recipe.name}
                        onActivate={handle360Activated} 
                    />
                )}
                <RecipeActionButtons recipe={recipe} onReset={onReset} />
            </div>
        </div>
    );
};

export default RecipeResultScreen;


import React from 'react';
import { RecipeResult } from '@/types/creation';

interface RecipeImageDisplayProps {
    recipe: RecipeResult;
}

const RecipeImageDisplay: React.FC<RecipeImageDisplayProps> = ({ recipe }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold font-mono">Generated Dumpling</h3>
            <div className="w-full max-w-[300px]">
                <img 
                    src={recipe.imageUrl} 
                    alt="Generated Dumpling" 
                    className="rounded-lg shadow-lg w-full aspect-square object-cover filter grayscale" 
                />
            </div>
        </div>
    );
};

export default RecipeImageDisplay;

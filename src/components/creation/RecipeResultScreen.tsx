
import React, { useState } from 'react';
import { RecipeResult } from '@/types/creation';
import RecipePrintTemplate from './RecipePrintTemplate';
import RecipeImageDisplay from './RecipeImageDisplay';
import RecipeLabelPreview from './RecipeLabelPreview';
import RecipeActionButtons from './RecipeActionButtons';
import VideoGenerationButton from './VideoGenerationButton';
import VideoDisplay from './VideoDisplay';

interface RecipeResultScreenProps {
    recipe: RecipeResult;
    recipeId: string;
    onReset: () => void;
}

const RecipeResultScreen: React.FC<RecipeResultScreenProps> = ({ recipe, recipeId, onReset }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleVideoGenerated = (generatedVideoUrl: string) => {
        setVideoUrl(generatedVideoUrl);
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6 text-white/90">
            <h2 className="text-2xl font-bold text-center font-mono">Your Memory KissOn Recipe</h2>

            <div className="w-full flex justify-center">
                <RecipePrintTemplate recipe={recipe} />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full justify-center items-start">
                <RecipeImageDisplay recipe={recipe} />
                {videoUrl ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <VideoDisplay videoUrl={videoUrl} recipeTitle={recipe.name} />
                        <RecipeLabelPreview recipe={recipe} />
                    </div>
                ) : (
                    <RecipeLabelPreview recipe={recipe} />
                )}
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                {!videoUrl && recipe.imageUrl !== '/placeholder.svg' && (
                    <VideoGenerationButton 
                        recipe={recipe}
                        recipeId={recipeId}
                        onVideoGenerated={handleVideoGenerated} 
                    />
                )}
                <RecipeActionButtons recipe={recipe} onReset={onReset} />
            </div>
        </div>
    );
};

export default RecipeResultScreen;

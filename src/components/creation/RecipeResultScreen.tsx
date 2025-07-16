
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
                <RecipeLabelPreview recipe={recipe} />
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                {recipe.imageUrl !== '/placeholder.svg' && (
                    <div className="flex flex-col items-center gap-2">
                        {!videoUrl ? (
                            <VideoGenerationButton 
                                recipe={recipe}
                                recipeId={recipeId}
                                onVideoGenerated={handleVideoGenerated} 
                            />
                        ) : (
                            <button
                                onClick={() => {
                                    const popup = window.open('', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
                                    if (popup) {
                                        popup.document.write(`
                                            <html>
                                                <head><title>360° Recipe Video</title></head>
                                                <body style="margin:0;padding:20px;background:#000;display:flex;justify-content:center;align-items:center;height:100vh;">
                                                    <video controls autoplay style="max-width:100%;max-height:100%;">
                                                        <source src="${videoUrl}" type="video/mp4">
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </body>
                                            </html>
                                        `);
                                        popup.document.close();
                                    }
                                }}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                🎬 Play 360° Video
                            </button>
                        )}
                    </div>
                )}
                <RecipeActionButtons recipe={recipe} onReset={onReset} />
            </div>
        </div>
    );
};

export default RecipeResultScreen;

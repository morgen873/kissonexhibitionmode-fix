
import React, { useEffect, useRef } from 'react';
import { RecipeResult } from '@/types/creation';
import { testImageAccess, debugImageLoad } from '@/utils/imageDebug';

interface RecipeImageDisplayProps {
    recipe: RecipeResult;
}

const RecipeImageDisplay: React.FC<RecipeImageDisplayProps> = ({ recipe }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    
    useEffect(() => {
        if (recipe.imageUrl && recipe.imageUrl !== '/placeholder.svg') {
            console.log('🔍 FRONTEND IMAGE DEBUG - Starting comprehensive image testing');
            console.log('Recipe image URL received:', recipe.imageUrl);
            
            // Test image accessibility
            testImageAccess(recipe.imageUrl);
        }
    }, [recipe.imageUrl]);
    
    const handleImageLoad = () => {
        console.log('✅ FRONTEND: Image loaded successfully in RecipeImageDisplay');
        if (imageRef.current) {
            debugImageLoad(imageRef.current, recipe.imageUrl);
        }
    };
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log('❌ FRONTEND: Image failed to load in RecipeImageDisplay');
        console.log('Error details:', e);
        console.log('Failed URL:', recipe.imageUrl);
        
        // Only fall back if we're not already using placeholder
        if (e.currentTarget.src !== '/placeholder.svg') {
            console.log('🔄 FRONTEND: Falling back to placeholder');
            e.currentTarget.src = '/placeholder.svg';
        }
    };
    
    const isPlaceholder = !recipe.imageUrl || recipe.imageUrl === '/placeholder.svg';
    
    return (
        <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-semibold font-mono">Generated Dumpling</h3>
            <div className="w-full max-w-[250px] lg:max-w-[300px] relative">
                <img 
                    ref={imageRef}
                    src={recipe.imageUrl} 
                    alt="Generated Dumpling" 
                    className="rounded-lg shadow-lg w-full aspect-square object-cover" 
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                    {isPlaceholder ? 'Placeholder' : 'Generated'}
                </div>
                {!isPlaceholder && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
                        HD Quality
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeImageDisplay;

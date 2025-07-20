
import React, { useEffect, useRef, useState } from 'react';
import { RecipeResult } from '@/types/creation';
import { testImageAccess, debugImageLoad } from '@/utils/imageDebug';

interface RecipeImageDisplayProps {
    recipe: RecipeResult;
}

const RecipeImageDisplay: React.FC<RecipeImageDisplayProps> = ({ recipe }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageLoadState, setImageLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [finalImageUrl, setFinalImageUrl] = useState<string>(recipe.imageUrl);
    
    useEffect(() => {
        console.log('🔍 ENHANCED FRONTEND IMAGE DEBUG - RecipeImageDisplay');
        console.log('Recipe image URL received:', recipe.imageUrl);
        console.log('Is placeholder?', recipe.imageUrl === '/placeholder.svg');
        
        if (recipe.imageUrl && recipe.imageUrl !== '/placeholder.svg') {
            console.log('🧪 Testing image accessibility...');
            testImageAccess(recipe.imageUrl);
            setImageLoadState('loading');
        } else {
            console.log('📝 Using placeholder image');
            setImageLoadState('loaded');
        }
    }, [recipe.imageUrl]);
    
    const handleImageLoad = () => {
        console.log('✅ FRONTEND: Image loaded successfully in RecipeImageDisplay');
        console.log('Loaded URL:', finalImageUrl);
        setImageLoadState('loaded');
        
        if (imageRef.current) {
            debugImageLoad(imageRef.current, finalImageUrl);
            console.log('📏 Image dimensions:', {
                naturalWidth: imageRef.current.naturalWidth,
                naturalHeight: imageRef.current.naturalHeight,
                displayWidth: imageRef.current.width,
                displayHeight: imageRef.current.height
            });
        }
    };
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log('❌ FRONTEND: Image failed to load in RecipeImageDisplay');
        console.log('Failed URL:', finalImageUrl);
        console.log('Error event:', e);
        
        setImageLoadState('error');
        
        // Enhanced fallback strategy
        if (finalImageUrl !== '/placeholder.svg') {
            console.log('🔄 FRONTEND: Attempting fallback to placeholder');
            setFinalImageUrl('/placeholder.svg');
            
            // Don't immediately change src to avoid infinite loop
            setTimeout(() => {
                if (imageRef.current && imageRef.current.src !== '/placeholder.svg') {
                    imageRef.current.src = '/placeholder.svg';
                }
            }, 100);
        } else {
            console.log('❌ FRONTEND: Even placeholder failed to load');
        }
    };
    
    // Loading state indicator
    const renderLoadingState = () => {
        if (imageLoadState === 'loading' && finalImageUrl !== '/placeholder.svg') {
            return (
                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-600">Loading image...</p>
                    </div>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="flex flex-col items-center gap-3">
            <h3 className="text-lg font-semibold font-mono">Generated Dumpling</h3>
            <div className="w-full max-w-[250px] lg:max-w-[300px] relative">
                {renderLoadingState()}
                <img 
                    ref={imageRef}
                    src={finalImageUrl} 
                    alt="Generated Dumpling" 
                    className={`rounded-lg shadow-lg w-full aspect-square object-cover transition-opacity duration-300 ${
                        imageLoadState === 'loading' ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-500 max-w-full break-all">
                        <p>URL: {finalImageUrl.substring(0, 50)}...</p>
                        <p>State: {imageLoadState}</p>
                        <p>Is placeholder: {finalImageUrl === '/placeholder.svg' ? 'Yes' : 'No'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeImageDisplay;

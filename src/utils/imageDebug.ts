
export const testImageAccess = async (imageUrl: string) => {
    console.log('🔍 COMPREHENSIVE IMAGE ACCESS TEST');
    console.log('Testing URL:', imageUrl);
    
    // Test if URL structure looks correct
    const urlStructureTest = {
        hasProtocol: imageUrl.startsWith('http'),
        hasSupabase: imageUrl.includes('supabase'),
        hasRecipeImages: imageUrl.includes('recipe_images'),
        structure: new URL(imageUrl)
    };
    
    console.log('📊 URL Structure Analysis:', urlStructureTest);
    
    try {
        // Test HEAD request first (faster)
        console.log('🔍 Testing HEAD request...');
        const headResponse = await fetch(imageUrl, { method: 'HEAD' });
        console.log('📊 HEAD Response:', {
            status: headResponse.status,
            statusText: headResponse.statusText,
            headers: Object.fromEntries(headResponse.headers.entries()),
            ok: headResponse.ok
        });
        
        if (headResponse.ok) {
            console.log('✅ HEAD request successful - image should be accessible');
            
            // Test actual GET request
            console.log('🔍 Testing GET request...');
            const getResponse = await fetch(imageUrl);
            console.log('📊 GET Response:', {
                status: getResponse.status,
                statusText: getResponse.statusText,
                ok: getResponse.ok,
                contentType: getResponse.headers.get('content-type'),
                contentLength: getResponse.headers.get('content-length')
            });
            
            if (getResponse.ok) {
                const blob = await getResponse.blob();
                console.log('📊 Image Data:', {
                    size: blob.size,
                    type: blob.type,
                    sizeInKB: Math.round(blob.size / 1024)
                });
                
                if (blob.size > 0) {
                    console.log('✅ Image data retrieved successfully');
                    return true;
                } else {
                    console.log('❌ Image data is empty');
                    return false;
                }
            } else {
                console.log('❌ GET request failed');
                return false;
            }
        } else {
            console.log('❌ HEAD request failed:', headResponse.statusText);
            return false;
        }
    } catch (error) {
        console.log('❌ Network error testing image access:', error);
        console.log('Error details:', {
            name: error.name,
            message: error.message,
            cause: error.cause
        });
        return false;
    }
};

export const debugImageLoad = (imageElement: HTMLImageElement, imageUrl: string) => {
    console.log('🖼️ IMAGE ELEMENT DEBUG');
    console.log('Image URL:', imageUrl);
    console.log('Image element properties:', {
        src: imageElement.src,
        complete: imageElement.complete,
        naturalWidth: imageElement.naturalWidth,
        naturalHeight: imageElement.naturalHeight,
        width: imageElement.width,
        height: imageElement.height
    });
    
    // Add load and error event listeners for debugging
    imageElement.addEventListener('load', () => {
        console.log('✅ Image loaded successfully in DOM');
        console.log('Final image properties:', {
            naturalWidth: imageElement.naturalWidth,
            naturalHeight: imageElement.naturalHeight,
            displayWidth: imageElement.width,
            displayHeight: imageElement.height
        });
    });
    
    imageElement.addEventListener('error', (e) => {
        console.log('❌ Image failed to load in DOM');
        console.log('Error event:', e);
    });
};


export const testImageAccess = async (imageUrl: string) => {
    console.log('🔍 Testing image access for:', imageUrl);
    
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        console.log('📊 Image response status:', response.status);
        console.log('📊 Image response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            console.log('✅ Image is accessible');
            return true;
        } else {
            console.log('❌ Image is not accessible:', response.statusText);
            return false;
        }
    } catch (error) {
        console.log('❌ Error testing image access:', error);
        return false;
    }
};

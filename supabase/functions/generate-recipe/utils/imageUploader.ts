
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function uploadImageToSupabase(
  imageB64: string,
  recipeId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string | null> {
  try {
    console.log("=== COMPREHENSIVE IMAGE UPLOAD DEBUG ===");
    console.log("Recipe ID:", recipeId);
    console.log("Base64 image length:", imageB64.length);
    console.log("Base64 preview (first 100 chars):", imageB64.substring(0, 100));
    
    // Convert base64 to blob with detailed error handling
    let imageBlob: Blob;
    try {
      const dataUrl = `data:image/png;base64,${imageB64}`;
      console.log("Creating blob from data URL...");
      const response = await fetch(dataUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to create blob: ${response.status} ${response.statusText}`);
      }
      
      imageBlob = await response.blob();
      console.log("✅ Blob created successfully:");
      console.log("- Blob size:", imageBlob.size, "bytes");
      console.log("- Blob type:", imageBlob.type);
      
    } catch (blobError) {
      console.error("❌ Error creating blob from base64:", blobError);
      return null;
    }
    
    const imagePath = `public/${recipeId}.png`;
    console.log("Target image path:", imagePath);

    // Ensure bucket exists with proper configuration
    console.log("=== BUCKET VERIFICATION AND CREATION ===");
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error("❌ Error listing buckets:", listError);
      return null;
    }
    
    console.log("Existing buckets:", buckets?.map(b => b.id));
    const bucketExists = buckets?.some(bucket => bucket.id === 'recipe_images');
    
    if (!bucketExists) {
      console.log("Creating recipe_images bucket with optimal settings...");
      const { error: bucketError } = await supabaseAdmin.storage.createBucket('recipe_images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 10485760, // 10MB to ensure we don't hit limits
        filesizeLimit: 10485760
      });
      
      if (bucketError) {
        console.error('❌ Error creating bucket:', bucketError);
        return null;
      } else {
        console.log("✅ Bucket created successfully");
      }
    } else {
      console.log("✅ Bucket already exists");
    }
    
    // Upload with comprehensive error handling
    console.log("=== IMAGE UPLOAD PROCESS ===");
    console.log("Uploading image to path:", imagePath);
    console.log("Image blob size:", imageBlob.size);
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('recipe_images')
      .upload(imagePath, imageBlob, {
        contentType: 'image/png',
        upsert: true,
        cacheControl: '3600' // Cache for 1 hour
      });

    if (uploadError) {
      console.error('❌ Upload error details:', uploadError);
      console.error('- Error message:', uploadError.message);
      console.error('- Error code:', uploadError.name);
      return null;
    }
    
    console.log("✅ Upload successful:", uploadData);
    
    // Generate and verify public URL
    console.log("=== PUBLIC URL GENERATION ===");
    const { data: urlData } = supabaseAdmin.storage
      .from('recipe_images')
      .getPublicUrl(imagePath);
    
    const publicUrl = urlData.publicUrl;
    console.log("Generated public URL:", publicUrl);
    
    // Verify the URL structure is correct
    if (!publicUrl || !publicUrl.includes('supabase')) {
      console.error("❌ Generated URL seems invalid:", publicUrl);
      return null;
    }
    
    // Test URL accessibility
    console.log("=== URL ACCESSIBILITY TEST ===");
    try {
      const testResponse = await fetch(publicUrl, { method: 'HEAD' });
      console.log("URL test response status:", testResponse.status);
      console.log("URL test response headers:", Object.fromEntries(testResponse.headers.entries()));
      
      if (testResponse.ok) {
        console.log("✅ URL is accessible");
      } else {
        console.log("⚠️ URL accessibility test failed, but URL might still work");
      }
    } catch (testError) {
      console.log("⚠️ URL test failed (this might be normal):", testError.message);
    }
    
    console.log("=== UPLOAD COMPLETE ===");
    console.log("Final URL being returned:", publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('❌ Critical error in uploadImageToSupabase:', error);
    return null;
  }
}

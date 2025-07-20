
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function uploadImageToSupabase(
  imageB64: string,
  recipeId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string | null> {
  try {
    console.log("=== ENHANCED IMAGE UPLOAD WITH DETAILED DIAGNOSTICS ===");
    console.log("📋 Upload Parameters:");
    console.log("- Recipe ID:", recipeId);
    console.log("- Base64 image length:", imageB64.length);
    console.log("- Base64 preview (first 50 chars):", imageB64.substring(0, 50));
    console.log("- Base64 format check:", imageB64.startsWith('/9j/') ? 'JPEG' : imageB64.startsWith('iVBORw0KG') ? 'PNG' : 'UNKNOWN');
    
    // Enhanced blob creation with error handling
    let imageBlob: Blob;
    try {
      console.log("🔄 Converting base64 to blob...");
      const dataUrl = `data:image/png;base64,${imageB64}`;
      const response = await fetch(dataUrl);
      
      if (!response.ok) {
        console.error("❌ Failed to create blob from data URL:", response.status, response.statusText);
        throw new Error(`Failed to create blob: ${response.status} ${response.statusText}`);
      }
      
      imageBlob = await response.blob();
      console.log("✅ Blob created successfully:");
      console.log("- Blob size:", imageBlob.size, "bytes");
      console.log("- Blob type:", imageBlob.type);
      console.log("- Size in KB:", (imageBlob.size / 1024).toFixed(2));
      
      // Validate blob size
      if (imageBlob.size < 1000) {
        throw new Error("Blob size too small - likely invalid image data");
      }
      
      if (imageBlob.size > 10 * 1024 * 1024) { // 10MB limit
        console.warn("⚠️ Large blob size detected:", (imageBlob.size / 1024 / 1024).toFixed(2), "MB");
      }
      
    } catch (blobError) {
      console.error("❌ Critical error creating blob from base64:", blobError);
      console.error("Blob error details:", {
        name: blobError.name,
        message: blobError.message,
        base64Length: imageB64.length
      });
      return null;
    }
    
    const imagePath = `public/${recipeId}.png`;
    console.log("📁 Target image path:", imagePath);

    // Enhanced bucket verification
    console.log("=== BUCKET VERIFICATION AND SETUP ===");
    try {
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        console.error("❌ Error listing buckets:", listError);
        throw new Error(`Failed to list buckets: ${listError.message}`);
      }
      
      console.log("📊 Available buckets:", buckets?.map(b => ({ id: b.id, public: b.public })) || []);
      const bucketExists = buckets?.some(bucket => bucket.id === 'recipe_images');
      
      if (!bucketExists) {
        console.log("🔧 Creating recipe_images bucket...");
        const { error: bucketError } = await supabaseAdmin.storage.createBucket('recipe_images', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (bucketError) {
          console.error('❌ Bucket creation failed:', bucketError);
          throw new Error(`Failed to create bucket: ${bucketError.message}`);
        } else {
          console.log("✅ Bucket created successfully");
        }
      } else {
        console.log("✅ Bucket already exists and is available");
      }
    } catch (bucketError) {
      console.error("❌ Bucket verification/creation failed:", bucketError);
      return null;
    }
    
    // Enhanced upload with detailed error reporting
    console.log("=== IMAGE UPLOAD PROCESS ===");
    console.log("🚀 Starting upload to Supabase Storage...");
    console.log("Upload details:");
    console.log("- Path:", imagePath);
    console.log("- Content type: image/png");
    console.log("- Upsert: true");
    console.log("- Cache control: 3600");
    
    try {
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('recipe_images')
        .upload(imagePath, imageBlob, {
          contentType: 'image/png',
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('❌ Upload failed with detailed error:');
        console.error('- Error message:', uploadError.message);
        console.error('- Error name:', uploadError.name);
        console.error('- Full error object:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log("✅ Upload completed successfully");
      console.log("📤 Upload response data:", uploadData);
      
    } catch (uploadError) {
      console.error("❌ Critical upload error:", uploadError);
      return null;
    }
    
    // Enhanced URL generation and validation
    console.log("=== PUBLIC URL GENERATION AND VALIDATION ===");
    try {
      const { data: urlData } = supabaseAdmin.storage
        .from('recipe_images')
        .getPublicUrl(imagePath);
      
      const publicUrl = urlData.publicUrl;
      console.log("🌐 Generated public URL:", publicUrl);
      
      // Enhanced URL validation
      if (!publicUrl) {
        console.error("❌ Public URL is null or undefined");
        return null;
      }
      
      if (!publicUrl.includes('supabase')) {
        console.error("❌ Generated URL doesn't contain 'supabase':", publicUrl);
        return null;
      }
      
      if (!publicUrl.includes(recipeId)) {
        console.error("❌ Generated URL doesn't contain recipe ID:", publicUrl);
        return null;
      }
      
      console.log("✅ URL validation passed");
      
      // Test URL accessibility (non-blocking)
      console.log("=== URL ACCESSIBILITY TEST ===");
      try {
        const testResponse = await fetch(publicUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        console.log("🔍 URL test results:");
        console.log("- Status:", testResponse.status);
        console.log("- Status text:", testResponse.statusText);
        console.log("- Content type:", testResponse.headers.get('content-type'));
        console.log("- Content length:", testResponse.headers.get('content-length'));
        
        if (testResponse.ok) {
          console.log("✅ URL is accessible and working");
        } else {
          console.log("⚠️ URL test returned non-200 status, but URL might still work");
        }
      } catch (testError) {
        console.log("⚠️ URL accessibility test failed (this might be normal):", testError.message);
        console.log("🔄 URL will still be returned as it may work despite test failure");
      }
      
      console.log("=== UPLOAD PROCESS COMPLETED SUCCESSFULLY ===");
      console.log("🎉 Final URL being returned:", publicUrl);
      console.log("📊 Upload summary:");
      console.log("- Recipe ID:", recipeId);
      console.log("- Image size:", (imageBlob.size / 1024).toFixed(2), "KB");
      console.log("- Path:", imagePath);
      console.log("- Public URL:", publicUrl);
      
      return publicUrl;
      
    } catch (urlError) {
      console.error("❌ URL generation failed:", urlError);
      return null;
    }
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR in uploadImageToSupabase:', error);
    console.error('Error stack trace:', error.stack);
    console.error('Upload failure summary:', {
      recipeId,
      imageDataLength: imageB64?.length || 0,
      errorName: error.name,
      errorMessage: error.message
    });
    return null;
  }
}

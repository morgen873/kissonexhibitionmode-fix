import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export async function uploadImageToSupabase(
  imageB64: string,
  recipeId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string | null> {
  try {
    console.log("=== 📤 UPLOADING IMAGE TO SUPABASE STORAGE ===");
    console.log("Recipe ID:", recipeId);
    console.log("Image data length:", imageB64.length);
    
    // Convert base64 to blob
    console.log("🔄 Converting base64 to blob...");
    const byteCharacters = atob(imageB64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    console.log("✅ Blob created successfully");
    console.log("Blob size:", blob.size, "bytes");
    
    // Validate blob size
    if (blob.size === 0) {
      console.log("❌ Blob size is 0, invalid image data");
      return null;
    }
    
    if (blob.size > 10 * 1024 * 1024) { // 10MB limit
      console.log("❌ Blob size too large:", blob.size, "bytes");
      return null;
    }
    
    // Check if recipe_images bucket exists, create if it doesn't
    console.log("🔍 Checking if recipe_images bucket exists...");
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.log("❌ Error listing buckets:", listError);
      return null;
    }
    
    const recipeImagesBucket = buckets?.find(bucket => bucket.name === 'recipe_images');
    
    if (!recipeImagesBucket) {
      console.log("🆕 Creating recipe_images bucket...");
      const { error: createError } = await supabaseAdmin.storage.createBucket('recipe_images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.log("❌ Error creating bucket:", createError);
        return null;
      }
      console.log("✅ recipe_images bucket created successfully");
    } else {
      console.log("✅ recipe_images bucket already exists");
    }
    
    // Upload the image
    const fileName = `recipe_${recipeId}.jpg`;
    console.log("📤 Uploading image with filename:", fileName);
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('recipe_images')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      });
    
    if (uploadError) {
      console.log("❌ Upload error:", uploadError);
      console.log("Error details:", JSON.stringify(uploadError, null, 2));
      return null;
    }
    
    console.log("✅ Upload successful!");
    console.log("Upload data:", uploadData);
    
    // Get public URL
    console.log("🔗 Getting public URL...");
    const { data: urlData } = supabaseAdmin.storage
      .from('recipe_images')
      .getPublicUrl(fileName);
    
    console.log("✅ Public URL generated:", urlData.publicUrl);
    
    // Validate the URL
    if (!urlData.publicUrl || typeof urlData.publicUrl !== 'string') {
      console.log("❌ Invalid public URL generated");
      return null;
    }
    
    // Ensure the URL contains expected parts
    if (!urlData.publicUrl.includes('supabase') || !urlData.publicUrl.includes(recipeId)) {
      console.log("❌ Public URL seems invalid - missing expected components");
      console.log("Expected to contain 'supabase' and recipe ID:", recipeId);
      console.log("Actual URL:", urlData.publicUrl);
      return null;
    }
    
    console.log("🎯 FINAL URL VALIDATION:");
    console.log("- URL length:", urlData.publicUrl.length);
    console.log("- Contains supabase:", urlData.publicUrl.includes('supabase'));
    console.log("- Contains recipe ID:", urlData.publicUrl.includes(recipeId));
    console.log("- URL format appears valid:", urlData.publicUrl.startsWith('http'));
    
    // Test the URL (non-blocking)
    try {
      console.log("🔍 Testing URL accessibility...");
      fetch(urlData.publicUrl, { method: 'HEAD' })
        .then(response => {
          console.log("URL test result:", response.status, response.ok ? 'OK' : 'Failed');
        })
        .catch(testError => {
          console.log("URL test failed (non-blocking):", testError.message);
        });
    } catch (testError) {
      console.log("URL test setup failed (non-blocking):", testError);
    }
    
    console.log("=== 📤 UPLOAD PROCESS COMPLETED ===");
    return urlData.publicUrl;
    
  } catch (error) {
    console.log("❌ Unexpected error in uploadImageToSupabase:", error);
    console.log("Error type:", typeof error);
    console.log("Error message:", error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
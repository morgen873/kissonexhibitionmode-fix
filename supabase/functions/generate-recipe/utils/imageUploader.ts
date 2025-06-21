
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function uploadImageToSupabase(
  imageB64: string,
  recipeId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string | null> {
  try {
    const imageBlob = await(await fetch(`data:image/png;base64,${imageB64}`)).blob();
    const imagePath = `public/${recipeId}.png`;

    console.log("Ensuring bucket exists and uploading image...");
    
    // First, ensure the bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.id === 'recipe_images');
    
    if (!bucketExists) {
      console.log("Creating recipe_images bucket...");
      const { error: bucketError } = await supabaseAdmin.storage.createBucket('recipe_images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
        return null;
      } else {
        console.log("Bucket created successfully");
      }
    }
    
    // Upload the image
    const { error: uploadError } = await supabaseAdmin.storage
      .from('recipe_images')
      .upload(imagePath, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    console.log("Image uploaded successfully to:", imagePath);
    const { data: urlData } = supabaseAdmin.storage
      .from('recipe_images')
      .getPublicUrl(imagePath);
    
    console.log("Generated public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return null;
  }
}

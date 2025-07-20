import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RecipeData {
  id: string;
  title: string;
  ingredients: any;
}

export async function generateSimpleImage(
  recipeData: RecipeData,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string> {
  console.log("=== SIMPLE IMAGE GENERATION START ===");
  console.log("Recipe title:", recipeData.title);
  
  try {
    // Simple prompt - just use the recipe title
    const prompt = `A delicious dumpling dish called "${recipeData.title}", professional food photography, appetizing, high quality`;
    console.log("Simple prompt:", prompt);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.log("❌ No OpenAI API key found");
      return '/placeholder.svg';
    }
    
    console.log("🎨 Calling OpenAI image generation...");
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ OpenAI API error:", response.status, errorText);
      return '/placeholder.svg';
    }
    
    const data = await response.json();
    console.log("✅ OpenAI response received");
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.log("❌ No image data in response");
      return '/placeholder.svg';
    }
    
    // Upload to Supabase storage
    const imageB64 = data.data[0].b64_json;
    const fileName = `recipe_${recipeData.id}.jpg`;
    
    // Convert base64 to blob
    const byteCharacters = atob(imageB64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    
    console.log("📤 Uploading to Supabase storage...");
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('recipe_images')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      });
    
    if (uploadError) {
      console.log("❌ Upload error:", uploadError);
      return '/placeholder.svg';
    }
    
    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('recipe_images')
      .getPublicUrl(fileName);
    
    console.log("✅ Image uploaded successfully:", urlData.publicUrl);
    return urlData.publicUrl;
    
  } catch (error) {
    console.log("❌ Image generation error:", error);
    return '/placeholder.svg';
  }
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateVideoRequest {
  imageUrl: string;
  recipeId: string;
  recipeTitle: string;
  imagePrompt?: string;
}

// Generate 360-degree video prompt based on original image prompt
function generate360Prompt(recipeTitle: string, imagePrompt?: string): string {
  if (imagePrompt) {
    return `create 360 degrees orbital camera movement of a ${imagePrompt}`;
  }
  return `create 360 degrees orbital camera movement of a dumpling from ${recipeTitle}`;
}

async function generateVideoInBackground(imageUrl: string, recipeId: string, recipeTitle: string, imagePrompt?: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const replicateApiKey = Deno.env.get('replicate');

  if (!replicateApiKey) {
    throw new Error('Replicate API key not found');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('🔄 Starting Replicate video generation...');
    console.log('🖼️ Image URL:', imageUrl);
    console.log('📝 Recipe Title:', recipeTitle);

    const replicate = new Replicate({
      auth: replicateApiKey,
    });

    const prompt = generate360Prompt(recipeTitle, imagePrompt);
    console.log('📝 Using prompt:', prompt);

    // Generate video using Stable Video Diffusion
    console.log('🎥 Generating video with Stable Video Diffusion...');
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c808e57bc2ab4c6",
      {
        input: {
          input_image: imageUrl,
          frames_per_second: 6,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          decoding_t: 14,
          video_length: "14_frames_with_svd",
          sizing_strategy: "maintain_aspect_ratio",
          augmentation_level: 0
        }
      }
    );

    console.log('✅ Luma Ray video generation response:', output);

    if (!output) {
      throw new Error('No video generated from Luma Ray');
    }

    const videoUrl = output;
    console.log('🎬 Generated video URL:', videoUrl);

    // Download the video
    console.log('📥 Downloading video...');
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    console.log('📦 Video blob size:', videoBlob.size);

    // Upload to Supabase storage
    const videoPath = `360-videos/${recipeId}.mp4`;
    console.log('📤 Uploading to Supabase storage:', videoPath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoPath, videoBlob, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoPath);

    console.log('🌐 Public URL:', publicUrl);

    // Update recipe with video URL
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ 
        video_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    console.log('✅ Recipe updated with video URL');
    console.log('🎉 Video generation completed successfully');

  } catch (error) {
    console.error('❌ Background video generation failed:', error);
    
    // Update recipe with error status
    await supabase
      .from('recipes')
      .update({ 
        video_url: 'ERROR',
        updated_at: new Date().toISOString()
      })
      .eq('id', recipeId);

    console.log('📝 Updated recipe with error status');
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const replicateApiKey = Deno.env.get('replicate');

    if (!supabaseUrl || !replicateApiKey) {
      throw new Error('Missing required environment variables');
    }

    console.log('=== 🎬 360° VIDEO GENERATION STARTED (REPLICATE) ===');
    
    const { imageUrl, recipeId, recipeTitle, imagePrompt }: GenerateVideoRequest = await req.json();
    
    console.log('Recipe ID:', recipeId);
    console.log('Image URL:', imageUrl);
    console.log('Recipe Title:', recipeTitle);

    // Start background video generation
    console.log('🔄 Starting background video generation...');
    EdgeRuntime.waitUntil(generateVideoInBackground(imageUrl, recipeId, recipeTitle, imagePrompt));

    // Return immediate response
    console.log('📤 Returning immediate response - video generation in progress...');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video generation started using Replicate',
        recipeId: recipeId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-360-video-replicate function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
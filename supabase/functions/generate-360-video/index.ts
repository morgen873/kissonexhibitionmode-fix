import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateVideoRequest {
  imageUrl: string;
  recipeId: string;
  recipeTitle: string;
}

interface RunwareAuthResponse {
  taskType: string;
  taskUUID: string;
}

interface RunwareVideoResponse {
  taskType: string;
  taskUUID: string;
  videoUUID: string;
  videoURL: string;
  cost: number;
}

// Video generation models optimized for 360° product display
const VIDEO_MODELS = [
  {
    name: 'kling-2.1',
    model: 'kling:21@1',
    description: 'Kling 2.1 Master - Excellent camera control and motion',
    duration: 4,
    width: 1024,
    height: 1024
  },
  {
    name: 'kling-2.0',
    model: 'kling:20@1', 
    description: 'Kling 2.0 - Cinematic output and realism',
    duration: 4,
    width: 1024,
    height: 1024
  },
  {
    name: 'kling-1.6',
    model: 'kling:16@1',
    description: 'Kling 1.6 - HD model with camera controls',
    duration: 4,
    width: 1024,
    height: 1024
  }
];

// Optimized prompts for 360° product display
function generate360Prompt(recipeTitle: string): string {
  return `Professional 360-degree product showcase of ${recipeTitle}. Smooth orbital camera movement rotating completely around the food item in a perfect circle. Show all sides: front, right side, back, left side, and back to front. Clean studio lighting, white background, steady rotation at constant speed. No camera shake, no zooming, only smooth circular orbit motion. Product remains centered and stationary while camera circles around it. Commercial food photography style, high-end product display.`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const runwareApiKey = Deno.env.get('kisson-runware') || Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      console.error('❌ RUNWARE_API_KEY environment variable not found');
      throw new Error('RUNWARE_API_KEY not configured');
    }

    console.log('🔑 Using Runware API key:', runwareApiKey.substring(0, 8) + '...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { imageUrl, recipeId, recipeTitle }: GenerateVideoRequest = await req.json();

    console.log('=== 🎬 360° VIDEO GENERATION STARTED (BACKGROUND) ===');
    console.log('Recipe ID:', recipeId);
    console.log('Image URL:', imageUrl);
    console.log('Recipe Title:', recipeTitle);

    // Define the background video generation task
    async function generateVideoInBackground() {
      try {
        console.log('🔄 Starting background video generation...');
        
        // Test API connectivity first
        console.log('🔐 Testing Runware API connectivity...');
        const testResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              taskType: 'authentication',
              apiKey: runwareApiKey
            }
          ])
        });

        console.log('📊 Auth response status:', testResponse.status);

        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('❌ Runware API error response:', errorText);
          throw new Error(`Runware authentication failed: ${testResponse.status} ${testResponse.statusText} - ${errorText}`);
        }

        const authData = await testResponse.json();
        console.log('✅ Runware authenticated successfully');

        // Generate video with simple approach first
        console.log('🎥 Generating 360° rotating video...');
        const videoTaskUUID = crypto.randomUUID();
        const optimizedPrompt = generate360Prompt(recipeTitle);
        
        console.log(`📝 Using prompt: ${optimizedPrompt}`);
        
        const videoResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              taskType: 'authentication',
              apiKey: runwareApiKey
            },
            {
              taskType: 'videoInference',
              taskUUID: videoTaskUUID,
              frameImages: [imageUrl],
              positivePrompt: optimizedPrompt,
              model: 'klingai:5@3', // Use a known working model
              duration: 4,
              width: 512,
              height: 512,
              outputFormat: 'MP4',
              outputQuality: 95,
              numberResults: 1
            }
          ])
        });

        console.log('📊 Video response status:', videoResponse.status);

        if (!videoResponse.ok) {
          const errorText = await videoResponse.text();
          console.error('❌ Video generation failed:', errorText);
          throw new Error(`Video generation failed: ${errorText}`);
        }

        const videoData = await videoResponse.json();
        console.log('📊 Video generation response:', JSON.stringify(videoData, null, 2));

        const videoResult = videoData.data?.find((item: any) => item.taskType === 'videoInference');
        
        if (!videoResult || !videoResult.videoURL) {
          console.error('❌ No video result found');
          throw new Error('No video URL returned from Runware');
        }

        console.log('✅ Video generated successfully:', videoResult.videoURL);

        // Download and upload video to Supabase storage
        console.log('📥 Downloading video from Runware...');
        const videoDownloadResponse = await fetch(videoResult.videoURL);
        
        if (!videoDownloadResponse.ok) {
          throw new Error('Failed to download generated video');
        }

        const videoBlob = await videoDownloadResponse.arrayBuffer();
        console.log('📊 Video blob size:', videoBlob.byteLength, 'bytes');

        // Upload to Supabase storage
        const videoFileName = `${recipeId}_360_rotation.mp4`;
        const videoPath = `public/${videoFileName}`;

        console.log('☁️ Uploading video to Supabase storage...');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('kisson-video')
          .upload(videoPath, videoBlob, {
            contentType: 'video/mp4',
            upsert: true
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          throw new Error(`Failed to upload video: ${uploadError.message}`);
        }

        console.log('✅ Video uploaded successfully:', uploadData.path);

        // Generate public URL
        const { data: urlData } = supabase.storage
          .from('kisson-video')
          .getPublicUrl(videoPath);

        const finalVideoUrl = urlData.publicUrl;
        console.log('🔗 Public video URL:', finalVideoUrl);

        // Update recipe with video URL
        console.log('💾 Updating recipe with video URL...');
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ video_url: finalVideoUrl })
          .eq('id', recipeId);

        if (updateError) {
          console.error('❌ Recipe update error:', updateError);
        } else {
          console.log('✅ Recipe updated with video URL');
        }

        console.log('=== 🎉 BACKGROUND VIDEO GENERATION COMPLETE ===');

      } catch (error) {
        console.error('❌ Background video generation failed:', error);
        console.error('❌ Full error details:', error.message, error.stack);
      }
    }

    // Start the background task without waiting for it
    EdgeRuntime.waitUntil(generateVideoInBackground());

    // Return immediate response
    console.log('📤 Returning immediate response - video generation in progress...');
    return new Response(JSON.stringify({
      success: true,
      message: 'Video generation started in background. Please check back in a few minutes.',
      recipeId,
      status: 'processing'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-360-video function:', error);
    console.error('❌ Full error details:', error.message, error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
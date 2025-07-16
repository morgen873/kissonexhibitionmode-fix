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

    console.log('=== 🎬 360° VIDEO GENERATION STARTED ===');
    console.log('Recipe ID:', recipeId);
    console.log('Image URL:', imageUrl);
    console.log('Recipe Title:', recipeTitle);

    // Step 1: Test API connectivity first
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
    console.log('📊 Auth response headers:', Object.fromEntries(testResponse.headers.entries()));

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('❌ Runware API error response:', errorText);
      throw new Error(`Runware authentication failed: ${testResponse.status} ${testResponse.statusText} - ${errorText}`);
    }

    const authData = await testResponse.json();
    console.log('✅ Runware authenticated successfully');
    console.log('📊 Auth data:', authData);

    // Step 2: Generate 360° video using multiple model fallbacks
    console.log('🎥 Starting 360° rotating video generation with model fallbacks...');
    
    let videoResult = null;
    let modelUsed = null;
    let lastError = null;

    // Try each model in order until one succeeds
    for (const modelConfig of VIDEO_MODELS) {
      try {
        console.log(`🔄 Attempting video generation with ${modelConfig.name} (${modelConfig.model})`);
        console.log(`📋 Model description: ${modelConfig.description}`);
        
        const videoTaskUUID = crypto.randomUUID();
        const optimizedPrompt = generate360Prompt(recipeTitle);
        
        console.log(`📝 Using optimized prompt: ${optimizedPrompt}`);
        
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
              model: modelConfig.model,
              duration: modelConfig.duration,
              width: modelConfig.width,
              height: modelConfig.height,
              outputFormat: 'MP4',
              outputQuality: 95,
              numberResults: 1
            }
          ])
        });

        console.log(`📊 ${modelConfig.name} response status:`, videoResponse.status);
        console.log(`📊 ${modelConfig.name} response headers:`, Object.fromEntries(videoResponse.headers.entries()));
        
        if (!videoResponse.ok) {
          const errorText = await videoResponse.text();
          console.error(`❌ ${modelConfig.name} failed: ${videoResponse.status} - ${errorText}`);
          lastError = new Error(`${modelConfig.name} failed: ${errorText}`);
          continue; // Try next model
        }

        const videoData = await videoResponse.json();
        console.log(`📊 ${modelConfig.name} response:`, JSON.stringify(videoData, null, 2));

        // Find the video result
        const currentVideoResult = videoData.data?.find((item: any) => item.taskType === 'videoInference');
        
        if (currentVideoResult && currentVideoResult.videoURL) {
          console.log(`✅ SUCCESS with ${modelConfig.name}! Video URL:`, currentVideoResult.videoURL);
          videoResult = currentVideoResult;
          modelUsed = modelConfig;
          break; // Success! Exit the loop
        } else {
          console.warn(`⚠️ ${modelConfig.name} returned no video URL. Trying next model...`);
          lastError = new Error(`${modelConfig.name} returned no video URL`);
        }
        
      } catch (error) {
        console.error(`❌ Error with ${modelConfig.name}:`, error);
        console.error(`❌ Full error details:`, error.message, error.stack);
        lastError = error;
        continue; // Try next model
      }
    }

    // If all models failed
    if (!videoResult || !videoResult.videoURL) {
      console.error('❌ All video models failed. Last error:', lastError);
      console.error('❌ Full error details:', lastError?.message, lastError?.stack);
      throw new Error(`All video generation models failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    console.log(`🎉 Video generated successfully with ${modelUsed?.name}:`, videoResult.videoURL);

    // Step 3: Download and upload video to Supabase storage
    console.log('📥 Downloading video from Runware...');
    const videoDownloadResponse = await fetch(videoResult.videoURL);
    
    if (!videoDownloadResponse.ok) {
      throw new Error('Failed to download generated video');
    }

    const videoBlob = await videoDownloadResponse.arrayBuffer();
    console.log('📊 Video blob size:', videoBlob.byteLength, 'bytes');

    // Step 4: Upload to Supabase storage
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

    // Step 5: Generate public URL
    const { data: urlData } = supabase.storage
      .from('kisson-video')
      .getPublicUrl(videoPath);

    const finalVideoUrl = urlData.publicUrl;
    console.log('🔗 Public video URL:', finalVideoUrl);

    // Step 6: Update recipe with video URL
    console.log('💾 Updating recipe with video URL...');
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ video_url: finalVideoUrl })
      .eq('id', recipeId);

    if (updateError) {
      console.error('❌ Recipe update error:', updateError);
      // Don't throw here, video is still generated successfully
    } else {
      console.log('✅ Recipe updated with video URL');
    }

    console.log('=== 🎉 360° VIDEO GENERATION COMPLETE ===');

    return new Response(JSON.stringify({
      success: true,
      videoUrl: finalVideoUrl,
      recipeId,
      cost: videoResult.cost || 0,
      modelUsed: modelUsed?.name || 'unknown',
      message: `360° video generated successfully using ${modelUsed?.name || 'unknown'} model`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-360-video function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
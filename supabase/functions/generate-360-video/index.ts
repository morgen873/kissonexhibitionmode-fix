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

    // Step 2: Generate 360° video using video inference with image constraint
    console.log('🎥 Generating 360° rotating video...');
    const videoTaskUUID = crypto.randomUUID();
    
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
          frameImages: [imageUrl], // Use frame images instead of imageInitialization
          positivePrompt: 'Slowly rotate the dumpling 360 degrees in a smooth circular motion, showing all sides. Professional food photography rotation on a clean background.',
          model: 'klingai:5@3', // Use the correct model for video generation
          duration: 4, // 4 seconds for smooth 360° rotation
          width: 512,
          height: 512,
          outputFormat: 'MP4',
          outputQuality: 95,
          numberResults: 1
        }
      ])
    });

    console.log('📊 Video response status:', videoResponse.status);
    console.log('📊 Video response headers:', Object.fromEntries(videoResponse.headers.entries()));

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      console.error('❌ Runware video API error response:', errorText);
      throw new Error(`Video generation failed: ${videoResponse.status} ${videoResponse.statusText} - ${errorText}`);
    }

    const videoData = await videoResponse.json();
    console.log('📊 Video generation response:', JSON.stringify(videoData, null, 2));

    // Find the video result
    const videoResult = videoData.data?.find((item: any) => item.taskType === 'videoInference');
    
    if (!videoResult || !videoResult.videoURL) {
      console.error('❌ No video result found. Full response:', JSON.stringify(videoData, null, 2));
      throw new Error('No video URL returned from Runware');
    }

    console.log('✅ Video generated successfully:', videoResult.videoURL);

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
      message: '360° video generated successfully'
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
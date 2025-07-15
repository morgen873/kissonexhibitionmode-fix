
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface VideoGenerationRequest {
  imageUrl: string;
  recipeTitle: string;
  recipeId: string;
}

interface RunwareVideoResponse {
  taskUUID: string;
  videoURL?: string;
  status?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      throw new Error('RUNWARE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { imageUrl, recipeTitle, recipeId }: VideoGenerationRequest = await req.json();

    console.log('🎬 Starting video generation for recipe:', recipeId);
    console.log('📸 Image URL:', imageUrl);

    // Generate video using Runware API
    const videoResponse = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${runwareApiKey}`
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: runwareApiKey
        },
        {
          taskType: "imageToVideo",
          taskUUID: crypto.randomUUID(),
          inputImage: imageUrl,
          motionBucket: 127,
          conditioningAugmentation: 0.02,
          seed: Math.floor(Math.random() * 1000000),
          fps: 6,
          videoLength: 25,
          upscale: false
        }
      ])
    });

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      console.error('❌ Runware API error:', errorText);
      throw new Error(`Runware API error: ${videoResponse.status} - ${errorText}`);
    }

    const videoData = await videoResponse.json();
    console.log('🎬 Runware response:', videoData);

    // Extract video data from response
    const videoResult = videoData.data?.find((item: any) => item.taskType === 'imageToVideo');
    
    if (!videoResult) {
      console.error('❌ No video result in response:', videoData);
      throw new Error('No video generated in response');
    }

    let videoUrl = '';
    
    if (videoResult.videoURL) {
      const externalVideoUrl = videoResult.videoURL;
      console.log('✅ Video generated successfully, downloading and storing:', externalVideoUrl);
      
      // Download the video from Runware
      const videoResponse = await fetch(externalVideoUrl);
      if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.status}`);
      }
      
      const videoBlob = await videoResponse.blob();
      const videoArrayBuffer = await videoBlob.arrayBuffer();
      const videoFileName = `recipe-${recipeId}-${Date.now()}.mp4`;
      
      // Upload to Supabase storage
      console.log('📤 Uploading video to storage bucket...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoArrayBuffer, {
          contentType: 'video/mp4',
          upsert: false
        });
      
      if (uploadError) {
        console.error('❌ Failed to upload video to storage:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      
      // Get public URL for the uploaded video
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);
      
      videoUrl = urlData.publicUrl;
      console.log('✅ Video uploaded to storage:', videoUrl);
      
    } else if (videoResult.taskUUID) {
      // Video is being processed, we'll need to poll for status
      console.log('⏳ Video is being processed, UUID:', videoResult.taskUUID);
      
      // Try to poll for completion (simple implementation)
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait
      
      while (attempts < maxAttempts && !videoUrl) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const statusResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${runwareApiKey}`
          },
          body: JSON.stringify([
            {
              taskType: "authentication",
              apiKey: runwareApiKey
            },
            {
              taskType: "imageToVideo",
              taskUUID: videoResult.taskUUID,
              retrieve: true
            }
          ])
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          const statusResult = statusData.data?.find((item: any) => item.taskUUID === videoResult.taskUUID);
          
          if (statusResult?.videoURL) {
            videoUrl = statusResult.videoURL;
            console.log('✅ Video completed after', attempts + 1, 'attempts:', videoUrl);
            break;
          }
        }
        
        attempts++;
      }
    }

    // Update recipe with video URL if we got one
    if (videoUrl) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ 
          video_url: videoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipeId);

      if (updateError) {
        console.error('⚠️ Failed to update recipe with video URL:', updateError);
      } else {
        console.log('✅ Recipe updated with video URL');
      }
    }

    return new Response(JSON.stringify({
      success: true,
      videoUrl: videoUrl || null,
      message: videoUrl ? 'Video generated successfully' : 'Video generation started but not completed yet'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Video generation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

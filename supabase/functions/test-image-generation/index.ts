import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== TEST IMAGE GENERATION FUNCTION ===");
    
    // Check if Replicate token exists
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
    console.log("Replicate token exists:", !!replicateToken);
    console.log("Token length:", replicateToken ? replicateToken.length : 0);
    
    if (!replicateToken) {
      throw new Error('REPLICATE_API_TOKEN not found');
    }

    // Test a simple API call to Replicate
    console.log("Testing Replicate API connection...");
    
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'black-forest-labs/flux-schnell',
        input: {
          prompt: 'a simple test dumpling',
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png"
        }
      })
    });

    console.log("Replicate response status:", createResponse.status);
    const responseText = await createResponse.text();
    console.log("Response:", responseText.substring(0, 500));

    if (!createResponse.ok) {
      throw new Error(`Replicate API failed: ${createResponse.status} - ${responseText}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      replicateWorking: true,
      status: createResponse.status,
      response: responseText.substring(0, 200)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Test function error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      replicateWorking: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
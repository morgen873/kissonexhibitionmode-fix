
interface ImageContext {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

interface ImageGenerationResult {
  imageData: string;
  usedModel: string;
  attempts: number;
}

export async function generateImageWithEnhancedFallback(
  prompt: string,
  negativePrompt: string,
  imageContext: ImageContext
): Promise<ImageGenerationResult> {
  console.log("🚨 ENHANCED HANDLER CALLED - NEW VERSION WITH DETAILED LOGGING 🚨");
  console.log("=== ENHANCED IMAGE GENERATION WITH FALLBACK STRATEGY ===");
  console.log("Prompt preview:", prompt.substring(0, 200));
  console.log("🔍 Image context:", JSON.stringify(imageContext, null, 2));
  
  // Strategy 1: Try OpenAI GPT Image-1 (Primary)
  try {
    console.log("🎨 Attempting OpenAI GPT Image-1 generation...");
    const result = await generateWithOpenAI(prompt, imageContext);
    console.log("✅ SUCCESS WITH OPENAI GPT IMAGE-1");
    return result;
  } catch (openAIError) {
    console.error("❌ OpenAI GPT Image-1 failed:", openAIError.message);
    console.error("OpenAI Error Details:", {
      name: openAIError.name,
      message: openAIError.message,
      stack: openAIError.stack
    });
  }

  // Strategy 2: Try Replicate FLUX (Fallback)
  try {
    console.log("🔄 Falling back to Replicate FLUX...");
    const result = await generateWithReplicate(prompt, imageContext);
    console.log("✅ SUCCESS WITH REPLICATE FLUX FALLBACK");
    return result;
  } catch (replicateError) {
    console.error("❌ Replicate FLUX fallback failed:", replicateError.message);
    console.error("Replicate Error Details:", {
      name: replicateError.name,
      message: replicateError.message,
      stack: replicateError.stack
    });
  }

  // If all strategies fail
  throw new Error("All image generation strategies failed. Both OpenAI and Replicate are unavailable.");
}

async function generateWithOpenAI(prompt: string, context: ImageContext): Promise<ImageGenerationResult> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    console.error("❌ OPENAI_API_KEY not found in environment");
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log("🔑 OpenAI API Key status: CONFIGURED");
  console.log("🔑 API Key length:", openAIKey.length);
  console.log("🔑 API Key prefix:", openAIKey.substring(0, 8) + "...");
  console.log("🎯 Making request to OpenAI API...");
  console.log("📝 Prompt length:", prompt.length);

  const requestBody = {
    model: 'gpt-image-1',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'high',
    response_format: 'b64_json'
  };

  console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log("📡 OpenAI API Response Status:", response.status);
    console.log("📡 Response Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenAI API Error Response:", errorText);
      console.error("❌ Request that failed:");
      console.error("- URL: https://api.openai.com/v1/images/generations");
      console.error("- Method: POST");
      console.error("- Headers: Authorization: Bearer [REDACTED], Content-Type: application/json");
      console.error("- Body:", JSON.stringify(requestBody, null, 2));
      
      // Parse error for better handling
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
        console.error("❌ Parsed error details:", JSON.stringify(errorDetails, null, 2));
      } catch (parseError) {
        console.error("❌ Failed to parse error response:", parseError);
        errorDetails = { message: errorText };
      }
      
      throw new Error(`OpenAI API failed (${response.status}): ${errorDetails.error?.message || errorText}`);
    }

    const result = await response.json();
    console.log("✅ OpenAI API Response received");
    console.log("📊 Response structure:", {
      hasData: !!result.data,
      dataLength: result.data?.length || 0,
      hasB64Json: !!(result.data?.[0]?.b64_json)
    });
    
    if (!result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error("❌ Invalid response structure:", result);
      throw new Error('No image data returned from OpenAI API');
    }

    const imageData = result.data[0].b64_json;
    console.log("✅ Image data extracted successfully");
    console.log("📏 Image data size:", imageData.length, "characters");
    
    // Validate image data
    if (imageData.length < 1000) {
      throw new Error('Suspiciously small image data - possible generation failure');
    }
    
    return {
      imageData,
      usedModel: 'openai-gpt-image-1',
      attempts: 1
    };
    
  } catch (error) {
    console.error("❌ Error in OpenAI generation:", error);
    throw error;
  }
}

async function generateWithReplicate(prompt: string, context: ImageContext): Promise<ImageGenerationResult> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    console.error("❌ REPLICATE_API_TOKEN not found in environment");
    throw new Error('REPLICATE_API_TOKEN not configured');
  }

  console.log("🔑 Replicate API Token status: CONFIGURED");
  console.log("🎯 Using Replicate FLUX model as fallback...");

  try {
    // Create prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "black-forest-labs/flux-schnell:bbf5f46e5319c1d2bc4e8b1e0b7b8e0e7e6e7e6e",
        input: {
          prompt: prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
          num_inference_steps: 4
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("❌ Replicate prediction creation failed:", errorText);
      throw new Error(`Replicate prediction creation failed (${createResponse.status}): ${errorText}`);
    }

    const prediction = await createResponse.json();
    console.log("✅ Replicate prediction created:", prediction.id);

    // Poll for completion
    const result = await pollPredictionWithTimeout(prediction.id, replicateToken, 60000);
    
    if (result.status === 'succeeded' && result.output?.[0]) {
      const imageData = await downloadAndConvertImage(result.output[0]);
      console.log("✅ Replicate image generated and converted");
      
      return {
        imageData,
        usedModel: 'replicate-flux',
        attempts: 1
      };
    }
    
    throw new Error(`Replicate prediction failed: ${result.error || 'Unknown error'}`);
    
  } catch (error) {
    console.error("❌ Error in Replicate generation:", error);
    throw error;
  }
}

async function pollPredictionWithTimeout(predictionId: string, token: string, timeoutMs: number): Promise<any> {
  const maxAttempts = Math.floor(timeoutMs / 3000);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    try {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!statusResponse.ok) {
        console.error(`❌ Status check failed: ${statusResponse.status}`);
        continue;
      }

      const status = await statusResponse.json();
      console.log(`⏱️ Poll ${attempt + 1}/${maxAttempts}: ${status.status}`);
      
      if (status.status === 'succeeded' || status.status === 'failed') {
        return status;
      }
    } catch (error) {
      console.error(`❌ Error during status check ${attempt + 1}:`, error);
    }
  }
  
  throw new Error(`Prediction timeout after ${timeoutMs}ms`);
}

async function downloadAndConvertImage(imageUrl: string): Promise<string> {
  console.log("📥 Downloading image from:", imageUrl);
  
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: ${imageResponse.status}`);
  }
  
  const arrayBuffer = await imageResponse.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  const chunkSize = 8192;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  const imageData = btoa(binaryString);
  console.log("✅ Image converted to base64, size:", imageData.length);
  return imageData;
}

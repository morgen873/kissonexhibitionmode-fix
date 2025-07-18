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
  usedModel: 'stable-diffusion-xl' | 'sdxl-lightning';
}

interface ReplicateResponse {
  id: string;
  model: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string[];
  error?: string;
}

export async function generateImageWithFallback(
  imagePrompt: string,
  imageContext: ImageContext,
  openai?: any // Keep for backward compatibility but not used
): Promise<ImageGenerationResult> {
  console.log("📥 ATTEMPTING MULTI-MODEL GENERATION WITH CORRECTED MODEL IDS...");
  
  // Corrected model strategy with verified working model identifiers
  const models = [
    {
      name: 'stable-diffusion-xl',
      id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      optimize: (prompt: string) => optimizePromptForSDXL(prompt, imageContext)
    },
    {
      name: 'sdxl-lightning',
      id: 'lucataco/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f',
      optimize: (prompt: string) => optimizePromptForSDXL(prompt, imageContext)
    }
  ];

  let lastError: Error | null = null;
  
  for (const [index, model] of models.entries()) {
    try {
      console.log(`🎨 ATTEMPTING ${model.name.toUpperCase()} (${index + 1}/${models.length})...`);
      console.log(`📡 Using model: ${model.id}`);
      
      const optimizedPrompt = model.optimize(imagePrompt);
      console.log(`🔤 Optimized prompt length: ${optimizedPrompt.length}`);
      console.log(`🔤 First 100 chars: ${optimizedPrompt.substring(0, 100)}`);
      
      const imageData = await generateWithReplicate(optimizedPrompt, model.id);
      
      console.log(`✅ SUCCESS WITH ${model.name.toUpperCase()}`);
      return {
        imageData,
        usedModel: model.name as 'stable-diffusion-xl' | 'sdxl-lightning'
      };
      
    } catch (error) {
      console.error(`❌ ${model.name.toUpperCase()} FAILED:`, error.message);
      console.error(`📋 Full error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
        modelId: model.id
      });
      lastError = error;
      
      // Continue to next model unless this is the last one
      if (index < models.length - 1) {
        console.log(`⏭️ TRYING NEXT MODEL...`);
        continue;
      }
    }
  }
  
  // If all models failed, throw the last error with enhanced context
  console.error("❌ ALL IMAGE GENERATION MODELS FAILED");
  console.error("🔍 Last error details:", lastError);
  console.error("🔍 Attempted models:", models.map(m => m.id));
  throw new Error(`All image generation models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

async function generateWithReplicate(prompt: string, modelVersion: string): Promise<string> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    console.error('❌ REPLICATE_API_TOKEN not found in environment variables');
    throw new Error('REPLICATE_API_TOKEN not found in environment variables');
  }

  console.log("🔑 Replicate token found, length:", replicateToken.length);
  console.log("🎨 REPLICATE CONFIG [CORRECTED]:");
  console.log("- Model version:", modelVersion);
  console.log("- Prompt length:", prompt.length);
  console.log("- First 100 chars:", prompt.substring(0, 100));
  
  // Create prediction with version ID (not model name)
  const requestBody = {
    version: modelVersion,
    input: getInputForModel(modelVersion, prompt)
  };
  
  console.log("📤 Request body structure:", {
    version: modelVersion,
    inputKeys: Object.keys(requestBody.input),
    promptLength: requestBody.input.prompt?.length
  });
  
  // Create prediction with enhanced error handling
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  console.log("🔍 Create prediction response status:", createResponse.status);
  console.log("🔍 Create prediction response headers:", Object.fromEntries(createResponse.headers.entries()));

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("❌ Create prediction error response:", errorText);
    console.error("❌ Request body sent:", JSON.stringify(requestBody, null, 2));
    console.error("❌ Response status:", createResponse.status);
    console.error("❌ Response headers:", Object.fromEntries(createResponse.headers.entries()));
    
    // Try to parse error details
    let errorDetails = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorDetails = errorJson.detail || errorJson.message || errorText;
    } catch (e) {
      // Keep original error text if JSON parsing fails
    }
    
    throw new Error(`Failed to create prediction (${createResponse.status}): ${errorDetails}`);
  }

  const prediction: ReplicateResponse = await createResponse.json();
  console.log("🔄 PREDICTION CREATED [CORRECTED]:", prediction.id);
  console.log("📋 Prediction details:", {
    id: prediction.id,
    status: prediction.status,
    model: prediction.model,
    version: prediction.version
  });

  // Use the robust polling mechanism
  const pollResult = await pollPredictionStatusV2(prediction.id, replicateToken);
  
  if (pollResult.status === 'succeeded' && pollResult.output?.[0]) {
    console.log("🖼️ Generated image URL [CORRECTED]:", pollResult.output[0]);
    
    // Download and convert to base64
    try {
      const imageResponse = await fetch(pollResult.output[0]);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image: ${imageResponse.status} - ${imageResponse.statusText}`);
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log("✅ Image downloaded and converted to base64 [CORRECTED], size:", imageData.length);
      return imageData;
    } catch (downloadError) {
      console.error("❌ Failed to download generated image:", downloadError);
      throw new Error(`Failed to download generated image: ${downloadError.message}`);
    }
  }
  
  if (pollResult.status === 'failed') {
    const errorMsg = pollResult.error || 'Unknown error';
    console.error("❌ Prediction failed with error:", errorMsg);
    throw new Error(`Prediction failed: ${errorMsg}`);
  }
  
  throw new Error(`Prediction did not succeed within timeout period. Final status: ${pollResult.status}`);
}

// Enhanced polling function with better error handling
async function pollPredictionStatusV2(predictionId: string, token: string): Promise<ReplicateResponse> {
  const maxAttempts = 30;
  const pollInterval = 3000; // 3 seconds
  
  console.log(`🔄 Starting enhanced polling for prediction ${predictionId}`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Wait before polling (except first attempt)
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { 
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error(`❌ Status request failed (${statusResponse.status}):`, errorText);
        throw new Error(`Status request failed: ${statusResponse.status} - ${errorText}`);
      }

      const status: ReplicateResponse = await statusResponse.json();
      console.log(`🔄 STATUS CHECK ${attempt + 1}/${maxAttempts}: ${status.status}`);
      
      // Log additional details for debugging
      if (status.status === 'failed' && status.error) {
        console.error("❌ Prediction error details:", status.error);
      }

      // Terminal states
      if (status.status === 'succeeded' || status.status === 'failed') {
        console.log(`✅ Terminal state reached: ${status.status}`);
        if (status.status === 'succeeded') {
          console.log("📋 Success details:", {
            outputCount: status.output?.length,
            outputUrl: status.output?.[0]
          });
        }
        return status;
      }
      
      // Continue polling for non-terminal states
      if (status.status === 'starting' || status.status === 'processing') {
        console.log(`⏳ Still ${status.status}, continuing... (${attempt + 1}/${maxAttempts})`);
        continue;
      }
      
      // Unexpected status
      console.warn(`⚠️ Unexpected status: ${status.status}`);
      
    } catch (error) {
      console.error(`❌ Polling error (attempt ${attempt + 1}/${maxAttempts}):`, error);
      
      // If this is the last attempt, throw the error
      if (attempt === maxAttempts - 1) {
        throw new Error(`Polling failed after ${maxAttempts} attempts: ${error.message}`);
      }
      
      // Otherwise, wait a bit and try again
      console.log("⏳ Waiting before retry...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error(`Polling timeout after ${maxAttempts} attempts (${maxAttempts * pollInterval / 1000} seconds)`);
}

function getInputForModel(modelVersion: string, prompt: string): any {
  // Check if it's SDXL Lightning based on the version string
  if (modelVersion.includes('sdxl-lightning')) {
    return {
      prompt: prompt,
      width: 1024,
      height: 1024,
      num_outputs: 1,
      num_inference_steps: 4,
      guidance_scale: 1.2,
      scheduler: "K_EULER"
    };
  }
  
  // Default SDXL configuration for stability-ai/sdxl
  return {
    prompt: prompt,
    width: 1024,
    height: 1024,
    num_outputs: 1,
    scheduler: 'K_EULER',
    num_inference_steps: 30,
    guidance_scale: 7.5,
    apply_watermark: false
  };
}

function optimizePromptForFlux(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList } = imageContext;
  
  // Flux works better with simpler, more direct prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 3).join(', ') : 'traditional ingredients';
  
  const fluxPrompt = `A single ${dumplingShape}-shaped dumpling with ${flavor} flavor, ${timelineTheme.toLowerCase()} style, made with ${ingredientsText}. Professional food photography, studio lighting, black background, highly detailed, appetizing presentation, commercial quality, centered composition.`;
  
  console.log("🔄 FLUX OPTIMIZED PROMPT:");
  console.log("- Length:", fluxPrompt.length);
  console.log("- Content:", fluxPrompt);
  
  return fluxPrompt;
}

function optimizePromptForSDXL(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // SDXL works better with more descriptive, detailed prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 6).join(', ') : 'traditional ingredients';
  
  // Enhanced SDXL prompt with better structure
  const qualityTerms = "artistic masterpiece, best quality, ultra detailed, 8k resolution";
  const photoStyle = "professional food photography, commercial photography quality";
  const lighting = "studio lighting, cinematic lighting, soft natural lighting";
  const effects = "speculative design, hyper-realistic, highly detailed texture, perfect composition";
  const composition = "single dumpling centered, shallow depth of field, pure solid matte black background, no textures, no patterns, no gradients, completely black void background";
  const foodRequirements = "mostly sealed wrapper, optional visible filling, opaque dumpling skin";
  const presentation = "appetizing presentation, food art, gourmet presentation";
  
  const sdxlPrompt = `${qualityTerms}, ${photoStyle}, ${dumplingShape}-shaped dumpling with ${flavor} flavor, ${timelineTheme.toLowerCase()} culinary style, featuring ${ingredientsText}, ${lighting}, ${effects}, ${composition}, ${foodRequirements}, ${presentation}`;
  
  console.log("🔄 SDXL OPTIMIZED PROMPT:");
  console.log("- Length:", sdxlPrompt.length);
  console.log("- Content preview:", sdxlPrompt.substring(0, 200));
  
  return sdxlPrompt;
}

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
  console.log("📥 ATTEMPTING MULTI-MODEL GENERATION WITH ENHANCED FALLBACKS [FIXED]...");
  
  // Enhanced fallback strategy with SDXL as default
  const models = [
    {
      name: 'stable-diffusion-xl',
      id: 'stability-ai/sdxl',
      optimize: (prompt: string) => optimizePromptForSDXL(prompt, imageContext)
    },
    {
      name: 'sdxl-lightning',
      id: 'bytedance/sdxl-lightning-4step',
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
      
      const imageData = await generateWithReplicate(optimizedPrompt, model.id);
      
      console.log(`✅ SUCCESS WITH ${model.name.toUpperCase()}`);
      return {
        imageData,
        usedModel: model.name as 'stable-diffusion-xl' | 'sdxl-lightning'
      };
      
    } catch (error) {
      console.error(`❌ ${model.name.toUpperCase()} FAILED:`, error.message);
      console.error(`📋 Error details:`, error);
      lastError = error;
      
      // Continue to next model unless this is the last one
      if (index < models.length - 1) {
        console.log(`⏭️ TRYING NEXT MODEL...`);
        continue;
      }
    }
  }
  
  // If all models failed, throw the last error
  console.error("❌ ALL IMAGE GENERATION MODELS FAILED");
  console.error("🔍 Last error details:", lastError);
  throw lastError || new Error("All image generation models failed");
}

async function generateWithReplicate(prompt: string, model: string): Promise<string> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    console.error('❌ REPLICATE_API_TOKEN not found in environment variables');
    throw new Error('REPLICATE_API_TOKEN not found in environment variables');
  }

  console.log("🔑 Replicate token found, length:", replicateToken.length);

  console.log("🎨 REPLICATE CONFIG [v2]:");
  console.log("- Model:", model);
  console.log("- Prompt length:", prompt.length);
  console.log("- First 100 chars:", prompt.substring(0, 100));
  
  // Determine if this is a model name or version ID
  const isModelName = !model.includes(':');
  const requestBody = isModelName ? {
    model: model,
    input: getInputForModel(model, prompt)
  } : {
    version: model,
    input: getInputForModel(model, prompt)
  };
  
  // Create prediction with enhanced error handling
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("❌ Create prediction error:", errorText);
    throw new Error(`Failed to create prediction: ${createResponse.status} - ${errorText}`);
  }

  const prediction: ReplicateResponse = await createResponse.json();
  console.log("🔄 PREDICTION CREATED [v2]:", prediction.id);

  // Use the robust polling mechanism
  const pollResult = await pollPredictionStatusV2(prediction.id, replicateToken);
  
  if (pollResult.status === 'succeeded' && pollResult.output?.[0]) {
    console.log("🖼️ Generated image URL [v2]:", pollResult.output[0]);
    
    // Download and convert to base64
    const imageResponse = await fetch(pollResult.output[0]);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download generated image: ${imageResponse.status}`);
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log("✅ Image downloaded and converted to base64 [v2], size:", imageData.length);
    return imageData;
  }
  
  if (pollResult.status === 'failed') {
    const errorMsg = pollResult.error || 'Unknown error';
    console.error("❌ Prediction failed with error:", errorMsg);
    throw new Error(`Prediction failed: ${errorMsg}`);
  }
  
  throw new Error('Prediction did not succeed within timeout period');
}

// COMPLETELY NEW POLLING FUNCTION TO AVOID ANY RECURSION ISSUES
async function pollPredictionStatusV2(predictionId: string, token: string): Promise<ReplicateResponse> {
  const maxAttempts = 30;
  const pollInterval = 3000; // 3 seconds
  
  console.log(`🔄 Starting polling v2 for prediction ${predictionId}`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Wait before polling (except first attempt)
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!statusResponse.ok) {
        throw new Error(`Status request failed: ${statusResponse.status}`);
      }

      const status: ReplicateResponse = await statusResponse.json();
      console.log(`🔄 STATUS CHECK ${attempt + 1}/${maxAttempts}: ${status.status}`);

      // Terminal states
      if (status.status === 'succeeded' || status.status === 'failed') {
        console.log(`✅ Terminal state reached: ${status.status}`);
        return status;
      }
      
      // Continue polling for non-terminal states
      if (status.status === 'starting' || status.status === 'processing') {
        console.log(`⏳ Still ${status.status}, continuing...`);
        continue;
      }
      
      // Unexpected status
      console.warn(`⚠️ Unexpected status: ${status.status}`);
      
    } catch (error) {
      console.error(`❌ Polling error (attempt ${attempt + 1}):`, error);
      
      // If this is the last attempt, throw the error
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      
      // Otherwise, wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error(`Polling timeout after ${maxAttempts} attempts`);
}

function getInputForModel(model: string, prompt: string): any {
  // Flux Schnell configuration
  if (model.includes('flux-schnell')) {
    return {
      prompt: prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "png",
      output_quality: 80,
      num_inference_steps: 4
    };
  }
  
  // SDXL Lightning configuration
  if (model.includes('sdxl-lightning')) {
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
  
  // Default SDXL configuration
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

async function generateWithStableDiffusion35Large(
  imageContext: ImageContext,
  originalPrompt: string
): Promise<ImageGenerationResult> {
  const sd35Prompt = optimizePromptForSD35Large(originalPrompt, imageContext);
  console.log("🎨 STABLE DIFFUSION 3.5 LARGE FALLBACK PROMPT:");
  console.log("- Length:", sd35Prompt.length);
  console.log("- Content:", sd35Prompt);
  
  const imageData = await generateWithReplicate(
    sd35Prompt,
    'bytedance/sdxl-lightning-4step'
  );
  
  console.log("✅ STABLE DIFFUSION 3.5 LARGE FALLBACK SUCCESS");
  
  return {
    imageData,
    usedModel: 'sdxl-lightning'
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
  
  // CUSTOMIZABLE PROMPT COMPONENTS - MODIFY THESE TO CHANGE ALL SDXL PROMPTS:
  
  // 1. Quality and style terms (affects overall image quality)
  const qualityTerms = "artistic masterpiece, best quality, ultra detailed, 8k resolution";
  
  // 2. Photography style (change this to modify the look)
  const photoStyle = "professional food photography, commercial photography quality";
  
  // 3. Lighting setup (modify for different lighting effects)
  const lighting = "studio lighting, cinematic lighting, soft natural lighting";
  
  // 4. Visual effects and textures (customize visual appearance)
  const effects = "speculative design, hyper-realistic, highly detailed texture, perfect composition";
  
  // 5. Composition rules (change framing and layout)
  const composition = "single dumpling centered, shallow depth of field, pure solid matte black background, no textures, no patterns, no gradients, completely black void background";
  
  // 6. Food-specific requirements (dumpling appearance rules)
  const foodRequirements = "mostly sealed wrapper, optional visible filling, opaque dumpling skin";
  
  // 7. Presentation style (final presentation look)
  const presentation = "appetizing presentation, food art, gourmet presentation";
  
  // BUILD THE FINAL PROMPT (you can rearrange these components)
  const sdxlPrompt = `${qualityTerms}, ${photoStyle}, ${dumplingShape}-shaped dumpling with ${flavor} flavor, ${timelineTheme.toLowerCase()} culinary style, featuring ${ingredientsText}, ${lighting}, ${effects}, ${composition}, ${foodRequirements}, ${presentation}`;
  
  console.log("🔄 SDXL OPTIMIZED PROMPT:");
  console.log("- Length:", sdxlPrompt.length);
  console.log("- Content:", sdxlPrompt);
  
  return sdxlPrompt;
}

function optimizePromptForSD35Large(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // SD 3.5 Large works well with natural language prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 5).join(', ') : 'traditional ingredients';
  
  const sd35Prompt = `A single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, photographed in ${timelineTheme.toLowerCase()} style. Made with ${ingredientsText}. Professional food photography with studio lighting against a pure solid matte black background - no textures, no patterns, no gradients, completely black void background. The dumpling wrapper is completely sealed and opaque, showing no internal filling. Hyper-realistic, appetizing presentation with shallow depth of field. Commercial photography quality, perfectly centered composition. Solid black background only, no extras, no distractions.`;
  
  console.log("🔄 SD 3.5 LARGE OPTIMIZED PROMPT:");
  console.log("- Length:", sd35Prompt.length);
  console.log("- Content:", sd35Prompt);
  
  return sd35Prompt;
}


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
  usedModel: 'sdxl' | 'stable-diffusion-3.5-large';
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
  console.log("📥 ATTEMPTING MULTI-MODEL GENERATION WITH ENHANCED FALLBACKS...");
  
  // Enhanced fallback strategy with verified working models
  const models = [
    {
      name: 'flux-schnell',
      id: 'black-forest-labs/flux-schnell',
      optimize: (prompt: string) => optimizePromptForFlux(prompt, imageContext)
    },
    {
      name: 'sdxl-lightning',
      id: 'bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f',
      optimize: (prompt: string) => optimizePromptForSDXL(prompt, imageContext)
    },
    {
      name: 'stable-diffusion-xl',
      id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
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
        usedModel: model.name as 'sdxl' | 'stable-diffusion-3.5-large'
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
    throw new Error('REPLICATE_API_TOKEN not found in environment variables');
  }

  console.log("🎨 REPLICATE CONFIG:");
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
  
  // Enhanced API call with better error handling
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
    console.error("📋 Request body was:", JSON.stringify(requestBody, null, 2));
    throw new Error(`Failed to create prediction: ${createResponse.status} - ${errorText}`);
  }

  const prediction: ReplicateResponse = await createResponse.json();
  console.log("🔄 PREDICTION CREATED:", prediction.id);

  // Reduced polling time for edge function compatibility
  let attempts = 0;
  const maxAttempts = 36; // 3 minutes max (more reasonable for edge functions)
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        'Authorization': `Token ${replicateToken}`,
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to get prediction status: ${statusResponse.status}`);
    }

    const status: ReplicateResponse = await statusResponse.json();
    console.log(`🔄 PREDICTION STATUS (${attempts + 1}/${maxAttempts}):`, status.status);

    if (status.status === 'succeeded') {
      if (!status.output?.[0]) {
        throw new Error('No output URL in successful prediction');
      }
      
      console.log("🖼️ Generated image URL:", status.output[0]);
      
      // Download image and convert to base64
      const imageResponse = await fetch(status.output[0]);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image: ${imageResponse.status}`);
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log("✅ Image downloaded and converted to base64, size:", imageData.length);
      return imageData;
    }
    
    if (status.status === 'failed') {
      const errorMsg = status.error || 'Unknown error';
      console.error("❌ Prediction failed with error:", errorMsg);
      throw new Error(`Prediction failed: ${errorMsg}`);
    }
    
    attempts++;
  }
  
  throw new Error(`Image generation timed out after ${maxAttempts * 5} seconds`);
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
    'bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f'
  );
  
  console.log("✅ STABLE DIFFUSION 3.5 LARGE FALLBACK SUCCESS");
  
  return {
    imageData,
    usedModel: 'stable-diffusion-3.5-large'
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

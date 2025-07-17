
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
  console.log("📥 ATTEMPTING SDXL GENERATION...");
  
  // Step 1: Try SDXL first
  try {
    const sdxlPrompt = optimizePromptForSDXL(imagePrompt, imageContext);
    const imageData = await generateWithReplicate(
      sdxlPrompt,
      'black-forest-labs/flux-schnell'
    );
    
    console.log("✅ SDXL SUCCESS");
    return {
      imageData,
      usedModel: 'sdxl'
    };
    
  } catch (sdxlError) {
    console.log("⚠️ SDXL FAILED, TRYING STABLE DIFFUSION 3.5 LARGE FALLBACK...");
    console.log("SDXL Error:", sdxlError.message);
    
    // Step 2: Fallback to Stable Diffusion 3.5 Large
    return await generateWithStableDiffusion35Large(imageContext, imagePrompt);
  }
}

async function generateWithReplicate(prompt: string, model: string): Promise<string> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    throw new Error('REPLICATE_API_TOKEN not found in environment variables');
  }

  console.log("🎨 REPLICATE CONFIG:");
  console.log("- Model:", model);
  console.log("- Prompt length:", prompt.length);
  
  // Different parameters for different models
  let inputParams: any = { prompt: prompt };
  
  if (model.includes('sdxl')) {
    // SDXL parameters
    inputParams = {
      prompt: prompt,
      width: 1024,
      height: 1024,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 30,
      scheduler: "K_EULER"
    };
  } else if (model.includes('flux')) {
    // FLUX parameters
    inputParams = {
      prompt: prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4
    };
  }

  // Create prediction with model-specific parameters
  const requestBody = model.includes(':') 
    ? { version: model, input: inputParams }
    : { model: model, input: inputParams };
    
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
    console.error("❌ Replicate API Error Response:", errorText);
    console.error("❌ Status:", createResponse.status);
    console.error("❌ Headers:", Object.fromEntries(createResponse.headers.entries()));
    console.error("❌ Request body was:", JSON.stringify(requestBody, null, 2));
    throw new Error(`Failed to create prediction: ${createResponse.status} - ${errorText}`);
  }

  const prediction: ReplicateResponse = await createResponse.json();
  console.log("🔄 PREDICTION CREATED:", prediction.id);

  // Poll for completion
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max
  
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
      
      // Download image and convert to base64
      const imageResponse = await fetch(status.output[0]);
      if (!imageResponse.ok) {
        throw new Error('Failed to download generated image');
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      return imageData;
    }
    
    if (status.status === 'failed') {
      throw new Error(`Prediction failed: ${status.error || 'Unknown error'}`);
    }
    
    attempts++;
  }
  
  throw new Error('Image generation timed out');
}

async function generateWithStableDiffusion35Large(
  imageContext: ImageContext,
  originalPrompt: string
): Promise<ImageGenerationResult> {
  console.log("🔄 SD 3.5 LARGE OPTIMIZED PROMPT:");
  
  try {
    const sd35Prompt = optimizePromptForSD35Large(originalPrompt, imageContext);
    console.log("🎨 STABLE DIFFUSION 3.5 LARGE FALLBACK PROMPT:");
    console.log("- Length:", sd35Prompt.length);
    console.log("- Content:", sd35Prompt);
    
    const imageData = await generateWithReplicate(
      sd35Prompt,
      'black-forest-labs/flux-schnell'
    );
    
    console.log("✅ STABLE DIFFUSION 3.5 LARGE FALLBACK SUCCESS");
    
    return {
      imageData,
      usedModel: 'stable-diffusion-3.5-large'
    };
  } catch (fallbackError) {
    console.error("❌ BOTH MODELS FAILED:", fallbackError.message);
    throw new Error(`All image generation models failed: ${fallbackError.message}`);
  }
}

function optimizePromptForSDXL(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // SDXL works better with more descriptive, detailed prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 6).join(', ') : 'traditional ingredients';
  
  // CUSTOMIZABLE PROMPT COMPONENTS - MODIFY THESE TO CHANGE ALL SDXL PROMPTS:
  
  // 1. Quality and style terms (affects overall image quality)
  const qualityTerms = "artistic masterpiece, unorthodox design, best quality, ultra detailed, 8k resolution";
  
  // 2. Photography style (change this to modify the look)
  const photoStyle = "professional food photography, atmosphere of a commercial photography quality";
  
  // 3. Lighting setup (modify for different lighting effects)
  const lighting = "studio lighting, cinematic lighting, soft natural lighting";
  
  // 4. Visual effects and textures (customize visual appearance)
  const effects = "speculative design, hyper-realistic, highly detailed texture, perfect composition, non-traditional";
  
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

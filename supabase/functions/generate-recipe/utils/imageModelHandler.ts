
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
  usedModel: 'flux' | 'sdxl' | 'stable-diffusion';
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
  openai?: any // Not used - Replicate only
): Promise<ImageGenerationResult> {
  console.log("🎯 FIXED IMAGE GENERATION - USING WORKING MODELS");
  console.log("📥 ATTEMPTING FLUX GENERATION (PRIMARY)...");
  
  // Ensure we have the Replicate token (using KissOn token)
  const replicateToken = Deno.env.get('KissOn');
  if (!replicateToken) {
    throw new Error('❌ KissOn token not found - cannot generate image');
  }
  
  // Step 1: Try FLUX first (fast and reliable)
  try {
    console.log("🚀 CALLING FLUX via Replicate...");
    const fluxPrompt = optimizePromptForFlux(imagePrompt, imageContext);
    const imageData = await generateWithFlux(fluxPrompt, replicateToken);
    
    console.log("✅ FLUX SUCCESS - IMAGE GENERATED");
    return {
      imageData,
      usedModel: 'flux'
    };
    
  } catch (fluxError) {
    console.log("⚠️ FLUX FAILED, TRYING SDXL FALLBACK...");
    console.log("FLUX Error:", fluxError.message);
    
    // Step 2: Fallback to SDXL Base (stable version)
    try {
      console.log("🎨 CALLING SDXL BASE via Replicate...");
      const sdxlPrompt = optimizePromptForSDXL(imagePrompt, imageContext);
      const imageData = await generateWithSDXL(sdxlPrompt, replicateToken);
      
      console.log("✅ SDXL FALLBACK SUCCESS");
      return {
        imageData,
        usedModel: 'sdxl'
      };
      
    } catch (sdxlError) {
      console.log("⚠️ SDXL FAILED, TRYING STABLE DIFFUSION FALLBACK...");
      console.log("SDXL Error:", sdxlError.message);
      
      // Step 3: Final fallback to basic Stable Diffusion
      try {
        const result = await generateWithStableDiffusion(imageContext, imagePrompt, replicateToken);
        console.log("✅ STABLE DIFFUSION FINAL FALLBACK SUCCESS");
        return result;
      } catch (finalError) {
        console.error("❌ ALL REPLICATE MODELS FAILED");
        console.error("FLUX error:", fluxError.message);
        console.error("SDXL error:", sdxlError.message);
        console.error("Stable Diffusion error:", finalError.message);
        throw new Error(`All models failed: FLUX (${fluxError.message}), SDXL (${sdxlError.message}), SD (${finalError.message})`);
      }
    }
  }
}

// FLUX Model - Primary choice (fast and reliable)
async function generateWithFlux(prompt: string, replicateToken: string): Promise<string> {
  console.log("🚀 FLUX GENERATION:");
  console.log("- Prompt length:", prompt.length);
  console.log("- Model: FLUX Schnell");

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'black-forest-labs/flux-schnell:bf2f66fd46b9a44bdb3e3c5f41a7d0cff9b9ae2afff8ff7e00eb2b5e71ecbeb3',
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
    console.error("❌ FLUX API ERROR:", createResponse.status, errorText);
    throw new Error(`FLUX failed: ${createResponse.status} - ${errorText}`);
  }

  return await pollPrediction(await createResponse.json(), replicateToken);
}

// SDXL Model - First fallback
async function generateWithSDXL(prompt: string, replicateToken: string): Promise<string> {
  console.log("🎨 SDXL GENERATION:");
  console.log("- Prompt length:", prompt.length);
  console.log("- Model: SDXL Base 1.0");

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        apply_watermark: false
      }
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("❌ SDXL API ERROR:", createResponse.status, errorText);
    throw new Error(`SDXL failed: ${createResponse.status} - ${errorText}`);
  }

  return await pollPrediction(await createResponse.json(), replicateToken);
}

// Stable Diffusion - Final fallback
async function generateWithStableDiffusion(
  imageContext: ImageContext,
  originalPrompt: string,
  replicateToken: string
): Promise<ImageGenerationResult> {
  console.log("🔄 STABLE DIFFUSION FALLBACK:");
  
  const sdPrompt = optimizePromptForStableDiffusion(originalPrompt, imageContext);
  console.log("- Prompt length:", sdPrompt.length);
  console.log("- Model: Stable Diffusion v1.5");

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      input: {
        prompt: sdPrompt,
        width: 768,
        height: 768,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("❌ STABLE DIFFUSION API ERROR:", createResponse.status, errorText);
    throw new Error(`Stable Diffusion failed: ${createResponse.status} - ${errorText}`);
  }

  const imageData = await pollPrediction(await createResponse.json(), replicateToken);
  
  return {
    imageData,
    usedModel: 'stable-diffusion'
  };
}

// Shared polling function for all models
async function pollPrediction(prediction: ReplicateResponse, replicateToken: string): Promise<string> {
  console.log("🔄 PREDICTION CREATED:", prediction.id);

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

function optimizePromptForSDXL(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // SDXL works better with more descriptive, detailed prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 6).join(', ') : 'traditional ingredients';
  
  // WILD ARTISTIC PROMPT COMPONENTS - ENHANCED FOR SPECULATIVE CREATIVITY:
  
  // 1. Quality and style terms (affects overall image quality)
  const qualityTerms = "wildly artistic masterpiece, speculative design excellence, ultra surreal, 12k hyperdetailed resolution, consciousness-expanding visuals";
  
  // 2. Photography style (change this to modify the look)
  const photoStyle = "experimental food artistry, avant-garde culinary photography, reality-transcending presentation";
  
  // 3. Lighting setup (modify for different lighting effects)
  const lighting = "impossible lighting effects, dimensional illumination, reality-bending luminosity, dream-state lighting";
  
  // 4. Visual effects and textures (customize visual appearance)
  const effects = "mind-bending textures, reality-warping composition, psychedelic visual distortions, impossible material science";
  
  // 5. Composition rules (change framing and layout)
  const composition = "single dumpling levitating, anti-gravity presentation, pure artistic void background, consciousness-expanding centered composition";
  
  // 6. Food-specific requirements (dumpling appearance rules)
  const foodRequirements = "metamorphic wrapper properties, energy field emanations, reality-transcending dumpling physics";
  
  // 7. Presentation style (final presentation look)
  const presentation = "transcendent artistic presentation, gallery-worthy food art, paradigm-shifting culinary aesthetics";
  
  // BUILD THE FINAL PROMPT (you can rearrange these components)
  const sdxlPrompt = `${qualityTerms}, ${photoStyle}, ${dumplingShape}-shaped dumpling with ${flavor} flavor, ${timelineTheme.toLowerCase()} culinary style, featuring ${ingredientsText}, ${lighting}, ${effects}, ${composition}, ${foodRequirements}, ${presentation}`;
  
  console.log("🔄 SDXL OPTIMIZED PROMPT:");
  console.log("- Length:", sdxlPrompt.length);
  console.log("- Content:", sdxlPrompt);
  
  return sdxlPrompt;
}

function optimizePromptForFlux(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // FLUX works well with clean, direct prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 4).join(', ') : 'traditional ingredients';
  
  const fluxPrompt = `Professional food photography of a single ${dumplingShape}-shaped dumpling with ${flavor} flavor, ${timelineTheme.toLowerCase()} culinary style, made with ${ingredientsText}. Studio lighting, clean background, appetizing presentation, high quality, detailed texture, centered composition.`;
  
  console.log("🚀 FLUX OPTIMIZED PROMPT:");
  console.log("- Length:", fluxPrompt.length);
  console.log("- Content:", fluxPrompt);
  
  return fluxPrompt;
}

function optimizePromptForStableDiffusion(prompt: string, imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // Stable Diffusion v1.5 works well with simpler prompts
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 3).join(', ') : 'traditional ingredients';
  
  const sdPrompt = `A ${dumplingShape} dumpling, ${flavor} flavor, made with ${ingredientsText}, ${timelineTheme.toLowerCase()} style, food photography, professional lighting, clean background`;
  
  console.log("🔄 STABLE DIFFUSION OPTIMIZED PROMPT:");
  console.log("- Length:", sdPrompt.length);
  console.log("- Content:", sdPrompt);
  
  return sdPrompt;
}

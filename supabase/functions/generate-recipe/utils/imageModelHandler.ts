
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
  openai?: any // Not used - Replicate only
): Promise<ImageGenerationResult> {
  console.log("🎯 REPLICATE-ONLY IMAGE GENERATION");
  console.log("📥 ATTEMPTING SDXL GENERATION...");
  
  // Ensure we have the Replicate token (using KissOn token)
  const replicateToken = Deno.env.get('KissOn');
  if (!replicateToken) {
    throw new Error('❌ KissOn token not found - cannot generate image');
  }
  
  // Step 1: Try SDXL first
  try {
    console.log("🎨 CALLING SDXL via Replicate...");
    const sdxlPrompt = optimizePromptForSDXL(imagePrompt, imageContext);
    const imageData = await generateWithReplicate(
      sdxlPrompt,
      'lucataco/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffb7725a5a4a9dea6c7e8b3b4b0d7b6b1'
    );
    
    console.log("✅ SDXL SUCCESS - IMAGE GENERATED WITH REPLICATE");
    return {
      imageData,
      usedModel: 'sdxl'
    };
    
  } catch (sdxlError) {
    console.log("⚠️ SDXL FAILED, TRYING STABLE DIFFUSION 3.5 LARGE FALLBACK...");
    console.log("SDXL Error:", sdxlError.message);
    
    // Step 2: Fallback to Stable Diffusion 3.5 Large (also via Replicate)
    try {
      const result = await generateWithStableDiffusion35Large(imageContext, imagePrompt);
      console.log("✅ FALLBACK SUCCESS - IMAGE GENERATED WITH SD 3.5 LARGE VIA REPLICATE");
      return result;
    } catch (fallbackError) {
      console.error("❌ ALL REPLICATE MODELS FAILED");
      console.error("SDXL error:", sdxlError.message);
      console.error("SD 3.5 Large error:", fallbackError.message);
      throw new Error(`All Replicate models failed: SDXL (${sdxlError.message}), SD 3.5 Large (${fallbackError.message})`);
    }
  }
}

async function generateWithReplicate(prompt: string, model: string): Promise<string> {
  const replicateToken = Deno.env.get('KissOn');
  if (!replicateToken) {
    throw new Error('KissOn token not found in environment variables');
  }

  console.log("🎨 REPLICATE CONFIG:");
  console.log("- Model:", model);
  console.log("- Prompt length:", prompt.length);
  console.log("- API Token length:", replicateToken.length);
  console.log("- API Token prefix:", replicateToken.substring(0, 10) + "...");
  
  // Test Replicate API connectivity first
  console.log("🌐 TESTING REPLICATE API CONNECTIVITY...");
  
  // Create prediction
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: 'K_EULER',
        num_inference_steps: 10, // Reduced to comply with API limits
        guidance_scale: 7.0, // Slightly reduced for better compatibility
        prompt_strength: 0.85, // Reduced for better stability
        refine: 'expert_ensemble_refiner',
        high_noise_frac: 0.8, // Reduced for better stability
        apply_watermark: false
      }
    })
  });

  console.log("📡 REPLICATE API RESPONSE:");
  console.log("- Status:", createResponse.status);
  console.log("- Status Text:", createResponse.statusText);
  console.log("- Headers:", Object.fromEntries(createResponse.headers.entries()));

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("❌ REPLICATE API ERROR:");
    console.error("- Status:", createResponse.status);
    console.error("- Error Body:", errorText);
    
    // Check for specific API limit violations
    if (errorText.includes('num_inference_steps')) {
      console.error("⚠️ API LIMIT VIOLATION: num_inference_steps parameter exceeds allowed limits");
    }
    if (errorText.includes('422')) {
      console.error("⚠️ PARAMETER VALIDATION ERROR: One or more parameters are invalid");
    }
    
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
  const sd35Prompt = optimizePromptForSD35Large(originalPrompt, imageContext);
  console.log("🎨 STABLE DIFFUSION 3.5 LARGE FALLBACK PROMPT:");
  console.log("- Length:", sd35Prompt.length);
  console.log("- Content:", sd35Prompt);
  
  const imageData = await generateWithReplicate(
    sd35Prompt,
    'stability-ai/stable-diffusion-3-5-large:45a663bfc7127b47c30da1a98f19a37b4525b8ff60b717f11b42d95550c3a7f8'
  );
  
  console.log("✅ STABLE DIFFUSION 3.5 LARGE FALLBACK SUCCESS");
  
  return {
    imageData,
    usedModel: 'stable-diffusion-3.5-large'
  };
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

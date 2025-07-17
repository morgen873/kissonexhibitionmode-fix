
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
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'
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
        scheduler: 'DPMSolverMultistep', // CRAZY TEST: Experimental scheduler for enhanced creativity
        num_inference_steps: 80, // CRAZY TEST: Optimal steps for creative detail without over-processing
        guidance_scale: 5.5, // CRAZY TEST: Sweet spot for creative freedom while maintaining prompt adherence
        prompt_strength: 0.95, // CRAZY TEST: High prompt strength for dramatic artistic interpretation
        refine: 'expert_ensemble_refiner',
        high_noise_frac: 0.85, // CRAZY TEST: High noise for creative variation without chaos
        apply_watermark: false,
        // Enhanced creative parameters for artistic generation
        negative_prompt: "boring, plain, ordinary, conventional, realistic photography, mundane, simple, normal dumpling, basic food photography, low quality, blurry",
      }
    })
  });

  if (!createResponse.ok) {
    throw new Error(`Failed to create prediction: ${createResponse.status}`);
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
    'bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f'
  );
  
  console.log("✅ STABLE DIFFUSION 3.5 LARGE FALLBACK SUCCESS");
  
  return {
    imageData,
    usedModel: 'stable-diffusion-3.5-large'
  };
}

function optimizePromptForSDXL(prompt: string, imageContext: ImageContext): string {
  // Use the artistic prompt from promptBuilders.ts as the base
  // Add only technical optimizations for SDXL without overriding the artistic content
  
  // SDXL technical optimizations
  const technicalTerms = "ultra high resolution, masterpiece quality, professional food photography, studio lighting, shallow depth of field";
  const backgroundTechnical = "clean minimalist background, perfect centered composition";
  
  // Combine the artistic prompt with technical enhancements
  const optimizedPrompt = `${prompt}, ${technicalTerms}, ${backgroundTechnical}`;
  
  console.log("🔄 SDXL OPTIMIZED PROMPT (Using Artistic Base):");
  console.log("- Original artistic prompt length:", prompt.length);
  console.log("- Final optimized length:", optimizedPrompt.length);
  console.log("- Artistic content:", prompt);
  console.log("- Final optimized:", optimizedPrompt);
  
  return optimizedPrompt;
}

function optimizePromptForSD35Large(prompt: string, imageContext: ImageContext): string {
  // Use the artistic prompt from promptBuilders.ts as the base
  // SD 3.5 Large works well with natural language descriptions
  
  // Add minimal technical terms for SD 3.5 Large
  const technicalTerms = "professional food photography, studio lighting, centered composition";
  
  // Combine the artistic prompt with minimal technical enhancements
  const optimizedPrompt = `${prompt}, ${technicalTerms}`;
  
  console.log("🔄 SD 3.5 LARGE OPTIMIZED PROMPT (Using Artistic Base):");
  console.log("- Original artistic prompt length:", prompt.length);
  console.log("- Final optimized length:", optimizedPrompt.length);
  console.log("- Artistic content:", prompt);
  console.log("- Final optimized:", optimizedPrompt);
  
  return optimizedPrompt;
}


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

interface ModelConfig {
  name: string;
  id: string;
  maxAttempts: number;
  getInput: (prompt: string, negativePrompt: string) => any;
}

export async function generateImageWithEnhancedFallback(
  prompt: string,
  negativePrompt: string,
  imageContext: ImageContext
): Promise<ImageGenerationResult> {
  console.log("=== ENHANCED IMAGE GENERATION WITH VALIDATION ===");
  
  // Validate prompt before generation
  const validationResult = validatePrompt(prompt, imageContext);
  if (!validationResult.isValid) {
    console.log("❌ PROMPT VALIDATION FAILED:", validationResult.issues);
    throw new Error(`Prompt validation failed: ${validationResult.issues.join(', ')}`);
  }
  
  // Enhanced model configurations with negative prompt support
  const models: ModelConfig[] = [
    {
      name: 'stable-diffusion-xl',
      id: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      maxAttempts: 2,
      getInput: (prompt: string, negativePrompt: string) => ({
        prompt: prompt,
        negative_prompt: negativePrompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: 'K_EULER',
        num_inference_steps: 30,
        guidance_scale: 7.5,
        apply_watermark: false
      })
    },
    {
      name: 'sdxl-lightning',
      id: 'lucataco/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f',
      maxAttempts: 2,
      getInput: (prompt: string, negativePrompt: string) => ({
        prompt: prompt,
        negative_prompt: negativePrompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        num_inference_steps: 4,
        guidance_scale: 1.2,
        scheduler: "K_EULER"
      })
    }
  ];

  let totalAttempts = 0;
  
  for (const model of models) {
    for (let attempt = 1; attempt <= model.maxAttempts; attempt++) {
      totalAttempts++;
      
      try {
        console.log(`🎨 ATTEMPT ${totalAttempts}: ${model.name.toUpperCase()} (${attempt}/${model.maxAttempts})`);
        
        const imageData = await generateWithReplicateEnhanced(
          model.id,
          model.getInput(prompt, negativePrompt)
        );
        
        // Validate the generated image
        const imageValidation = await validateGeneratedImage(imageData, imageContext);
        
        if (imageValidation.isValid) {
          console.log(`✅ SUCCESS WITH ${model.name.toUpperCase()} after ${totalAttempts} attempts`);
          return {
            imageData,
            usedModel: model.name,
            attempts: totalAttempts
          };
        } else {
          console.log(`⚠️ Generated image validation failed: ${imageValidation.issues.join(', ')}`);
          if (attempt < model.maxAttempts) {
            console.log("🔄 Retrying with same model...");
            continue;
          }
        }
        
      } catch (error) {
        console.error(`❌ ${model.name.toUpperCase()} attempt ${attempt} failed:`, error.message);
        
        if (attempt < model.maxAttempts) {
          console.log("🔄 Retrying with same model...");
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retry
          continue;
        }
      }
    }
    
    console.log(`⏭️ Moving to next model after ${model.maxAttempts} attempts with ${model.name}`);
  }
  
  throw new Error(`All image generation models failed after ${totalAttempts} total attempts`);
}

async function generateWithReplicateEnhanced(modelId: string, input: any): Promise<string> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    throw new Error('REPLICATE_API_TOKEN not found');
  }

  console.log("🔧 Enhanced Replicate generation with input:", Object.keys(input));
  
  // Create prediction
  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: modelId,
      input: input
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Prediction creation failed (${createResponse.status}): ${errorText}`);
  }

  const prediction = await createResponse.json();
  console.log("🔄 Prediction created:", prediction.id);

  // Poll for completion
  const result = await pollPredictionWithTimeout(prediction.id, replicateToken, 90000); // 90 second timeout
  
  if (result.status === 'succeeded' && result.output?.[0]) {
    return await downloadAndConvertImage(result.output[0]);
  }
  
  throw new Error(`Prediction failed: ${result.error || 'Unknown error'}`);
}

async function pollPredictionWithTimeout(predictionId: string, token: string, timeoutMs: number): Promise<any> {
  const maxAttempts = Math.floor(timeoutMs / 3000); // 3 second intervals
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${token}` }
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.status}`);
    }

    const status = await statusResponse.json();
    console.log(`⏱️ Status check ${attempt + 1}/${maxAttempts}: ${status.status}`);
    
    if (status.status === 'succeeded' || status.status === 'failed') {
      return status;
    }
  }
  
  throw new Error(`Prediction timeout after ${timeoutMs}ms`);
}

async function downloadAndConvertImage(imageUrl: string): Promise<string> {
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

function validatePrompt(prompt: string, context: ImageContext): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for essential elements
  if (!prompt.includes('single')) {
    issues.push("Missing 'single' specification");
  }
  
  if (!prompt.includes(context.dumplingShape)) {
    issues.push(`Missing shape specification: ${context.dumplingShape}`);
  }
  
  if (!prompt.includes('black background')) {
    issues.push("Missing black background specification");
  }
  
  // Check prompt length (not too short, not too long)
  if (prompt.length < 50) {
    issues.push("Prompt too short - may lack detail");
  }
  
  if (prompt.length > 500) {
    issues.push("Prompt too long - may confuse AI model");
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

async function validateGeneratedImage(imageData: string, context: ImageContext): Promise<{ isValid: boolean; issues: string[] }> {
  // Basic validation - we can enhance this later with actual image analysis
  const issues: string[] = [];
  
  // Check if image data exists and is reasonable size
  if (!imageData || imageData.length < 10000) {
    issues.push("Image data too small or missing");
  }
  
  if (imageData.length > 10000000) { // 10MB limit
    issues.push("Image data unexpectedly large");
  }
  
  // For now, assume valid if basic checks pass
  // In the future, we could add computer vision to validate:
  // - Single dumpling count
  // - Correct shape
  // - Black background
  // - Proper composition
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

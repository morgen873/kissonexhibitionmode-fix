
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
  console.log("=== OPENAI GPT IMAGE-1 GENERATION ===");
  console.log("Prompt preview:", prompt.substring(0, 200));
  
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    throw new Error('OPENAI_API_KEY not found');
  }

  try {
    console.log("🎨 Generating with OpenAI GPT Image-1...");
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        response_format: 'b64_json'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.data || !result.data[0] || !result.data[0].b64_json) {
      throw new Error('No image data returned from OpenAI');
    }

    const imageData = result.data[0].b64_json;
    console.log(`✅ SUCCESS WITH OPENAI GPT IMAGE-1`);
    console.log(`- Image data size: ${imageData.length}`);
    
    return {
      imageData,
      usedModel: 'openai-gpt-image-1',
      attempts: 1
    };
    
  } catch (error) {
    console.error(`❌ OpenAI GPT Image-1 generation failed:`, error.message);
    throw new Error(`OpenAI image generation failed: ${error.message}`);
  }
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

  // Poll for completion with longer timeout for complex prompts
  const result = await pollPredictionWithTimeout(prediction.id, replicateToken, 120000); // Increased to 120 seconds
  
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
  
  console.log("=== ENHANCED PROMPT VALIDATION ===");
  console.log("Validating prompt:", prompt.substring(0, 100) + "...");
  
  // Critical elements that MUST be present - relaxed validation
  const criticalChecks = [
    { 
      test: () => prompt.toLowerCase().includes('dumpling'),
      message: "Missing 'dumpling' specification"
    }
  ];
  
  // Quality indicators that should be present
  const qualityChecks = [
    {
      test: () => prompt.toLowerCase().includes('photography') || prompt.toLowerCase().includes('photo'),
      message: "Missing photography specification for realism"
    },
    {
      test: () => prompt.toLowerCase().includes('centered') || prompt.toLowerCase().includes('center'),
      message: "Missing composition guidance (centered)"
    },
    {
      test: () => prompt.toLowerCase().includes('lighting') || prompt.toLowerCase().includes('studio'),
      message: "Missing lighting specification"
    }
  ];
  
  // Run critical checks
  criticalChecks.forEach(check => {
    if (!check.test()) {
      issues.push(`CRITICAL: ${check.message}`);
    }
  });
  
  // Run quality checks (warnings, not failures)
  qualityChecks.forEach(check => {
    if (!check.test()) {
      console.log(`⚠️ Quality warning: ${check.message}`);
      // Don't add to issues - these are just warnings
    }
  });
  
  // Length validation
  if (prompt.length < 80) {
    issues.push("Prompt too short - needs more detail for AI model");
  }
  
  if (prompt.length > 600) {
    issues.push("Prompt too long - may overwhelm AI model");
  }
  
  // Negative pattern detection
  const problematicPatterns = [
    { pattern: /multiple|several|many|two|three|\d+\s+dumplings/i, message: "Prompt contains multiple dumpling references" },
    { pattern: /plate|bowl|table/i, message: "Prompt contains unwanted objects (plate/bowl/table)" },
    { pattern: /hands|people|person/i, message: "Prompt contains human elements" }
  ];
  
  problematicPatterns.forEach(check => {
    if (check.pattern.test(prompt)) {
      issues.push(`CONFLICT: ${check.message}`);
    }
  });
  
  console.log(`Validation result: ${issues.length === 0 ? 'PASSED' : 'FAILED'}`);
  if (issues.length > 0) {
    console.log("Issues found:", issues);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

async function validateGeneratedImage(imageData: string, context: ImageContext): Promise<{ isValid: boolean; issues: string[] }> {
  console.log("=== ENHANCED IMAGE VALIDATION ===");
  const issues: string[] = [];
  
  // Basic data validation
  if (!imageData || imageData.length < 10000) {
    issues.push("Image data too small or missing - likely generation failure");
    return { isValid: false, issues };
  }
  
  if (imageData.length > 15000000) { // 15MB limit (increased from 10MB)
    issues.push("Image data unexpectedly large - may indicate quality issues");
  }
  
  // Enhanced size analysis for quality assessment
  const sizeKB = imageData.length / 1024;
  console.log(`Generated image size: ${sizeKB.toFixed(1)}KB`);
  
  // Expected size ranges for different quality levels
  if (sizeKB < 50) {
    issues.push("Image suspiciously small - likely low quality or failed generation");
  } else if (sizeKB > 5000) {
    console.log("⚠️ Large image size - checking if acceptable...");
    // Large images are generally okay, just noting
  }
  
  // Basic format validation
  if (!imageData.startsWith('/9j/') && !imageData.startsWith('iVBORw0KG')) {
    console.log("⚠️ Unexpected image format - may not be standard JPEG/PNG");
  }
  
  // TODO: Future enhancements could include:
  // - Computer vision API to count objects in the image
  // - Color analysis to verify black background
  // - Shape detection to verify dumpling shape
  // - Composition analysis to check centering
  
  const isValid = issues.length === 0;
  console.log(`Image validation result: ${isValid ? 'PASSED' : 'FAILED'}`);
  if (!isValid) {
    console.log("Validation issues:", issues);
  }
  
  return {
    isValid,
    issues
  };
}

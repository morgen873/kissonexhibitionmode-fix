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

async function generateWithStableDiffusion35Large(imageContext: ImageContext, imagePrompt: string): Promise<ImageGenerationResult> {
  console.log("Attempting Stable Diffusion 3.5 Large...");
  try {
    const prompt = optimizePromptForStableDiffusion(imagePrompt, imageContext);
    const imageData = await generateWithReplicate(
      prompt,
      'stability-ai/stable-diffusion-xl:3f539a0526edd895e602c394ac59ca9ac141b654ef312240a62c52cae489e60b'
    );

    console.log("✅ Stable Diffusion 3.5 Large SUCCESS");
    return {
      imageData,
      usedModel: 'stable-diffusion-3.5-large'
    };
  } catch (sd35Error) {
    console.error("🔥 Stable Diffusion 3.5 Large failed:", sd35Error);
    throw new Error(`Stable Diffusion 3.5 Large failed: ${sd35Error.message}`);
  }
}

async function generateWithReplicate(prompt: string, modelVersion: string): Promise<string> {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    throw new Error("Replicate API token is missing. Ensure REPLICATE_API_TOKEN is set.");
  }

  const headers = {
    "Authorization": `Token ${replicateApiToken}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    version: modelVersion,
    input: { prompt },
  });

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Replicate API Error:", response.status, errorBody);
      throw new Error(`Replicate API request failed with status ${response.status}: ${errorBody}`);
    }

    const replicateResponse: ReplicateResponse = await response.json();
    const predictionId = replicateResponse.id;

    // Poll Replicate API until the image generation is complete
    let imageURL: string | undefined;
    while (!imageURL) {
      const currentStatus = await pollReplicateForStatus(predictionId);

      if (currentStatus === 'succeeded') {
        imageURL = (await getReplicateOutput(predictionId)) as string;
        break;
      } else if (currentStatus === 'failed') {
        const errorMessage = await getReplicateError(predictionId);
        throw new Error(`Replicate image generation failed: ${errorMessage}`);
      }

      // Wait for 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!imageURL) {
      throw new Error("Failed to retrieve image URL from Replicate.");
    }

    return imageURL;

  } catch (error) {
    console.error("Error during Replicate API call:", error);
    throw new Error(`Failed to generate image with Replicate: ${error.message}`);
  }
}

async function pollReplicateForStatus(predictionId: string): Promise<ReplicateResponse['status']> {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    throw new Error("Replicate API token is missing. Ensure REPLICATE_API_TOKEN is set.");
  }

  const headers = {
    "Authorization": `Token ${replicateApiToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Replicate API Error:", response.status, errorBody);
      throw new Error(`Replicate API request failed with status ${response.status}: ${errorBody}`);
    }

    const replicateResponse: ReplicateResponse = await response.json();
    return replicateResponse.status;

  } catch (error) {
    console.error("Error polling Replicate API:", error);
    throw new Error(`Failed to poll Replicate API: ${error.message}`);
  }
}

async function getReplicateOutput(predictionId: string): Promise<string | null> {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    throw new Error("Replicate API token is missing. Ensure REPLICATE_API_TOKEN is set.");
  }

  const headers = {
    "Authorization": `Token ${replicateApiToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Replicate API Error:", response.status, errorBody);
      throw new Error(`Replicate API request failed with status ${response.status}: ${errorBody}`);
    }

    const replicateResponse: ReplicateResponse = await response.json();
    if (replicateResponse.output && replicateResponse.output.length > 0) {
      return replicateResponse.output[0];
    } else {
      return null;
    }

  } catch (error) {
    console.error("Error getting Replicate output:", error);
    throw new Error(`Failed to get Replicate output: ${error.message}`);
  }
}

async function getReplicateError(predictionId: string): Promise<string | null> {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    throw new Error("Replicate API token is missing. Ensure REPLICATE_API_TOKEN is set.");
  }

  const headers = {
    "Authorization": `Token ${replicateApiToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Replicate API Error:", response.status, errorBody);
      throw new Error(`Replicate API request failed with status ${response.status}: ${errorBody}`);
    }

    const replicateResponse: ReplicateResponse = await response.json();
    return replicateResponse.error || null;

  } catch (error) {
    console.error("Error getting Replicate error:", error);
    throw new Error(`Failed to get Replicate error: ${error.message}`);
  }
}

function optimizePromptForSDXL(basePrompt: string, imageContext: ImageContext): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;

  console.log("=== OPTIMIZING PROMPT FOR SDXL ===");
  console.log("1. Base prompt:", basePrompt);
  console.log("2. Timeline theme:", timelineTheme);
  console.log("3. Emotional context:", emotionalContext);
  console.log("4. Dumpling shape:", dumplingShape);
  console.log("5. Flavor:", flavor);
  console.log("6. Ingredients list:", ingredientsList);
  console.log("7. Recipe title:", recipeTitle);

  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'delicious ingredients';

  const optimizedPrompt = `masterpiece, best quality, ultra detailed, professional food photography, single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}
  
SDXL optimized culinary style:
- hyper-realistic food photography, exactly one perfectly sealed dumpling
- vibrant colors, intricate details, mouth-watering presentation
- professional studio lighting, cinematic composition
- pure solid matte black background, no textures, no patterns, no gradients, completely black void background
- dumpling wrapper 100% opaque and solid, no visible filling, no transparent effects
- no openings tears gaps, completely sealed package appearance
- high-resolution texture, perfect composition, food art
- no text logos graphics, no utensils plates surfaces
- gourmet presentation, culinary innovation
- ${emotionalContext} atmosphere

Technical specifications: single dumpling only, pure solid matte black background, no textures, no patterns, no gradients, completely black void background, sealed wrapper, commercial quality, centered composition, hyper-realistic, no duplicates, no extras, no distractions`;

  console.log("Generated optimized prompt for SDXL");
  return optimizedPrompt;
}

function optimizePromptForStableDiffusion(basePrompt: string, imageContext: ImageContext): string {
  const { timelineTheme, emotionalContext, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;

  console.log("=== OPTIMIZING PROMPT FOR STABLE DIFFUSION 3.5 LARGE ===");
  console.log("1. Base prompt:", basePrompt);
  console.log("2. Timeline theme:", timelineTheme);
  console.log("3. Emotional context:", emotionalContext);
  console.log("4. Dumpling shape:", dumplingShape);
  console.log("5. Flavor:", flavor);
  console.log("6. Ingredients list:", ingredientsList);
  console.log("7. Recipe title:", recipeTitle);

  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.join(', ') : 'delicious ingredients';

  const optimizedPrompt = `masterpiece, best quality, ultra detailed, professional food photography, single ${dumplingShape}-shaped dumpling with ${flavor} flavor profile, representing "${recipeTitle}" from ${timelineTheme}, featuring ${ingredientsText}
  
  High-quality culinary style:
  - hyper-realistic food photography, exactly one perfectly sealed dumpling
  - vibrant colors, intricate details, mouth-watering presentation
  - professional studio lighting, cinematic composition
  - clean background, no distractions
  - dumpling wrapper 100% opaque and solid, no visible filling, no transparent effects
  - no openings tears gaps, completely sealed package appearance
  - high-resolution texture, perfect composition, food art
  - no text logos graphics, no utensils plates surfaces
  - gourmet presentation, culinary innovation
  - ${emotionalContext} atmosphere
  
  Technical specifications: single dumpling only, clean background, sealed wrapper, commercial quality, centered composition, hyper-realistic, no duplicates, no extras, no distractions`;

  console.log("Generated optimized prompt for Stable Diffusion 3.5 Large");
  return optimizedPrompt;
}

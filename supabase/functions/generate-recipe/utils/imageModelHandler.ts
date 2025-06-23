
import OpenAI from 'https://esm.sh/openai@4.24.1'

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
  usedModel: 'gpt-image-1' | 'dall-e-3';
}

export async function generateImageWithFallback(
  imagePrompt: string,
  imageContext: ImageContext,
  openai: OpenAI
): Promise<ImageGenerationResult> {
  console.log("📥 ATTEMPTING GPT-IMAGE-1 GENERATION...");
  
  // Step 1: Try GPT-IMAGE-1 first
  try {
    const gptImageConfig = {
      model: 'gpt-image-1' as const,
      prompt: imagePrompt,
      size: '1024x1024' as const,
      quality: 'high' as const,
      output_format: 'png' as const,
      background: 'opaque' as const,
      moderation: 'auto' as const
    };
    
    console.log("🎨 GPT-IMAGE-1 CONFIG:");
    console.log("- Model:", gptImageConfig.model);
    console.log("- Quality:", gptImageConfig.quality);  
    console.log("- Size:", gptImageConfig.size);
    
    const imageResponse = await openai.images.generate(gptImageConfig);
    console.log("✅ GPT-IMAGE-1 SUCCESS");
    
    if (!imageResponse.data?.[0]?.b64_json) {
      throw new Error("No base64 image data in GPT-IMAGE-1 response");
    }
    
    return {
      imageData: imageResponse.data[0].b64_json,
      usedModel: 'gpt-image-1'
    };
    
  } catch (gptError) {
    console.log("⚠️ GPT-IMAGE-1 FAILED, TRYING DALL-E 3 FALLBACK...");
    console.log("GPT-IMAGE-1 Error:", gptError.message);
    
    // Check if it's an organization verification error
    if (gptError.message && gptError.message.includes('organization must be verified')) {
      console.log("🔄 ORGANIZATION NOT YET VERIFIED - USING DALL-E 3 FALLBACK");
    }
    
    // Step 2: Fallback to DALL-E 3
    return await generateWithDallE3(imageContext, openai);
  }
}

async function generateWithDallE3(
  imageContext: ImageContext,
  openai: OpenAI
): Promise<ImageGenerationResult> {
  const dallePrompt = createDallePrompt(imageContext);
  console.log("🎨 DALL-E 3 FALLBACK PROMPT:");
  console.log("- Length:", dallePrompt.length);
  console.log("- Content:", dallePrompt);
  
  const dalleConfig = {
    model: 'dall-e-3' as const,
    prompt: dallePrompt,
    size: '1024x1024' as const,
    quality: 'hd' as const,
    style: 'vivid' as const,
    n: 1
  };
  
  const imageResponse = await openai.images.generate(dalleConfig);
  console.log("✅ DALL-E 3 FALLBACK SUCCESS");
  
  if (!imageResponse.data?.[0]?.url) {
    throw new Error("No URL in DALL-E 3 response");
  }
  
  // Convert URL to base64
  console.log("📥 FETCHING DALL-E 3 IMAGE FROM URL...");
  const fetchResponse = await fetch(imageResponse.data[0].url);
  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch DALL-E 3 image");
  }
  
  const arrayBuffer = await fetchResponse.arrayBuffer();
  const imageData = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  
  return {
    imageData,
    usedModel: 'dall-e-3'
  };
}

function createDallePrompt(imageContext: ImageContext): string {
  const { timelineTheme, dumplingShape, flavor, ingredientsList, recipeTitle } = imageContext;
  
  // Create a DALL-E 3 optimized prompt (under 4000 characters)
  const ingredientsText = ingredientsList.length > 0 ? ingredientsList.slice(0, 5).join(', ') : 'traditional ingredients';
  
  const prompt = `Professional food photography of ${dumplingShape}-shaped dumplings with ${flavor} flavor, ${timelineTheme.toLowerCase()} style. Ingredients: ${ingredientsText}. Studio lighting, black background, hyper-realistic, appetizing presentation, shallow depth of field, commercial photography quality.`;
  
  console.log("🔄 DALL-E 3 PROMPT CREATED:");
  console.log("- Length:", prompt.length);
  console.log("- Content:", prompt);
  
  return prompt;
}

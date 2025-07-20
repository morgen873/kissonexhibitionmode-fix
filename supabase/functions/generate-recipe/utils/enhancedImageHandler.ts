interface ImageContext {
  timelineTheme: string;
  emotionalContext: string;
  dumplingShape: string;
  flavor: string;
  ingredientsList: string[];
  recipeTitle: string;
}

export async function generateImageWithEnhancedFallback(
  prompt: string,
  imageContext: ImageContext,
  recipeId: string
): Promise<string | null> {
  console.log("=== 🎨 ENHANCED IMAGE GENERATION WITH FALLBACK ===");
  console.log("Primary prompt length:", prompt.length);
  console.log("Recipe ID:", recipeId);
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.log("❌ No OpenAI API key found");
    return null;
  }
  
  try {
    console.log("🎯 ATTEMPTING PRIMARY GENERATION WITH OPENAI...");
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ OpenAI API error:", response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log("✅ OpenAI response received");
    
    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.log("❌ No image data in OpenAI response");
      return null;
    }
    
    console.log("✅ Image generated successfully with OpenAI");
    return data.data[0].b64_json;
    
  } catch (error) {
    console.log("❌ Error in enhanced image generation:", error);
    return null;
  }
}
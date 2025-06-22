
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateImagePrompt, extractIngredientsList } from './imagePromptGenerator.ts'
import { uploadImageToSupabase } from './imageUploader.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export async function generateAndUploadRecipeImage(
  payload: RecipePayload,
  recipeContent: any,
  recipeId: string,
  openai: OpenAI,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string> {
  try {
    console.log("=== FIXED DATA FLOW FOR IMAGE GENERATION ===");
    console.log("Step 1: Received payload from frontend:", JSON.stringify(payload, null, 2));
    console.log("Step 2: Received recipe content from AI:", JSON.stringify(recipeContent, null, 2));
    
    // STEP 3: Extract timeline theme FIRST (this is the most important data)
    console.log("=== STEP 3: TIMELINE EXTRACTION (PRIMARY DATA) ===");
    const timelineValues = Object.values(payload.timeline);
    const timelineTheme = timelineValues.length > 0 ? timelineValues[0] : 'present day';
    console.log("✓ Timeline theme extracted:", `"${timelineTheme}"`);
    
    // STEP 4: Extract emotional context from questions (secondary data)
    console.log("=== STEP 4: EMOTIONAL CONTEXT EXTRACTION (SECONDARY DATA) ===");
    const questionValues = Object.values(payload.questions);
    const emotionalContext = questionValues.length > 0 ? questionValues.join(', ') : 'comfort and warmth';
    console.log("✓ Emotional context extracted:", `"${emotionalContext}"`);
    
    // STEP 5: Extract control values (tertiary data)
    console.log("=== STEP 5: CONTROLS EXTRACTION (TERTIARY DATA) ===");
    const controlValues = Object.values(payload.controls);
    const controls = controlValues.length > 0 ? controlValues[0] : {
      shape: 'classic',
      flavor: 'mild',
      temperature: 180,
      enhancer: ''
    };
    console.log("✓ Controls extracted:", controls);
    
    // STEP 6: Extract ingredients from AI-generated recipe (supporting data)
    console.log("=== STEP 6: INGREDIENTS EXTRACTION (SUPPORTING DATA) ===");
    const ingredientsList = extractIngredientsList(recipeContent.ingredients);
    console.log("✓ Ingredients extracted from recipe:", ingredientsList);
    
    // STEP 7: Validate all critical data is present
    console.log("=== STEP 7: DATA VALIDATION ===");
    const hasTimeline = timelineTheme && timelineTheme.trim() !== '' && timelineTheme !== 'present day';
    const hasEmotionalContext = emotionalContext && emotionalContext.trim() !== '';
    const hasIngredients = ingredientsList.length > 0;
    const hasControls = controls.shape && controls.flavor;
    
    console.log("Timeline data quality:", hasTimeline ? "✅ GOOD" : "❌ MISSING/DEFAULT");
    console.log("Emotional context quality:", hasEmotionalContext ? "✅ GOOD" : "❌ MISSING");
    console.log("Ingredients data quality:", hasIngredients ? "✅ GOOD" : "❌ MISSING");
    console.log("Controls data quality:", hasControls ? "✅ GOOD" : "❌ MISSING");
    
    if (!hasTimeline) {
      console.error("❌ CRITICAL: Timeline theme is missing or default - this will cause generic images!");
      console.error("Available timeline data:", payload.timeline);
    }
    
    // STEP 8: Generate image prompt with all validated data in correct order
    console.log("=== STEP 8: GENERATING IMAGE PROMPT WITH VALIDATED DATA ===");
    const imagePrompt = generateImagePrompt({
      timelineTheme: timelineTheme,
      emotionalContext: emotionalContext,
      dumplingShape: controls.shape,
      flavor: controls.flavor,
      ingredientsList: ingredientsList,
      recipeTitle: recipeContent.title
    });
    
    console.log("=== FINAL GENERATED PROMPT ===");
    console.log(imagePrompt);
    console.log("=============================");
    
    // STEP 9: Send to DALL-E with enhanced parameters
    console.log("=== STEP 9: SENDING TO DALL-E ===");
    console.log("Prompt length:", imagePrompt.length);
    console.log("Timeline theme being used:", `"${timelineTheme}"`);
    console.log("Key ingredients for visual:", ingredientsList.slice(0, 3));
    
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style: 'natural',
      quality: 'hd',
    });
    
    console.log("✅ DALL-E image generated successfully");
    const imageB64 = imageResponse.data[0].b64_json;
    
    // STEP 10: Upload to Supabase
    if (imageB64) {
      console.log("=== STEP 10: UPLOADING TO SUPABASE ===");
      const imageUrl = await uploadImageToSupabase(imageB64, recipeId, supabaseAdmin);
      if (imageUrl) {
        console.log("✅ Image uploaded successfully:", imageUrl);
        return imageUrl;
      }
    }
    
    console.log("❌ Failed to generate/upload image, using placeholder");
    return '/placeholder.svg';
  } catch (error) {
    console.error("❌ Error in fixed image generation flow:", error);
    return '/placeholder.svg';
  }
}

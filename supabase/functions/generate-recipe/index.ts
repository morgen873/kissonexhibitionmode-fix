
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'  // Still needed for recipe generation
import { generateRecipeWithOpenAI } from './utils/recipeGenerator.ts'
// import { generateSimpleImage } from './utils/simpleImageGenerator.ts'
import { insertRecipe, updateRecipeImageUrl } from './utils/databaseOperations.ts'
import { checkRateLimit } from './utils/rateLimiter.ts'
import { validateRecipeContent } from './utils/contentValidator.ts'

// This is to make Deno's type checker happy
// It's a surreal bug, see: https://github.com/denoland/deno/issues/17211
// @deno-types="npm:@types/node"
import { ReadableStream } from "node:stream/web";
// @ts-ignore
globalThis.ReadableStream = ReadableStream;

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

serve(async (req) => {
  console.log("🚀 EDGE FUNCTION CALLED! Method:", req.method);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    const payload: RecipePayload = await req.json()
    
    console.log("=== NEW STRUCTURED RECIPE GENERATION FLOW ===");
    console.log("STEP 1: Frontend payload received and parsed");
    console.log("Raw payload structure:", {
      hasQuestions: !!payload.questions,
      hasTimeline: !!payload.timeline,
      hasControls: !!payload.controls,
      questionKeys: Object.keys(payload.questions || {}),
      timelineKeys: Object.keys(payload.timeline || {}),
      controlKeys: Object.keys(payload.controls || {})
    });
    
    // Validate that we have the required data
    const hasQuestions = payload.questions && Object.keys(payload.questions).length > 0;
    const hasTimeline = payload.timeline && Object.keys(payload.timeline).length > 0;
    const hasControls = payload.controls && Object.keys(payload.controls).length > 0;
    
    console.log("STEP 2: Data validation results:");
    console.log("- Has questions:", hasQuestions ? "✅" : "❌");
    console.log("- Has timeline:", hasTimeline ? "✅" : "❌");
    console.log("- Has controls:", hasControls ? "✅" : "❌");
    
    if (!hasQuestions || !hasTimeline || !hasControls) {
      console.error("❌ CRITICAL: Missing required data in payload!");
      console.error("Questions data:", payload.questions);
      console.error("Timeline data:", payload.timeline);
      console.error("Controls data:", payload.controls);
      return new Response(JSON.stringify({ 
        error: 'Missing required data. Please complete all steps.',
        missing: {
          questions: !hasQuestions,
          timeline: !hasTimeline,
          controls: !hasControls
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIKey) {
        throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    const openai = new OpenAI({ apiKey: openAIKey });
    
    // Note: Image generation now uses OpenAI API only
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables.");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting for exhibition safety
    const rateLimitResult = await checkRateLimit(supabaseAdmin, clientIP);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please wait a moment before creating another recipe.',
        remainingRequests: rateLimitResult.remainingRequests,
        resetTime: rateLimitResult.resetTime
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    // STEP 3: Generate recipe content
    console.log("STEP 3: Generating recipe content with AI...");
    const recipeContent = await generateRecipeWithOpenAI(payload, openai);
    console.log("✅ Recipe content generated:", recipeContent.title);

    // Validate content for exhibition appropriateness
    const validation = validateRecipeContent(recipeContent);
    if (!validation.isValid) {
      console.log('❌ Content validation failed:', validation.reason);
      return new Response(JSON.stringify({ 
        error: 'Recipe content not suitable for exhibition. Please try again with different inputs.',
        reason: validation.reason
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // STEP 4: Insert COMPLETE recipe into database FIRST
    console.log("STEP 4: Inserting COMPLETE recipe into database...");
    const newRecipe = await insertRecipe(supabaseAdmin, payload, recipeContent);
    console.log("✅ Recipe FULLY saved to database with ID:", newRecipe.id);

    // STEP 5: Now generate image with BOTH original user data AND saved recipe data
    console.log("STEP 5: Starting image generation with COMPLETE data from database...");
    console.log("Image generation will use:");
    console.log("- Original user payload (questions, timeline, controls)");
    console.log("- SAVED recipe data from database (title, ingredients)");
    console.log("- Recipe ID:", newRecipe.id);
    
    console.log("🎨 Skipping image generation for now - testing function");
    let imageUrl = '/placeholder.svg';
    console.log("🎨 Image generation result:", imageUrl);

    // STEP 6: Update recipe with final image URL only if we got a real image
    if (imageUrl !== '/placeholder.svg') {
      await updateRecipeImageUrl(supabaseAdmin, newRecipe.id, imageUrl);
      newRecipe.image_url = imageUrl;
      console.log("✅ Recipe updated with final image URL:", imageUrl);
    } else {
      console.log("❌ Using placeholder image - no update needed");
    }

    console.log("=== STRUCTURED RECIPE GENERATION COMPLETED ===");
    console.log("Final recipe data being returned:");
    console.log("- Title:", newRecipe.title);
    console.log("- Image URL:", newRecipe.image_url);
    console.log("- Recipe ID:", newRecipe.id);
    console.log("- Has ingredients data:", !!newRecipe.ingredients);
    
    return new Response(JSON.stringify({ recipe: newRecipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('❌ Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

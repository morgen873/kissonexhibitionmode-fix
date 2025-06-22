
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateRecipeWithOpenAI } from './utils/recipeGenerator.ts'
import { generateAndUploadRecipeImage } from './utils/imageGenerator.ts'
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    const payload: RecipePayload = await req.json()
    
    console.log("=== RECIPE GENERATION STARTED ===");
    console.log("Received payload:", JSON.stringify(payload, null, 2));
    
    // Validate that we have the required data
    const hasQuestions = payload.questions && Object.keys(payload.questions).length > 0;
    const hasTimeline = payload.timeline && Object.keys(payload.timeline).length > 0;
    const hasControls = payload.controls && Object.keys(payload.controls).length > 0;
    
    console.log("Data validation:");
    console.log("- Has questions:", hasQuestions);
    console.log("- Has timeline:", hasTimeline);
    console.log("- Has controls:", hasControls);
    
    if (!hasQuestions || !hasTimeline || !hasControls) {
      console.error("Missing required data in payload!");
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

    // Generate recipe content
    console.log("Generating recipe content...");
    const recipeContent = await generateRecipeWithOpenAI(payload, openai);
    console.log("Recipe content generated:", recipeContent.title);

    // Validate content for exhibition appropriateness
    const validation = validateRecipeContent(recipeContent);
    if (!validation.isValid) {
      console.log('Content validation failed:', validation.reason);
      return new Response(JSON.stringify({ 
        error: 'Recipe content not suitable for exhibition. Please try again with different inputs.',
        reason: validation.reason
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Insert recipe first to get an ID, starting with a placeholder image
    console.log("Inserting recipe into database...");
    const newRecipe = await insertRecipe(supabaseAdmin, payload, recipeContent);
    console.log("Recipe inserted with ID:", newRecipe.id);

    // Generate and upload image with all the user data
    console.log("Starting image generation with user data...");
    const imageUrl = await generateAndUploadRecipeImage(
      payload,
      recipeContent,
      newRecipe.id,
      openai,
      supabaseAdmin
    );

    // Update recipe with final image URL
    if (imageUrl !== '/placeholder.svg') {
      await updateRecipeImageUrl(supabaseAdmin, newRecipe.id, imageUrl);
      newRecipe.image_url = imageUrl;
      console.log("Recipe updated with image URL:", imageUrl);
    } else {
      console.log("Using placeholder image");
    }

    console.log("=== RECIPE GENERATION COMPLETED ===");
    console.log("Returning recipe with image_url:", newRecipe.image_url);
    
    return new Response(JSON.stringify({ recipe: newRecipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

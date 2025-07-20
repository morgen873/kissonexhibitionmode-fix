import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'  // Still needed for recipe generation
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
  controls: { [key: string]: any };
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
    
    console.log("=== NEW STRUCTURED RECIPE GENERATION FLOW ===");
    console.log("STEP 1: Frontend payload received and parsed");
    console.log("Raw payload structure:", {
      hasQuestions: !!payload.questions,
      hasTimeline: !!payload.timeline,
      hasControls: !!payload.controls,
      questionsCount: Object.keys(payload.questions || {}).length,
      timelineCount: Object.keys(payload.timeline || {}).length,
      controlsCount: Object.keys(payload.controls || {}).length
    });

    // Quick validation
    if (!payload.questions || !payload.timeline || !payload.controls) {
      console.log("❌ Missing required payload data");
      return new Response(JSON.stringify({ error: "Missing required data: questions, timeline, or controls" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("STEP 2: Setting up environment and clients...");
    
    // Environment setup
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!
    
    if (!openAIApiKey) {
        throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    // Note: Image generation now uses OpenAI API only
    
    // Initialize clients
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
    const openAI = new OpenAI({ apiKey: openAIApiKey });
    
    console.log("✅ Environment and clients initialized");

    // STEP 3: Rate limiting
    console.log("STEP 3: Checking rate limits...");
    const rateLimitCheck = await checkRateLimit(supabaseAdmin, clientIP);
    if (!rateLimitCheck.allowed) {
      console.log("❌ Rate limit exceeded for IP:", clientIP);
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      })
    }
    console.log("✅ Rate limit check passed");

    // STEP 4: Generate recipe content
    console.log("STEP 3: Generating recipe content with OpenAI...");
    const generatedRecipe = await generateRecipeWithOpenAI(openAI, payload);
    
    console.log("✅ Recipe generated successfully:");
    console.log("- Title:", generatedRecipe.title);
    console.log("- Description length:", generatedRecipe.description?.length || 0);
    console.log("- Has ingredients:", !!generatedRecipe.ingredients);
    console.log("- Has cooking recipe:", !!generatedRecipe.cooking_recipe);
    console.log("- Recipe length:", generatedRecipe.cooking_recipe?.length || 0);

    // STEP 4: Content validation
    console.log("🔍 VALIDATING RECIPE CONTENT FOR EXHIBITION SAFETY");
    const validation = validateRecipeContent(generatedRecipe);
    if (!validation.isValid) {
      console.log("❌ Content validation failed:", validation.issues);
      return new Response(JSON.stringify({ error: "Generated content failed safety validation" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    console.log("Exhibition-appropriate recipe generated successfully:", generatedRecipe.title);
    console.log("✅ Content validation passed - recipe is suitable for exhibition");

    // STEP 4: Insert recipe into database
    console.log("STEP 4: Inserting COMPLETE recipe into database...");
    console.log("=== INSERTING COMPLETE RECIPE INTO DATABASE ===");
    console.log("Recipe content being saved:");
    console.log("- Title:", generatedRecipe.title);
    console.log("- Has description:", !!generatedRecipe.description);
    console.log("- Description length:", generatedRecipe.description?.length || 0);
    console.log("- Has ingredients:", !!generatedRecipe.ingredients);
    console.log("- Has cooking recipe:", !!generatedRecipe.cooking_recipe);
    console.log("- Recipe length:", generatedRecipe.cooking_recipe?.length || 0);
    
    const newRecipe = await insertRecipe(supabaseAdmin, generatedRecipe, payload);
    console.log("✅ Recipe COMPLETELY saved to database:");
    console.log("✅ Recipe FULLY saved to database with ID:", newRecipe.id);
    console.log("- Full recipe data available for image generation");
    console.log("- Title:", newRecipe.title);
    console.log("- Ingredients saved:", !!newRecipe.ingredients);

    // STEP 5: Generate and upload image
    console.log("STEP 5: Starting image generation with COMPLETE data from database...");
    console.log("Image generation will use:");
    console.log("- Recipe ID:", newRecipe.id);
    console.log("- Title:", newRecipe.title);
    console.log("- SAVED recipe data from database (title, ingredients)");
    console.log("- Original user payload (questions, timeline, controls)");
    console.log("- Recipe ID:", newRecipe.id);
    
    const imageUrl = await generateAndUploadRecipeImage(
      payload,      // Original user input
      newRecipe,    // COMPLETE saved recipe data from database
      newRecipe.id,
      supabaseAdmin
    );

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
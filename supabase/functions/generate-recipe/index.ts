import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateRecipeWithOpenAI } from './utils/recipeGenerator.ts'
import { insertRecipe, updateRecipeImageUrl } from './utils/databaseOperations.ts'
import { checkRateLimit } from './utils/rateLimiter.ts'
import { validateRecipeContent } from './utils/contentValidator.ts'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: string]: any };
}

serve(async (req) => {
  console.log("🚀 FUNCTION START - Method:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("🚀 PARSING REQUEST...");
    const payload: RecipePayload = await req.json()
    console.log("✅ Payload received");

    // Quick validation
    if (!payload.questions || !payload.timeline || !payload.controls) {
      console.log("❌ Missing required payload data");
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log("🚀 INITIALIZING SUPABASE...");
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
    console.log("✅ Supabase initialized");

    console.log("🚀 CHECKING RATE LIMIT...");
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = await checkRateLimit(supabaseAdmin, clientIP);
    if (!rateLimitCheck.allowed) {
      console.log("❌ Rate limit exceeded");
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      })
    }
    console.log("✅ Rate limit check passed");

    console.log("🚀 GENERATING RECIPE...");
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    const openAI = new OpenAI({ apiKey: openAIApiKey });
    const generatedRecipe = await generateRecipeWithOpenAI(openAI, payload);
    console.log("✅ Recipe generated:", generatedRecipe.title);

    console.log("🚀 VALIDATING CONTENT...");
    const validation = validateRecipeContent(generatedRecipe);
    if (!validation.isValid) {
      console.log("❌ Content validation failed");
      return new Response(JSON.stringify({ error: "Invalid content generated" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    console.log("✅ Content validation passed");

    console.log("🚀 SAVING TO DATABASE...");
    const newRecipe = await insertRecipe(supabaseAdmin, generatedRecipe, payload);
    console.log("✅ Recipe saved with ID:", newRecipe.id);

    console.log("🚀 SETTING PLACEHOLDER IMAGE...");
    newRecipe.image_url = '/placeholder.svg';
    console.log("✅ Image URL set to placeholder");

    console.log("🚀 RETURNING RESPONSE...");
    return new Response(JSON.stringify({ recipe: newRecipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
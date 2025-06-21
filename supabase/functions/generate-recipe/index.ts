
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateRecipeWithOpenAI } from './utils/recipeGenerator.ts'
import { generateAndUploadRecipeImage } from './utils/imageGenerator.ts'
import { insertRecipe, updateRecipeImageUrl } from './utils/databaseOperations.ts'

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
    const payload: RecipePayload = await req.json()
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

    // Generate recipe content
    const recipeContent = await generateRecipeWithOpenAI(payload, openai);

    // Insert recipe first to get an ID, starting with a placeholder image
    const newRecipe = await insertRecipe(supabaseAdmin, payload, recipeContent);

    // Generate and upload image
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
    }

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

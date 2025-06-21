
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'
import { generateRecipeWithOpenAI } from './utils/recipeGenerator.ts'
import { generateAndUploadRecipeImage } from './utils/imageGenerator.ts'

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
    const { data: newRecipe, error: insertError } = await supabaseAdmin
        .from('recipes')
        .insert({
            recipe_data: payload,
            title: recipeContent.title,
            description: recipeContent.description,
            ingredients: recipeContent.ingredients,
            cooking_recipe: recipeContent.cooking_recipe,
            image_url: '/placeholder.svg',
        })
        .select()
        .single();
    
    if (insertError) {
        console.error('Error inserting recipe:', insertError);
        throw insertError;
    }

    if (!newRecipe) {
        throw new Error("Failed to create and retrieve recipe.");
    }

    console.log("Recipe inserted with ID:", newRecipe.id);

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
      newRecipe.image_url = imageUrl;
      
      const { error: updateError } = await supabaseAdmin
        .from('recipes')
        .update({ image_url: imageUrl })
        .eq('id', newRecipe.id);

      if (updateError) {
        console.error('Error updating recipe with image URL:', updateError);
      } else {
        console.log("Recipe updated successfully with image URL");
      }
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

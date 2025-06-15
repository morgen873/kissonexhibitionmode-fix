
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'

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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables.");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

    const prompt = `
      You are a creative chef specializing in "Memory KissOn" dumplings. A user has provided the following inputs to create a unique recipe.
      Based on these inputs, generate a dumpling recipe.
      
      User Inputs:
      - Questions & Answers: ${JSON.stringify(payload.questions, null, 2)}
      - Timeline selection: ${JSON.stringify(payload.timeline, null, 2)}
      - Control settings: ${JSON.stringify(payload.controls, null, 2)}

      Generate the following information in a JSON format. Do not include any text outside of the JSON object.
      The JSON object should have these exact keys: "title", "description", "ingredients", "cooking_recipe".
      - "title": A creative and appealing name for the dumpling recipe.
      - "description": A short, one-paragraph description of the dumplings, capturing their essence.
      - "ingredients": A JSON object where keys are categories (e.g., "Dough", "Filling") and values are arrays of strings, with each string being an ingredient (e.g., "1 cup all-purpose flour").
      - "cooking_recipe": A string containing numbered, step-by-step instructions for preparing and cooking the dumplings. Use \\n for newlines between steps.
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    const recipeContent = JSON.parse(response.choices[0].message.content);

    const imageUrl = '/placeholder.svg';

    const { data: newRecipe, error: insertError } = await supabaseAdmin
        .from('recipes')
        .insert({
            recipe_data: payload,
            title: recipeContent.title,
            description: recipeContent.description,
            ingredients: recipeContent.ingredients,
            cooking_recipe: recipeContent.cooking_recipe,
            image_url: imageUrl,
        })
        .select()
        .single();
    
    if (insertError) {
        throw insertError;
    }

    return new Response(JSON.stringify({ recipe: newRecipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

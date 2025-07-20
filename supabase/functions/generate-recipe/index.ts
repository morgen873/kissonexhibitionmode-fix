import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'

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
    const payload: RecipePayload = await req.json()
    
    // Quick validation
    if (!payload.questions || !payload.timeline || !payload.controls) {
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Environment setup
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!
    
    if (!openAIApiKey) {
        throw new Error("Missing OPENAI_API_KEY environment variable.");
    }
    
    // Initialize clients
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
    const openAI = new OpenAI({ apiKey: openAIApiKey });

    // Generate recipe
    const timelineTheme = Object.values(payload.timeline)[0] || 'Present';
    const emotionalContext = Object.values(payload.questions).join(' and ');
    const controlValues = Object.values(payload.controls)[0] || {};
    
    const prompt = `Create a dumpling recipe based on:
    - Timeline: ${timelineTheme}
    - Emotional context: ${emotionalContext}
    - Shape: ${controlValues.shape || 'round'}
    - Flavor: ${controlValues.flavor || 'balanced'}
    
    Return a JSON object with title, description, cooking_recipe, and ingredients (organized by category).`;

    const completion = await openAI.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const recipeContent = completion.choices[0].message.content;
    let parsedRecipe;
    
    try {
      parsedRecipe = JSON.parse(recipeContent || '{}');
    } catch {
      parsedRecipe = {
        title: "Custom Dumpling Recipe",
        description: "A delicious dumpling recipe",
        cooking_recipe: "Cook the dumplings with care",
        ingredients: { "Main": ["flour", "water", "filling"] }
      };
    }

    // Save to database
    const { data: newRecipe, error: insertError } = await supabaseAdmin
      .from('recipes')
      .insert({
        title: parsedRecipe.title,
        description: parsedRecipe.description,
        cooking_recipe: parsedRecipe.cooking_recipe,
        ingredients: parsedRecipe.ingredients,
        recipe_data: payload,
        image_url: '/placeholder.svg'
      })
      .select()
      .single();

    if (insertError || !newRecipe) {
      throw new Error('Failed to save recipe');
    }

    // Generate image
    const imagePrompt = `A delicious ${controlValues.shape || 'round'} dumpling with ${controlValues.flavor || 'balanced'} flavor, professional food photography, appetizing`;
    
    try {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        if (imageData.data?.[0]?.b64_json) {
          // Convert to blob and upload
          const imageB64 = imageData.data[0].b64_json;
          const byteCharacters = atob(imageB64);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          
          const fileName = `recipe_${newRecipe.id}.jpg`;
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('recipe_images')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: true,
              contentType: 'image/jpeg'
            });

          if (!uploadError) {
            const { data: urlData } = supabaseAdmin.storage
              .from('recipe_images')
              .getPublicUrl(fileName);
            
            // Update recipe with image URL
            await supabaseAdmin
              .from('recipes')
              .update({ image_url: urlData.publicUrl })
              .eq('id', newRecipe.id);
            
            newRecipe.image_url = urlData.publicUrl;
          }
        }
      }
    } catch (imageError) {
      console.log('Image generation failed:', imageError);
    }

    return new Response(JSON.stringify({ recipe: newRecipe }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables.");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const prompt = `
      You are a creative chef specializing in "Memory KissOn" dumplings. A user has provided the following inputs to create a unique recipe.
      Your task is to generate a dumpling recipe that meticulously incorporates all the user's choices.

      User Inputs:
      - Questions & Answers: ${JSON.stringify(payload.questions, null, 2)}
      - Timeline selection: ${JSON.stringify(payload.timeline, null, 2)}
      - Control settings: ${JSON.stringify(payload.controls, null, 2)}

      **Crucial Instructions:**
      The "Timeline selection" is the most important input. It defines the entire theme of the dumpling.
      - If the timeline is futuristic (e.g., "Distant Future"), the recipe must be avant-garde. Use experimental ingredients like lab-grown proteins, nutrient pastes, or molecular gastronomy techniques. The description and title should sound futuristic.
      - If the timeline is historical (e.g., "Ancient Past"), the recipe must be traditional, using ingredients and methods authentic to that period.
      - All other inputs (questions, controls) should be interpreted through the lens of the selected timeline. For example, a "spicy" flavor in a futuristic context might mean using a synthetic capsaicin extract, while in a historical context it would be a specific type of chili pepper.

      Generate the following information in a JSON format. Do not include any text outside of the JSON object.
      The JSON object should have these exact keys: "title", "description", "ingredients", "cooking_recipe".
      - "title": A creative and appealing name for the dumpling recipe, fitting the timeline.
      - "description": A short, one-paragraph description of the dumplings, capturing their essence and strongly reflecting the chosen timeline.
      - "ingredients": A JSON object where keys are categories (e.g., "Dough", "Filling") and values are arrays of strings, with each string being an ingredient (e.g., "1 cup all-purpose flour"). The ingredients MUST match the timeline's theme.
      - "cooking_recipe": A string containing numbered, step-by-step instructions for preparing and cooking the dumplings. The steps should also reflect the timeline. Use \\n for newlines between steps.
    `;

    console.log("Generating recipe with OpenAI...");
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    const recipeContent = JSON.parse(response.choices[0].message.content);
    console.log("Recipe generated successfully:", recipeContent.title);

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

    // Generate and upload image with emotionally resonant, conceptual design
    try {
        const dumplingShape = Object.values(payload.controls)[0]?.shape || 'classic';
        const flavor = Object.values(payload.controls)[0]?.flavor || 'mild';
        const timelineTheme = Object.values(payload.timeline)[0] || 'present';
        
        // Extract emotional context from user's answers
        const userAnswers = Object.values(payload.questions);
        const emotionalContext = userAnswers.join(', ');
        
        // Extract key ingredients for visual representation
        const ingredientsList = [];
        if (recipeContent.ingredients && typeof recipeContent.ingredients === 'object') {
            Object.values(recipeContent.ingredients).forEach((categoryItems: any) => {
                if (Array.isArray(categoryItems)) {
                    categoryItems.forEach((item: string) => {
                        const cleanIngredient = item.replace(/^\d+[\s\w]*\s+/, '').split(',')[0].split('(')[0].trim();
                        if (cleanIngredient.length > 2) {
                            ingredientsList.push(cleanIngredient);
                        }
                    });
                }
            });
        }
        
        let imagePrompt = '';
        
        if (timelineTheme.toLowerCase().includes('future') || timelineTheme.toLowerCase().includes('distant')) {
            // FUTURISTIC: Conceptual, speculative, mind-blowing design
            imagePrompt = `Ultra-futuristic conceptual food art: a single ${dumplingShape} dumpling that transcends traditional food design, embodying the memories and emotions: "${emotionalContext}".

SPECULATIVE DESIGN CONCEPT:
- This dumpling exists in ${timelineTheme} where food is art, memory, and technology combined
- The dumpling should be BREATHTAKINGLY beautiful and conceptually stunning
- Incorporate bioluminescent, holographic, or crystalline elements that pulse with emotion
- The surface might have flowing light patterns, neural network-like veins, or memory fragments visible within
- Colors should be otherworldly: electric blues, plasma purples, quantum silvers, or energy greens
- The ${dumplingShape} shape is reimagined as a perfect geometric form with impossible physics
- Ingredients like "${ingredientsList.slice(0, 3).join(', ')}" are visualized as glowing essences or energy patterns
- The dumpling appears to float or defy gravity, surrounded by particle effects or energy fields

EMOTIONAL TRANSLATION:
- The visual should make viewers feel the profound emotions: ${emotionalContext}
- Use dramatic lighting that suggests transcendence, connection across time, or emotional depth
- The dumpling should look like it contains actual memories - perhaps with subtle holographic imagery within
- ${flavor} flavor is represented through color temperature and energy intensity

TECHNICAL REQUIREMENTS:
- Pure black void background - the dumpling exists in space-time
- Photorealistic but impossibly beautiful - like concept art from the best sci-fi films
- No text, utensils, or mundane elements
- Professional cinematic lighting with dramatic shadows and highlights
- The image should make people gasp with wonder and want to experience this impossible food

This is not just food - it's a vessel for human memory and emotion, designed by advanced civilization.`;
        
        } else if (timelineTheme.toLowerCase().includes('ancient') || timelineTheme.toLowerCase().includes('past') || timelineTheme.toLowerCase().includes('medieval')) {
            // HISTORICAL: Authentic, rustic, traditional with emotional depth
            let historicalStyle = '';
            let culturalContext = '';
            
            if (timelineTheme.toLowerCase().includes('ancient')) {
                historicalStyle = 'ancient, primitive, clay-fired appearance';
                culturalContext = 'made by ancient hands with deep spiritual significance';
            } else if (timelineTheme.toLowerCase().includes('medieval')) {
                historicalStyle = 'medieval, hearty, rustic European';
                culturalContext = 'crafted in a medieval kitchen with traditional techniques';
            } else {
                historicalStyle = 'traditional, handmade, historical';
                culturalContext = 'made with ancestral knowledge and emotional care';
            }
            
            imagePrompt = `Authentic historical food photography: a single ${dumplingShape} dumpling representing "${recipeContent.title}" from ${timelineTheme}.

HISTORICAL AUTHENTICITY:
- ${historicalStyle} appearance that reflects the ${timelineTheme} era
- The dumpling looks ${culturalContext}
- Visible hand-crafted texture with natural imperfections that show human touch
- Colors and ingredients reflect what was available in ${timelineTheme}: ${ingredientsList.slice(0, 3).join(', ')}
- The ${flavor} flavor is suggested through natural, earthy color tones
- Surface shows traditional pleating, folding, or shaping techniques

EMOTIONAL RESONANCE:
- The dumpling embodies the emotions: ${emotionalContext}
- Lighting suggests warmth, tradition, and deep human connection
- The texture and appearance should evoke nostalgia and authenticity
- Made with love and carrying the weight of human tradition

VISUAL REQUIREMENTS:
- Solid black background for dramatic contrast
- Warm, natural lighting that highlights the handmade texture
- Realistic food photography that makes it look absolutely delicious
- No modern elements, text, or artificial additions
- The dumpling should look like it was lovingly prepared by skilled traditional hands

This dumpling carries the emotional weight of human tradition and ancestral memory.`;
        
        } else {
            // CONTEMPORARY: Modern artisanal approach
            imagePrompt = `Contemporary artisanal food photography: a single ${dumplingShape} dumpling representing "${recipeContent.title}".

MODERN ARTISANAL STYLE:
- Professional, contemporary food presentation
- The dumpling shows modern culinary techniques while honoring tradition
- Clean, precise craftsmanship with artistic flair
- Ingredients ${ingredientsList.slice(0, 3).join(', ')} are represented through natural colors and textures
- ${flavor} flavor profile suggested through appealing visual cues

EMOTIONAL CONNECTION:
- The dumpling embodies: ${emotionalContext}
- Lighting and presentation evoke modern comfort and sophistication
- Perfect balance of tradition and innovation

REQUIREMENTS:
- Solid black background
- Professional food photography lighting
- The dumpling looks expertly crafted and delicious
- No props or decorative elements
- Clean, focused composition

A perfect dumpling that bridges tradition with contemporary culinary artistry.`;
        }
        
        console.log("Generating emotionally resonant image with DALL-E...");
        console.log("Timeline theme:", timelineTheme);
        console.log("Emotional context:", emotionalContext);
        
        const imageResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
            style: 'natural',
        });
        
        console.log("Image generated successfully");
        const imageB64 = imageResponse.data[0].b64_json;
        
        if (imageB64) {
            const imageBlob = await(await fetch(`data:image/png;base64,${imageB64}`)).blob();
            const imagePath = `public/${newRecipe.id}.png`;

            console.log("Ensuring bucket exists and uploading image...");
            
            // First, ensure the bucket exists
            const { data: buckets } = await supabaseAdmin.storage.listBuckets();
            const bucketExists = buckets?.some(bucket => bucket.id === 'recipe_images');
            
            if (!bucketExists) {
                console.log("Creating recipe_images bucket...");
                const { error: bucketError } = await supabaseAdmin.storage.createBucket('recipe_images', {
                    public: true,
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
                    fileSizeLimit: 5242880 // 5MB
                });
                
                if (bucketError) {
                    console.error('Error creating bucket:', bucketError);
                } else {
                    console.log("Bucket created successfully");
                }
            }
            
            // Upload the image
            const { error: uploadError } = await supabaseAdmin.storage
                .from('recipe_images')
                .upload(imagePath, imageBlob, {
                    contentType: 'image/png',
                    upsert: true,
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
            } else {
                console.log("Image uploaded successfully to:", imagePath);
                const { data: urlData } = supabaseAdmin.storage
                    .from('recipe_images')
                    .getPublicUrl(imagePath);
                
                console.log("Generated public URL:", urlData.publicUrl);
                
                if (urlData.publicUrl) {
                    newRecipe.image_url = urlData.publicUrl;
                    
                    const { error: updateError } = await supabaseAdmin
                        .from('recipes')
                        .update({ image_url: urlData.publicUrl })
                        .eq('id', newRecipe.id);

                    if (updateError) {
                        console.error('Error updating recipe with image URL:', updateError);
                    } else {
                        console.log("Recipe updated successfully with image URL");
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error generating/uploading image:", e);
        // Continue with placeholder image
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

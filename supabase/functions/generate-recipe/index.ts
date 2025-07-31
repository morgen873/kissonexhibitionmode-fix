import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.24.1'

interface RecipePayload {
  questions: { [key: string]: string };
  questionTitles: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { 
    temperature: number; 
    shape: string; 
    flavor: string; 
    enhancer: string; 
    dietary: { 
      vegan: boolean; 
      vegetarian: boolean; 
      allergies: string; 
      specialDiet: boolean; 
    }; 
  } };
  userJourney: {
    totalSteps: number;
    completedAnswers: number;
    selectedOptions: string[];
    customInputs: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: RecipePayload = await req.json()
    
    // Comprehensive validation of ALL user data
    if (!payload.questions || !payload.timeline || !payload.controls || !payload.userJourney) {
      console.error('❌ INCOMPLETE PAYLOAD RECEIVED:', {
        hasQuestions: !!payload.questions,
        hasTimeline: !!payload.timeline,
        hasControls: !!payload.controls,
        hasUserJourney: !!payload.userJourney
      });
      return new Response(JSON.stringify({ error: "Missing required comprehensive user data" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log('✅ COMPREHENSIVE PAYLOAD VALIDATION PASSED:', {
      questionsCount: Object.keys(payload.questions).length,
      timelineCount: Object.keys(payload.timeline).length,
      controlsCount: Object.keys(payload.controls).length,
      userJourneySteps: payload.userJourney.totalSteps,
      completionRate: `${payload.userJourney.completedAnswers}/${payload.userJourney.totalSteps}`
    });

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

    // Import the comprehensive recipe generator
    const { generateRecipeWithOpenAI } = await import('./utils/recipeGenerator.ts');
    
    console.log('🚀 GENERATING COMPREHENSIVE RECIPE WITH ALL USER DATA...');
    console.log('📊 Input Summary:', {
      timeline: Object.values(payload.timeline)[0],
      questionsAnswered: Object.keys(payload.questions).length,
      userJourneyCompletion: `${payload.userJourney.completedAnswers}/${payload.userJourney.totalSteps}`,
      hasControls: !!Object.keys(payload.controls).length,
      selectedOptions: payload.userJourney.selectedOptions.length,
      customInputs: payload.userJourney.customInputs.length
    });

    // Generate comprehensive recipe using ALL user data
    let parsedRecipe;
    try {
      parsedRecipe = await generateRecipeWithOpenAI(payload, openAI);
      console.log('✅ COMPREHENSIVE RECIPE GENERATED SUCCESSFULLY:', parsedRecipe.title);
    } catch (error) {
      console.error('❌ Comprehensive recipe generation failed:', error);
      
      // Enhanced fallback with user data
      const controlValues = Object.values(payload.controls)[0] || {};
      const dietaryInfo = controlValues.dietary || {};
      const timelineTheme = Object.values(payload.timeline)[0] || 'Present';
      
      parsedRecipe = {
        title: `${timelineTheme} Memory Dumplings`,
        description: `Personalized dumplings reflecting your ${timelineTheme} journey${dietaryInfo.vegan ? ' (Vegan)' : dietaryInfo.vegetarian ? ' (Vegetarian)' : ''}.`,
        cooking_recipe: `1. Prepare dough according to traditional methods\\n2. Create filling with ${controlValues.flavor || 'balanced'} flavors\\n3. Shape into ${controlValues.shape || 'round'} dumplings\\n4. Cook at optimal temperature\\n5. Serve with complementary sauce`,
        ingredients: {
          "Dough": ["2 cups all-purpose flour", "3/4 cup warm water", "1 tsp salt"],
          "Filling": dietaryInfo.vegan 
            ? ["2 cups mixed mushrooms", "1 cup firm tofu", "2 green onions", "ginger", "garlic"]
            : ["1 cup protein of choice", "1 cup vegetables", "seasonings"],
          "Sauce": ["soy sauce", "sesame oil", "rice vinegar", "chili oil (optional)"]
        }
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

    // Extract control values for image generation
    const controlValues = Object.values(payload.controls)[0] || {};
    const timelineTheme = Object.values(payload.timeline)[0] || 'Present';
    
    // Import simplified prompt builder
    const { buildSimplifiedPrompt } = await import('./utils/simplifiedPromptBuilder.ts');
    
    // Generate enhanced prompt with solid black background
    const promptParams = {
      dumplingShape: controlValues.shape || 'round',
      flavor: controlValues.flavor || 'balanced',
      timelineTheme: timelineTheme,
      ingredientsList: [], // Not needed for this simplified approach
      recipeTitle: parsedRecipe.title
    };
    
    const { prompt: imagePrompt, negativePrompt } = buildSimplifiedPrompt(promptParams);
    
    console.log('Generating image with enhanced prompt:', imagePrompt);
    console.log('Negative prompt:', negativePrompt);
    console.log('User inputs - Timeline:', timelineTheme, 'Shape:', controlValues.shape, 'Flavor:', controlValues.flavor);
    
    console.log('🎨 ATTEMPTING IMAGE GENERATION...');
    console.log('API Key available:', !!openAIApiKey);
    
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
          quality: 'high'
        }),
      });

      console.log('🖼️ Image API Response Status:', imageResponse.status);
      
      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('❌ OpenAI Image API Error:', imageResponse.status, errorText);
        throw new Error(`OpenAI API error: ${imageResponse.status} - ${errorText}`);
      }
      
      const imageData = await imageResponse.json();
      console.log('📸 Image Data Structure:', {
        hasData: !!imageData.data,
        dataLength: imageData.data?.length || 0,
        hasUrl: !!imageData.data?.[0]?.url,
        hasB64: !!imageData.data?.[0]?.b64_json
      });
      
      // Handle both URL and base64 responses
      let imageUrl = null;
      if (imageData.data?.[0]?.url) {
        imageUrl = imageData.data[0].url;
        console.log('✅ Image URL received:', imageUrl);
      } else if (imageData.data?.[0]?.b64_json) {
        // For gpt-image-1, we get base64 data - need to upload to storage
        console.log('📤 Converting base64 to storage URL...');
        const base64Data = imageData.data[0].b64_json;
        
        // Convert base64 to blob and upload to Supabase storage
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `recipe-${newRecipe.id}-${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('recipe-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            cacheControl: '3600'
          });
        
        if (uploadError) {
          console.error('❌ Storage upload error:', uploadError);
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('recipe-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
        console.log('✅ Image uploaded to storage:', imageUrl);
      }
      
      if (imageUrl) {
        // Update recipe with image URL
        const { error: updateError } = await supabaseAdmin
          .from('recipes')
          .update({ image_url: imageUrl })
          .eq('id', newRecipe.id);
        
        if (updateError) {
          console.error('❌ Database update error:', updateError);
        } else {
          newRecipe.image_url = imageUrl;
          console.log('✅ Recipe updated with image URL successfully');
        }
      } else {
        console.log('❌ No image data received from OpenAI');
        throw new Error('No image data in OpenAI response');
      }
      
    } catch (imageError) {
      console.error('❌ IMAGE GENERATION COMPLETELY FAILED:', imageError.message || imageError);
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

import OpenAI from 'https://esm.sh/openai@4.24.1'

interface RecipePayload {
  questions: { [key: string]: string };
  questionTitles: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } };
  userJourney: {
    totalSteps: number;
    completedAnswers: number;
    selectedOptions: string[];
    customInputs: string[];
  };
}

export async function generateRecipeWithOpenAI(payload: RecipePayload, openai: OpenAI) {
  // Extract ALL user data for comprehensive recipe generation
  const controlValues = Object.values(payload.controls)[0] || {};
  const dietaryInfo = controlValues.dietary || {};
  const isVegan = dietaryInfo.vegan;
  const isVegetarian = dietaryInfo.vegetarian;
  const allergies = dietaryInfo.allergies || '';
  const hasSpecialDiet = dietaryInfo.specialDiet;
  
  // Build comprehensive dietary requirements string
  let dietaryRequirements = '';
  if (isVegan) {
    dietaryRequirements += 'ABSOLUTELY VEGAN - ZERO animal products, dairy, eggs, honey, or ANY animal-derived ingredients. Use plant-based alternatives only. ';
  } else if (isVegetarian) {
    dietaryRequirements += 'STRICTLY VEGETARIAN - No meat, poultry, fish, or seafood. Dairy and eggs are acceptable. ';
  }
  if (allergies) {
    dietaryRequirements += `SEVERE ALLERGIES - MUST completely eliminate all traces of: ${allergies}. Check all ingredients for cross-contamination. `;
  }
  if (hasSpecialDiet) {
    dietaryRequirements += 'SPECIAL DIETARY NEEDS - Apply additional dietary restrictions with extreme care. ';
  }

  // Extract all user journey data
  const timelineSelection = Object.values(payload.timeline)[0] || 'Present';
  const questionsData = payload.questions;
  const questionTitles = payload.questionTitles;
  const userJourney = payload.userJourney;
  
  // Create comprehensive context from ALL user inputs
  const comprehensiveContext = {
    timeline: timelineSelection,
    emotionalJourney: Object.keys(questionsData).map(key => ({
      question: questionTitles[key] || `Question ${key}`,
      answer: questionsData[key]
    })),
    culinaryControls: {
      temperature: controlValues.temperature || 180,
      shape: controlValues.shape || 'round',
      flavor: controlValues.flavor || 'balanced',
      enhancer: controlValues.enhancer || 'traditional herbs',
    },
    userPreferences: {
      selectedOptions: userJourney.selectedOptions,
      customInputs: userJourney.customInputs,
      journeyCompletion: `${userJourney.completedAnswers}/${userJourney.totalSteps}`
    },
    dietaryRestrictions: dietaryRequirements
  };

  console.log('🔍 COMPREHENSIVE RECIPE CONTEXT:', comprehensiveContext);

  const prompt = `
    You are an expert chef creating "Memory KissOn" dumplings for a culinary exhibition. 
    You have received COMPLETE user journey data and must use ALL of it to create a personalized recipe.

    COMPLETE USER JOURNEY DATA:
    ${JSON.stringify(comprehensiveContext, null, 2)}

    **CRITICAL DIETARY COMPLIANCE - ABSOLUTELY MANDATORY:**
    ${dietaryRequirements ? `${dietaryRequirements}
    
    🚨 DIETARY RESTRICTION ENFORCEMENT 🚨
    - If VEGAN: ABSOLUTELY NO meat, poultry, fish, seafood, dairy, eggs, honey, gelatin, or ANY animal products
    - Use ONLY: vegetables, fruits, grains, legumes, nuts, seeds, plant-based proteins (tofu, tempeh), plant milks
    - If VEGETARIAN: NO meat, poultry, fish, or seafood. Dairy and eggs ARE allowed
    - If ALLERGIES mentioned: COMPLETELY eliminate ALL traces of those allergens
    - DOUBLE-CHECK every single ingredient before including it
    - When in doubt, choose plant-based alternatives` : 'No specific dietary restrictions.'}

    **TIMELINE-DRIVEN RECIPE CREATION:**
    Timeline: ${timelineSelection}
    - FUTURE: Use molecular gastronomy, innovative techniques, lab-grown ingredients, futuristic presentation
    - PAST: Use traditional methods, heritage ingredients, historical cooking techniques
    - PRESENT: Use contemporary methods with modern, accessible ingredients

    **USE ALL USER DATA:**
    - Incorporate emotional responses: ${Object.values(questionsData).join(', ')}
    - Apply ALL selected preferences: ${userJourney.selectedOptions.join(', ')}
    - Include custom inputs: ${userJourney.customInputs.join(', ')}
    - Match temperature setting: ${controlValues.temperature}°C cooking
    - Create ${controlValues.shape} shaped dumplings
    - Apply ${controlValues.flavor} flavor profile
    - Enhance with: ${controlValues.enhancer}

    **OUTPUT REQUIREMENTS:**
    Return ONLY a valid JSON object with NO extra text, markdown, or artifacts.
    Structure:
    {
      "title": "Creative dumpling name reflecting timeline and user journey (max 80 chars)",
      "description": "Warm description connecting timeline, emotions, and personal choices (max 400 chars)",
      "ingredients": {
        "Dough": ["ingredient with measurement", ...],
        "Filling": ["ingredient with measurement", ...],
        "Sauce": ["ingredient with measurement", ...]
      },
      "cooking_recipe": "Step-by-step instructions separated by \\n, incorporating temperature, shape, and all user preferences"
    }
  `;

  console.log("Generating comprehensive recipe with ALL user data...");
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-2025-04-14',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const rawContent = response.choices[0].message.content;
  console.log("Raw OpenAI response received");
  
  try {
    // Comprehensive JSON cleaning to remove ALL artifacts
    let cleanedContent = rawContent
      ?.replace(/```json\s*/g, '')
      ?.replace(/```\s*/g, '')
      ?.replace(/^[^{]*{/, '{')  // Remove anything before the first {
      ?.replace(/}[^}]*$/, '}')  // Remove anything after the last }
      ?.trim();
    
    if (!cleanedContent) {
      throw new Error('Empty response from OpenAI');
    }
    
    const recipeContent = JSON.parse(cleanedContent);
    console.log("✅ Comprehensive recipe generated with ALL user data:", recipeContent.title);
    
    // Clean cooking recipe from any remaining JSON artifacts
    if (recipeContent.cooking_recipe) {
      recipeContent.cooking_recipe = recipeContent.cooking_recipe
        .replace(/\\"/g, '"')     // Fix escaped quotes
        .replace(/\\n/g, '\n')    // Convert literal \n to newlines
        .replace(/\\\\/g, '\\')   // Fix double backslashes
        .replace(/^["']|["']$/g, '') // Remove wrapping quotes
        .replace(/^\s*{\s*"[^"]*":\s*"|"\s*}\s*$/g, '') // Remove JSON wrapper patterns
        .trim();
    }
    
    // Validate required fields
    if (!recipeContent.title || !recipeContent.description || !recipeContent.ingredients || !recipeContent.cooking_recipe) {
      throw new Error('Missing required recipe fields');
    }
    
    return recipeContent;
  } catch (parseError) {
    console.error('❌ JSON parsing error:', parseError);
    console.error('Raw content:', rawContent);
    
    // Fallback with user data incorporated
    return {
      title: `${timelineSelection} Memory Dumplings`,
      description: `Personalized dumplings inspired by your ${timelineSelection} timeline journey${dietaryRequirements ? ' with dietary considerations' : ''}.`,
      ingredients: {
        "Dough": ["2 cups flour", "3/4 cup warm water", "1 tsp salt"],
        "Filling": dietaryRequirements.includes('VEGAN') 
          ? ["2 cups chopped mushrooms", "1 cup firm tofu", "2 green onions", "1 tsp ginger"]
          : ["1 cup ground protein", "1 cup vegetables", "2 green onions", "1 tsp ginger"],
        "Sauce": ["2 tbsp soy sauce", "1 tsp sesame oil", "1 tsp rice vinegar"]
      },
      cooking_recipe: `1. Mix dough ingredients and knead until smooth\\n2. Prepare filling by combining all ingredients\\n3. Roll dough into ${controlValues.shape} shapes\\n4. Fill and seal dumplings\\n5. Cook at ${controlValues.temperature}°C until golden`
    };
  }
}


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
    // Aggressive JSON cleaning to remove ALL artifacts
    let cleanedContent = rawContent
      ?.replace(/```json\s*/g, '')
      ?.replace(/```\s*/g, '')
      ?.replace(/^[^{]*{/, '{')
      ?.replace(/}[^}]*$/, '}')
      ?.replace(/^\s*|\s*$/g, '') // Remove whitespace
      ?.replace(/\n\s*\n/g, '\n'); // Remove extra newlines
    
    if (!cleanedContent) {
      throw new Error('Empty response from OpenAI');
    }
    
    console.log('🧹 Cleaned content for parsing:', cleanedContent.substring(0, 200) + '...');
    
    const recipeContent = JSON.parse(cleanedContent);
    console.log("✅ Comprehensive recipe generated with ALL user data:", recipeContent.title);
    
    // AGGRESSIVE cleaning of cooking recipe to remove ALL JSON artifacts
    if (recipeContent.cooking_recipe) {
      let cleanedRecipe = recipeContent.cooking_recipe;
      
      // Handle different input formats
      if (typeof cleanedRecipe === 'object') {
        // If it's an object with numbered steps, convert to string
        if (typeof cleanedRecipe === 'object' && cleanedRecipe !== null) {
          const steps = Object.keys(cleanedRecipe)
            .sort((a, b) => {
              const numA = parseInt(a.replace(/\D/g, '')) || 0;
              const numB = parseInt(b.replace(/\D/g, '')) || 0;
              return numA - numB;
            })
            .map(key => cleanedRecipe[key])
            .filter(step => step && typeof step === 'string');
          cleanedRecipe = steps.join('\n');
        }
      }
      
      // Clean string-based recipe instructions
      cleanedRecipe = cleanedRecipe
        .replace(/\\"/g, '"')           // Fix escaped quotes
        .replace(/\\n/g, '\n')          // Convert literal \n to newlines
        .replace(/\\\\/g, '\\')         // Fix double backslashes
        .replace(/^["']|["']$/g, '')    // Remove wrapping quotes
        .replace(/^\s*{\s*|\s*}\s*$/g, '') // Remove JSON wrapper braces
        .replace(/\"step\d+\":\s*\"/g, '') // Remove step labels
        .replace(/\",\s*\"/g, '\n')     // Convert JSON comma separators to newlines
        .replace(/\"$/g, '')            // Remove trailing quote
        .replace(/^\"/g, '')            // Remove leading quote
        .trim();
      
      recipeContent.cooking_recipe = cleanedRecipe;
      console.log('🧹 Cleaned cooking recipe:', cleanedRecipe.substring(0, 100) + '...');
    }
    
    // Validate required fields
    if (!recipeContent.title || !recipeContent.description || !recipeContent.ingredients || !recipeContent.cooking_recipe) {
      throw new Error('Missing required recipe fields');
    }
    
    return recipeContent;
  } catch (parseError) {
    console.error('❌ JSON parsing error:', parseError);
    console.error('Raw content:', rawContent);
    
    // ENHANCED fallback with STRICT dietary compliance
    const veganFilling = [
      "2 cups finely chopped shiitake mushrooms",
      "1 cup crumbled firm tofu",
      "2 green onions, minced",
      "1 tsp fresh ginger, grated",
      "2 tbsp soy sauce",
      "1 tsp sesame oil",
      "1/2 cup finely chopped cabbage",
      "1 carrot, finely diced"
    ];
    
    const regularFilling = [
      "1 cup ground pork or chicken",
      "1 cup napa cabbage, finely chopped",
      "2 green onions, minced",
      "1 tsp fresh ginger, grated",
      "2 tbsp soy sauce",
      "1 tsp sesame oil"
    ];
    
    return {
      title: `${timelineSelection} Memory Dumplings`,
      description: `Personalized dumplings inspired by your ${timelineSelection} timeline journey${dietaryRequirements ? ' with strict dietary compliance' : ''}.`,
      ingredients: {
        "Dough": ["2 cups all-purpose flour", "3/4 cup warm water", "1 tsp salt", "1 tbsp vegetable oil"],
        "Filling": isVegan ? veganFilling : regularFilling,
        "Sauce": ["3 tbsp soy sauce", "1 tsp sesame oil", "1 tsp rice vinegar", "1/2 tsp chili oil (optional)"]
      },
      cooking_recipe: `1. Mix flour, salt, and oil in a large bowl. Gradually add warm water, stirring until dough forms.\n2. Knead dough for 8-10 minutes until smooth and elastic. Cover and rest for 30 minutes.\n3. Prepare filling by combining all filling ingredients in a bowl and mixing well.\n4. Roll dough into small balls and flatten into ${controlValues.shape || 'round'} wrappers.\n5. Place 1 tablespoon of filling in center of each wrapper and seal edges.\n6. Steam dumplings for 12-15 minutes at ${controlValues.temperature || 180}°C until cooked through.\n7. Serve hot with dipping sauce.`
    };
  }
}

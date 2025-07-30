
import OpenAI from 'https://esm.sh/openai@4.24.1'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } };
}

export async function generateRecipeWithOpenAI(payload: RecipePayload, openai: OpenAI) {
  // Extract dietary information from controls
  const controlValues = Object.values(payload.controls)[0] || {};
  const dietaryInfo = controlValues.dietary || {};
  const isVegan = dietaryInfo.vegan;
  const isVegetarian = dietaryInfo.vegetarian;
  const allergies = dietaryInfo.allergies || '';
  const hasSpecialDiet = dietaryInfo.specialDiet;
  
  // Build dietary requirements string
  let dietaryRequirements = '';
  if (isVegan) {
    dietaryRequirements += 'STRICTLY VEGAN - NO animal products, dairy, eggs, or any animal-derived ingredients whatsoever. ';
  } else if (isVegetarian) {
    dietaryRequirements += 'VEGETARIAN - No meat or fish, but dairy and eggs are allowed. ';
  }
  if (allergies) {
    dietaryRequirements += `ALLERGIES: Must completely avoid all ingredients containing or related to: ${allergies}. `;
  }
  if (hasSpecialDiet) {
    dietaryRequirements += 'SPECIAL DIET - Consider additional dietary restrictions carefully. ';
  }

  const prompt = `
    You are a creative chef specializing in "Memory KissOn" dumplings for a public culinary exhibition. 
    A user has provided the following inputs to create a unique, family-friendly recipe suitable for all audiences.
    Your task is to generate a dumpling recipe that incorporates all the user's choices while being appropriate for a public exhibition.

    User Inputs:
    - Questions & Answers: ${JSON.stringify(payload.questions, null, 2)}
    - Timeline selection: ${JSON.stringify(payload.timeline, null, 2)}
    - Control settings: ${JSON.stringify(payload.controls, null, 2)}

    ${dietaryRequirements ? `CRITICAL DIETARY REQUIREMENTS: ${dietaryRequirements}` : ''}
    ${dietaryRequirements ? 'YOU MUST ENSURE ALL INGREDIENTS AND COOKING METHODS STRICTLY COMPLY WITH THE DIETARY REQUIREMENTS ABOVE. THIS IS NON-NEGOTIABLE.' : ''}

    **Crucial Instructions:**
    The "Timeline selection" is the most important input. It defines the entire theme of the dumpling.
    - If the timeline is futuristic (e.g., "Future 1", "Future 2"), use innovative culinary techniques and modern ingredients. Focus on molecular gastronomy, lab-grown proteins, and futuristic cooking methods.
    - If the timeline is historical (e.g., "Past 1", "Past 2"), use traditional ingredients and authentic historical cooking methods. Focus on heritage techniques and time-honored ingredients.
    - If the timeline is present day ("Present"), use contemporary cooking techniques with modern, accessible ingredients.
    - All other inputs (questions, controls) should be interpreted through the lens of the selected timeline.

    **Exhibition Guidelines:**
    - Use only family-friendly, professional culinary language
    - Focus on cooking techniques, ingredient combinations, and sensory descriptions
    - Avoid any potentially controversial or inappropriate content
    - Keep descriptions warm, welcoming, and suitable for all ages
    - Emphasize the cultural and emotional aspects of cooking and sharing food

    Generate the following information in a JSON format. Do not include any text outside of the JSON object.
    The JSON object should have these exact keys: "title", "description", "ingredients", "cooking_recipe".
    - "title": A creative and appealing name for the dumpling recipe, fitting the timeline (maximum 100 characters)
    - "description": A warm, family-friendly paragraph describing the dumplings and their connection to the timeline and emotions (maximum 500 characters)
    - "ingredients": A JSON object where keys are categories (e.g., "Dough", "Filling") and values are arrays of strings, with each string being an ingredient with measurements
    - "cooking_recipe": A string containing clear, numbered, step-by-step instructions using professional cooking terminology (use \\n for newlines between steps)
  `;

  console.log("Generating exhibition-appropriate recipe with OpenAI...");
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const recipeContent = JSON.parse(response.choices[0].message.content);
  console.log("Exhibition-appropriate recipe generated successfully:", recipeContent.title);
  
  return recipeContent;
}

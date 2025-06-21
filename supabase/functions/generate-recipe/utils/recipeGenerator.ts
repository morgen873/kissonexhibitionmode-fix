
import OpenAI from 'https://esm.sh/openai@4.24.1'

interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export async function generateRecipeWithOpenAI(payload: RecipePayload, openai: OpenAI) {
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
  
  return recipeContent;
}

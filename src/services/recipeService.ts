
import { supabase } from '@/integrations/supabase/client';
import { steps } from '@/data/creation';
import { QuestionStep } from '@/types/creation';

export interface RecipePayload {
  questions: { [key: string]: string };
  timeline: { [key: string]: string };
  controls: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } };
}

export class RecipeService {
  static processAnswers(
    answers: { [key: number]: string },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } }
  ): RecipePayload {
    const questionAnswers: { [key: string]: string } = {};
    const timelineAnswers: { [key: string]: string } = {};

    console.log("=== 🔍 PROCESSING ANSWERS ===");

    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = steps.find(s => 'id' in s && s.id === Number(stepId));
      
      if (step) {
        if (step.type === 'question') {
          const questionStep = step as QuestionStep;
          if (questionStep.customOption && answer === questionStep.customOption.title) {
            const customAnswer = customAnswers[Number(stepId)];
            questionAnswers[stepId] = customAnswer || '';
          } else {
            questionAnswers[stepId] = answer;
          }
        } else if (step.type === 'timeline') {
          timelineAnswers[stepId] = answer;
        }
      }
    });

    return {
      questions: questionAnswers,
      timeline: timelineAnswers,
      controls: controlValues,
    };
  }

  static async generateRecipe(payload: RecipePayload) {
    console.log("🚀 Calling Supabase function 'generate-recipe'...");
    
    const { data, error } = await supabase.functions.invoke('generate-recipe', {
      body: payload,
    });

    if (error) {
      console.error("❌ Supabase function error:", error);
      throw error;
    }

    const newRecipe = data.recipe;
    if (!newRecipe) {
      throw new Error("Recipe generation failed. The function did not return a recipe.");
    }

    return newRecipe;
  }

  static createRecipeUrl(recipeId: string): string {
    return `${window.location.origin}/recipe/${recipeId}`;
  }
}


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
    answers: { [key: number]: string | string[] },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; } },
    timelineValue?: string
  ): RecipePayload {
    const questionAnswers: { [key: string]: string } = {};
    const timelineAnswers: { [key: string]: string } = {};

    console.log("=== 🔍 PROCESSING ANSWERS ===");

    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = steps.find(s => 'id' in s && s.id === Number(stepId));
      
      if (step) {
        if (step.type === 'question') {
          const questionStep = step as QuestionStep;
          
          // Handle multi-select questions
          if (questionStep.multiSelect && Array.isArray(answer)) {
            // For multi-select, check if custom option is included
            if (questionStep.customOption && answer.includes(questionStep.customOption.title)) {
              const customAnswer = customAnswers[Number(stepId)];
              // Include both selected options and custom answer
              const nonCustomAnswers = answer.filter(a => a !== questionStep.customOption.title);
              if (customAnswer) {
                questionAnswers[stepId] = [...nonCustomAnswers, customAnswer].join(', ');
              } else {
                questionAnswers[stepId] = nonCustomAnswers.join(', ');
              }
            } else {
              questionAnswers[stepId] = answer.join(', ');
            }
          } else {
            // Handle single-select questions (existing behavior)
            const singleAnswer = Array.isArray(answer) ? answer[0] : answer;
            if (questionStep.customOption && singleAnswer === questionStep.customOption.title) {
              const customAnswer = customAnswers[Number(stepId)];
              questionAnswers[stepId] = customAnswer || '';
            } else {
              questionAnswers[stepId] = singleAnswer || '';
            }
          }
        } else if (step.type === 'timeline') {
          const timelineAnswer = Array.isArray(answer) ? answer[0] : answer;
          timelineAnswers[stepId] = timelineAnswer || '';
        }
      }
    });

    // If we have a direct timeline value, use it instead of relying on state
    if (timelineValue) {
      console.log('Using direct timeline value:', timelineValue);
      // Find the timeline step to get its ID
      const timelineStep = steps.find(s => s.type === 'timeline');
      if (timelineStep && 'id' in timelineStep) {
        timelineAnswers[timelineStep.id.toString()] = timelineValue;
      }
    }

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

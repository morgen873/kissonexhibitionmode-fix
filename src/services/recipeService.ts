
import { supabase } from '@/integrations/supabase/client';
import { steps } from '@/data/creation';
import { QuestionStep } from '@/types/creation';

export interface RecipePayload {
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

export class RecipeService {
  static processAnswers(
    answers: { [key: number]: string | string[] },
    customAnswers: { [key: number]: string },
    controlValues: { [key: number]: { temperature: number; shape: string; flavor: string; enhancer: string; dietary: { vegan: boolean; vegetarian: boolean; allergies: string; specialDiet: boolean; }; } },
    timelineValue?: string
  ): RecipePayload {
    const questionAnswers: { [key: string]: string } = {};
    const questionTitles: { [key: string]: string } = {};
    const timelineAnswers: { [key: string]: string } = {};
    const selectedOptions: string[] = [];
    const customInputs: string[] = [];

    console.log("=== 🔍 COMPREHENSIVE PROCESSING OF ALL USER DATA ===");

    // Process all answers and gather comprehensive data
    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = steps.find(s => 'id' in s && s.id === Number(stepId));
      
      if (step) {
        if (step.type === 'question') {
          const questionStep = step as QuestionStep;
          
          // Store question title for context
          questionTitles[stepId] = questionStep.question;
          
          // Handle multi-select questions
          if (questionStep.multiSelect && Array.isArray(answer)) {
            // Track all selected options
            selectedOptions.push(...answer.filter(a => a !== questionStep.customOption?.title));
            
            // For multi-select, check if custom option is included
            if (questionStep.customOption && answer.includes(questionStep.customOption.title)) {
              const customAnswer = customAnswers[Number(stepId)];
              // Include both selected options and custom answer
              const nonCustomAnswers = answer.filter(a => a !== questionStep.customOption.title);
              if (customAnswer) {
                customInputs.push(customAnswer);
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
              if (customAnswer) {
                customInputs.push(customAnswer);
                questionAnswers[stepId] = customAnswer;
              } else {
                questionAnswers[stepId] = '';
              }
            } else {
              selectedOptions.push(singleAnswer);
              questionAnswers[stepId] = singleAnswer || '';
            }
          }
        } else if (step.type === 'timeline') {
          const timelineAnswer = Array.isArray(answer) ? answer[0] : answer;
          timelineAnswers[stepId] = timelineAnswer || '';
          selectedOptions.push(timelineAnswer || '');
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
        // Update selected options with direct timeline value
        const timelineStepIndex = selectedOptions.findIndex(opt => 
          ['Past', 'Present', 'Future'].some(time => opt.includes(time))
        );
        if (timelineStepIndex >= 0) {
          selectedOptions[timelineStepIndex] = timelineValue;
        } else {
          selectedOptions.push(timelineValue);
        }
      }
    }

    // Calculate comprehensive user journey data
    const userJourney = {
      totalSteps: steps.filter(s => s.type === 'question' || s.type === 'timeline').length,
      completedAnswers: Object.keys(questionAnswers).length + Object.keys(timelineAnswers).length,
      selectedOptions: selectedOptions.filter(opt => opt && opt.trim()),
      customInputs: customInputs.filter(input => input && input.trim())
    };

    console.log('📊 COMPREHENSIVE USER DATA COLLECTED:', {
      questionsCount: Object.keys(questionAnswers).length,
      timelineCount: Object.keys(timelineAnswers).length,
      controlsCount: Object.keys(controlValues).length,
      selectedOptionsCount: userJourney.selectedOptions.length,
      customInputsCount: userJourney.customInputs.length,
      totalJourneyCompletion: `${userJourney.completedAnswers}/${userJourney.totalSteps}`
    });

    return {
      questions: questionAnswers,
      questionTitles: questionTitles,
      timeline: timelineAnswers,
      controls: controlValues,
      userJourney: userJourney
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

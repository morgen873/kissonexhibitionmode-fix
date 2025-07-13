
import { steps } from '@/data/creation';

export const isNextDisabled = (
    currentStep: number,
    answers: { [key: number]: string | string[] },
    customAnswers: { [key: number]: string }
): boolean => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.type === 'question') {
        const answer = answers[currentStepData.id];
        
        // For multi-select questions, check if at least one option is selected
        if (currentStepData.multiSelect) {
            const answerArray = Array.isArray(answer) ? answer : [];
            if (answerArray.length === 0) return true;
            
            // If custom option is selected, check if custom answer is provided
            if (currentStepData.customOption && answerArray.includes(currentStepData.customOption.title)) {
                const customAnswer = customAnswers[currentStepData.id];
                return !customAnswer || !customAnswer.trim();
            }
            return false;
        }
        
        // For single-select questions (existing behavior)
        if (!answer) return true;
        if (currentStepData.customOption && answer === currentStepData.customOption.title) {
            const customAnswer = customAnswers[currentStepData.id];
            return !customAnswer || !customAnswer.trim();
        }
    }
    
    if (currentStepData.type === 'timeline') {
        const answer = answers[currentStepData.id];
        if (!answer) return true;
    }
    
    return false;
};

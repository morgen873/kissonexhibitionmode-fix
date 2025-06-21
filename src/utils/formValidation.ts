
import { steps } from '@/data/creation';

export const isNextDisabled = (
    currentStep: number,
    answers: { [key: number]: string },
    customAnswers: { [key: number]: string }
): boolean => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.type === 'question') {
        const answer = answers[currentStepData.id];
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

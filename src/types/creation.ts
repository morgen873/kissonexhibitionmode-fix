
export interface QuestionStep {
    type: 'question';
    id: number;
    question: string;
    options: { title: string; description: string; }[];
    customOption?: {
        title: string;
        placeholder: string;
    };
}

export interface ExplanationStep {
    type: 'explanation';
    title: string;
    description: string;
}

export type Step = QuestionStep | ExplanationStep;

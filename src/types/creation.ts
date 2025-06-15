
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

export interface ControlsStep {
    type: 'controls';
    id: number;
    title: string;
    description: string;
    controls: {
        temperature: {
            min: number;
            max: number;
            unit: string;
            defaultValue: number;
        };
        shape: {
            options: string[];
            defaultValue: string;
        };
        flavor: {
            options: string[];
            defaultValue: string;
        };
    };
}

export type Step = QuestionStep | ExplanationStep | ControlsStep;

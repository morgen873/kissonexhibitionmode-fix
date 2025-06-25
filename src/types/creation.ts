
export interface QuestionStep {
    type: 'question';
    id: number;
    title: string;
    description: string;
    options: { title: string; description: string; }[];
    customOption?: {
        title: string;
        placeholder: string;
    };
    gifUrl?: string;
}

export interface ExplanationStep {
    type: 'explanation';
    id: number;
    title: string;
    description: string;
    gifUrl?: string;
}

export interface ControlsStep {
    type: 'controls';
    id: number;
    title: string;
    description: string;
    controls: {
        temperature: {
            label: string;
            min: number;
            max: number;
            defaultValue: number;
            icon: any;
        };
        shape: {
            label: string;
            options: string[];
            defaultIndex: number;
            icon: any;
        };
        flavor: {
            label: string;
            options: string[];
            defaultIndex: number;
            icon: any;
        };
        enhancer: {
            label: string;
            placeholder: string;
            icon: any;
        };
    };
    gifUrl?: string;
}

export interface TimelineStep {
    type: 'timeline';
    id: number;
    title: string;
    description: string;
    options: {
        title: string;
        description: string;
        value?: string;
    }[];
    gifUrl?: string;
}

export type Step = QuestionStep | ExplanationStep | ControlsStep | TimelineStep;

// Add the missing CreationStep type as an alias for Step
export type CreationStep = Step;

export interface RecipeResult {
    name: string;
    imageUrl: string;
    qrData: string;
}

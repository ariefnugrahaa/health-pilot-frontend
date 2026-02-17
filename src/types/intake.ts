export type StepType = 'radio' | 'text' | 'number' | 'date' | 'select' | 'checkbox';

export interface StepOption {
    id: string;
    label: string;
    description?: string;
    value: string;
}

export interface StepField {
    id: string;
    type: StepType;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: StepOption[]; // For radio/select/checkbox
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
}

export interface IntakeStep {
    id: string;
    title: string;
    description?: string;
    fields: StepField[];
}

export interface IntakeConfig {
    steps: IntakeStep[];
}

export type StepType =
  | 'radio'
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'multi_select'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'boolean';

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
    helperText?: string;
    required?: boolean;
    options?: StepOption[]; // For radio/select/checkbox
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    dependsOnField?: string;
    dependsOnValue?: string;
}

export interface IntakeStep {
    id: string;
    title: string;
    description?: string;
    isOptional?: boolean;
    fields: StepField[];
}

export interface IntakeConfig {
    steps: IntakeStep[];
}

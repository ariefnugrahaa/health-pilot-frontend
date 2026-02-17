import { IntakeConfig } from "@/types/intake";

export const MOCK_INTAKE_CONFIG: IntakeConfig = {
    steps: [
        {
            id: "goals",
            title: "Getting started",
            description: "What would you like to focus on right now?",
            fields: [
                {
                    id: "goal",
                    type: "radio",
                    label: "Primary Goal",
                    required: true,
                    options: [
                        { id: "overall", value: "overall_health", label: "Understand my overall health", description: "Get a broad view of your health status" },
                        { id: "concern", value: "specific_concern", label: "Explore a specific concern", description: "Focus on something that's bothering you" },
                        { id: "prevention", value: "prevention", label: "Prevention and long-term health", description: "Stay healthy and reduce future risk" },
                        { id: "unsure", value: "unsure", label: "I'm not sure yet", description: "Let the system guide me" },
                    ]
                }
            ]
        },
        {
            id: "health_profile",
            title: "Health Profile",
            description: "Basic measurements to help us personalize recommendations.",
            fields: [
                { id: "height", type: "number", label: "Height (cm)", placeholder: "175", required: true },
                { id: "weight", type: "number", label: "Weight (kg)", placeholder: "70", required: true },
                { id: "dob", type: "date", label: "Date of Birth", required: true },
                {
                    id: "gender",
                    type: "radio",
                    label: "Biological Sex",
                    required: true,
                    options: [
                        { id: "female", value: "female", label: "Female" },
                        { id: "male", value: "male", label: "Male" }
                    ]
                }
            ]
        },
        {
            id: "conditions",
            title: "Specific Conditions",
            description: "Do you have any diagnosed medical conditions?",
            fields: [
                {
                    id: "condition_list",
                    type: "checkbox",
                    label: "Select all that apply",
                    options: [
                        { id: "diabetes", value: "diabetes", label: "Diabetes (Type 1 or 2)" },
                        { id: "hypertension", value: "hypertension", label: "Hypertension (High Blood Pressure)" },
                        { id: "cholesterol", value: "high_cholesterol", label: "High Cholesterol" },
                        { id: "thyroid", value: "thyroid", label: "Thyroid Disorders" },
                        { id: "none", value: "none", label: "None of the above" },
                    ]
                }
            ]
        },
        {
            id: "lifestyle",
            title: "Your Lifestyle",
            description: "Which lifestyle factors would you like to discuss?",
            fields: [
                {
                    id: "lifestyle_factors",
                    type: "checkbox",
                    label: "Select all that apply",
                    options: [
                        { id: "sleep", value: "sleep", label: "Sleep Quality" },
                        { id: "exercise", value: "exercise", label: "Exercise and Activity" },
                        { id: "stress", value: "stress", label: "Stress Management" },
                        { id: "diet", value: "diet", label: "Diet and Nutrition" },
                    ]
                }
            ]
        }
    ]
};

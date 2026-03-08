import type { IntakeStep, StepField } from "@/types/intake";

export function isFieldVisible(field: StepField, values: Record<string, unknown>): boolean {
    if (!field.dependsOnField) {
        return true;
    }

    const dependentValue = values[field.dependsOnField];
    if (dependentValue === undefined || dependentValue === null || dependentValue === "") {
        return false;
    }

    if (!field.dependsOnValue || field.dependsOnValue.trim() === "") {
        return Array.isArray(dependentValue) ? dependentValue.length > 0 : Boolean(dependentValue);
    }

    const expectedValues = field.dependsOnValue
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

    if (expectedValues.length === 0) {
        return true;
    }

    if (Array.isArray(dependentValue)) {
        const normalizedArray = dependentValue.map((value) => String(value).toLowerCase());
        return expectedValues.some((expectedValue) => normalizedArray.includes(expectedValue));
    }

    return expectedValues.includes(String(dependentValue).toLowerCase());
}

export function getVisibleSteps(
    steps: IntakeStep[],
    answers: Record<string, unknown>,
): IntakeStep[] {
    return steps.filter((step) => {
        if (!step.fields || step.fields.length === 0) {
            return true;
        }

        return step.fields.some((field) => isFieldVisible(field, answers));
    });
}

export function pruneHiddenFieldAnswers(
    steps: IntakeStep[],
    answers: Record<string, unknown>,
): Record<string, unknown> {
    const configuredFields = steps.flatMap((step) => step.fields);
    const nextAnswers = { ...answers };

    let didChange = true;
    while (didChange) {
        didChange = false;
        const visibleFieldIds = new Set(
            configuredFields
                .filter((field) => isFieldVisible(field, nextAnswers))
                .map((field) => field.id),
        );

        for (const field of configuredFields) {
            if (!visibleFieldIds.has(field.id) && field.id in nextAnswers) {
                delete nextAnswers[field.id];
                didChange = true;
            }
        }
    }

    return nextAnswers;
}

export function areAnswerMapsEqual(
    left: Record<string, unknown>,
    right: Record<string, unknown>,
): boolean {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every((key) => {
        const leftValue = left[key];
        const rightValue = right[key];

        if (Array.isArray(leftValue) || Array.isArray(rightValue)) {
            if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
                return false;
            }

            if (leftValue.length !== rightValue.length) {
                return false;
            }

            return leftValue.every((value, index) => value === rightValue[index]);
        }

        return leftValue === rightValue;
    });
}

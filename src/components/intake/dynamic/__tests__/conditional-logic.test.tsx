import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { DynamicStep } from "../DynamicStep";
import { DynamicWizard } from "../DynamicWizard";
import type { IntakeConfig, IntakeStep } from "@/types/intake";

const { mockPush, mockCreateIntake, mockCompleteIntake } = vi.hoisted(() => ({
    mockPush: vi.fn(),
    mockCreateIntake: vi.fn(),
    mockCompleteIntake: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@/lib/api/intake", () => ({
    createIntake: mockCreateIntake,
    completeIntake: mockCompleteIntake,
}));

vi.mock("@/lib/api/auth", () => ({
    linkAnonymousIntake: vi.fn(),
}));

vi.mock("@/lib/pending-intake", () => ({
    savePendingIntake: vi.fn(),
    getPendingIntake: vi.fn(() => null),
    clearPendingIntake: vi.fn(),
}));

vi.mock("@/core/stores/auth.store", () => ({
    useAuthStore: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
    }),
}));

const CONDITIONAL_STEP: IntakeStep = {
    id: "step-1",
    title: "Basic Intake",
    fields: [
        {
            id: "has_concern",
            type: "radio",
            label: "Do you have a specific concern?",
            required: true,
            options: [
                { id: "yes", value: "yes", label: "Yes" },
                { id: "no", value: "no", label: "No" },
            ],
        },
        {
            id: "concern_details",
            type: "text",
            label: "Tell us more",
            dependsOnField: "has_concern",
            dependsOnValue: "yes",
        },
    ],
};

const CONDITIONAL_CONFIG: IntakeConfig = {
    steps: [
        CONDITIONAL_STEP,
        {
            id: "step-2",
            title: "Follow Up",
            fields: [
                {
                    id: "follow_up",
                    type: "text",
                    label: "Anything else to add?",
                    dependsOnField: "concern_details",
                },
            ],
        },
    ],
};

describe("Conditional logic cleanup", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCreateIntake.mockResolvedValue({ id: "intake-123" });
        mockCompleteIntake.mockResolvedValue({
            healthSummary: "Summary",
            recommendations: [],
            warnings: [],
            nextSteps: [],
        });
    });

    it("removes hidden dependent answers before submitting a step", async () => {
        const onNext = vi.fn();

        render(
            <DynamicStep
                step={CONDITIONAL_STEP}
                data={{}}
                onNext={onNext}
                onBack={vi.fn()}
                isFirstStep
                isLastStep={false}
            />,
        );

        const user = userEvent.setup();

        await user.click(screen.getByText("Yes"));
        await user.type(screen.getByLabelText("Tell us more"), "Persistent fatigue");
        await user.click(screen.getByText("No"));
        await user.click(screen.getByText("Continue"));

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledWith({ has_concern: "no" });
        });
    });

    it("clears stale hidden answers so later conditional steps disappear", async () => {
        render(<DynamicWizard initialConfig={CONDITIONAL_CONFIG} />);

        const user = userEvent.setup();

        await user.click(screen.getByText("Yes"));
        await user.type(screen.getByLabelText("Tell us more"), "Persistent fatigue");
        await user.click(screen.getByText("Continue"));

        await waitFor(() => {
            expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();
        });

        await user.click(screen.getByText("Back"));
        await waitFor(() => {
            expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();
        });

        await user.click(screen.getByText("No"));
        expect(screen.queryByLabelText("Tell us more")).not.toBeInTheDocument();

        await user.click(screen.getByText("Continue"));

        await waitFor(() => {
            expect(mockCreateIntake).toHaveBeenCalledWith({ has_concern: "no" });
        });

        expect(screen.queryByText("Anything else to add?")).not.toBeInTheDocument();
        expect(mockCompleteIntake).toHaveBeenCalled();
    });
});

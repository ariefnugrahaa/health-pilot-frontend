"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DynamicStep } from "./DynamicStep";
import { IntakeConfig } from "@/types/intake";
import { Step5HealthSummary } from "../Step5HealthSummary";
import { GeneratedHealthSummary } from "../GeneratedHealthSummary";
import { SummaryLoading } from "../SummaryLoading";
import { SummaryError } from "../SummaryError";
import { MOCK_INTAKE_CONFIG } from "@/lib/mock-intake";
import { X } from "lucide-react";
import { createIntake, completeIntake } from "@/lib/api/intake";

import { Logo } from "@/components/brand/Logo";

interface DynamicWizardProps {
    initialConfig?: IntakeConfig | null;
}

export function DynamicWizard({ initialConfig }: DynamicWizardProps) {
    const [config, setConfig] = useState<IntakeConfig | null>(initialConfig || null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(!initialConfig);

    // AI Summary State
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [intakeId, setIntakeId] = useState<string | null>(null);

    // Track if we've already triggered generation for this step
    const hasGeneratedRef = useRef(false);

    // Store the steps length to avoid dependency on config object
    const stepsLengthRef = useRef(config?.steps.length);


    useEffect(() => {
        if (initialConfig) {
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                const res = await fetch(`${API_BASE_URL}/api/v1/intakes/config`);
                const result = await res.json();
                if (result.success) {
                    setConfig(result.data);
                    stepsLengthRef.current = result.data.steps.length;
                } else {
                    setConfig(MOCK_INTAKE_CONFIG);
                    stepsLengthRef.current = MOCK_INTAKE_CONFIG.steps.length;
                }
            } catch (err) {
                setConfig(MOCK_INTAKE_CONFIG);
                stepsLengthRef.current = MOCK_INTAKE_CONFIG.steps.length;
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [initialConfig]);

    const handleNext = (stepData: any) => {
        const updatedData = { ...formData, ...stepData };
        setFormData(updatedData);

        if (config && currentStepIndex < config.steps.length) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    // Trigger AI generation when user reaches summary step
    useEffect(() => {
        const stepsLength = stepsLengthRef.current;
        const isSummaryStep = stepsLength !== undefined && currentStepIndex === stepsLength;

        // Reset the ref when moving away from summary step
        if (!isSummaryStep) {
            hasGeneratedRef.current = false;
            return;
        }

        const shouldGenerate = isSummaryStep && !summaryData && !summaryError && !isGeneratingSummary;

        if (shouldGenerate && !hasGeneratedRef.current) {
            hasGeneratedRef.current = true;

            // Async wrapper to avoid ESLint warnings
            (async () => {
                setIsGeneratingSummary(true);
                setSummaryError(null);

                try {
                    const intakeResponse = await createIntake(formData);
                    setIntakeId(intakeResponse.id);

                    const completeResponse = await completeIntake(intakeResponse.id);
                    setSummaryData(completeResponse);
                } catch (error) {
                    console.error('Failed to generate health summary:', error);
                    setSummaryError(error instanceof Error ? error.message : 'Failed to generate health summary');
                } finally {
                    setIsGeneratingSummary(false);
                }
            })();
        }
        // Only depend on currentStepIndex - check other values inside the effect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStepIndex]);

    const handleRetry = () => {
        setSummaryError(null);
        hasGeneratedRef.current = false;

        // Trigger generation by forcing a re-render
        (async () => {
            setIsGeneratingSummary(true);

            try {
                const intakeResponse = await createIntake(formData);
                setIntakeId(intakeResponse.id);

                const completeResponse = await completeIntake(intakeResponse.id);
                setSummaryData(completeResponse);
            } catch (error) {
                console.error('Failed to generate health summary:', error);
                setSummaryError(error instanceof Error ? error.message : 'Failed to generate health summary');
            } finally {
                setIsGeneratingSummary(false);
            }
        })();
    };

    const handleNextSteps = () => {
        // Navigate to next steps or treatment recommendations
        console.log('Navigate to next steps');
    };

    const handleWhyThis = () => {
        // Show explanation modal
        console.log('Show why this summary');
    };

    const handleSaveLater = () => {
        // Save progress and exit
        console.log('Save for later');
    };

    const handleContactSupport = () => {
        // Open support contact
        window.location.href = 'mailto:support@healthpilot.com';
    };

    if (loading || !config) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[600px] space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-[#effefb] border-t-[#14b8a6] animate-spin" />
                <p className="text-[#667085] font-medium animate-pulse">Loading Health Check...</p>
            </div>
        );
    }

    const isSummary = currentStepIndex === config.steps.length;
    const currentStep = config.steps[currentStepIndex];
    const totalSteps = config.steps.length; // Number of question steps
    const stepNumber = currentStepIndex + 1;
    const progress = (stepNumber / (totalSteps + 1)) * 100;

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <Logo size="sm" />

            <div className="space-y-6">
                {/* Step Info Header */}
                <div className="flex justify-between items-start pt-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-[#101828]">Step {isSummary ? totalSteps : stepNumber} of {totalSteps}</h2>
                        <p className="text-[#667085] text-sm">{isSummary ? "Summary" : currentStep.title}</p>
                    </div>
                    <button className="p-2 hover:bg-[#F2F4F7] rounded-full transition-colors text-[#667085]">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-[6px] w-full bg-[#EAECF0] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#14b8a6] transition-all duration-700 ease-out"
                        style={{ width: `${isSummary ? 100 : progress}%` }}
                    />
                </div>

                {/* Main Content Area */}
                <div className="pt-4">
                    {isSummary ? (
                        isGeneratingSummary ? (
                            <SummaryLoading />
                        ) : summaryError ? (
                            <SummaryError
                                error={summaryError}
                                onRetry={handleRetry}
                                onSaveLater={handleSaveLater}
                                onContactSupport={handleContactSupport}
                            />
                        ) : summaryData ? (
                            <GeneratedHealthSummary
                                data={summaryData}
                                onNextSteps={handleNextSteps}
                                onWhyThis={handleWhyThis}
                                onSaveLater={handleSaveLater}
                            />
                        ) : (
                            <Step5HealthSummary data={formData} />
                        )
                    ) : (
                        <DynamicStep
                            key={currentStep.id}
                            step={currentStep}
                            data={formData}
                            onNext={handleNext}
                            onBack={handleBack}
                            isFirstStep={currentStepIndex === 0}
                            isLastStep={currentStepIndex === config.steps.length - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}




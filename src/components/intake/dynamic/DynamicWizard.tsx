"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { DynamicStep } from "./DynamicStep";
import { IntakeConfig } from "@/types/intake";
import { Step5HealthSummary } from "../Step5HealthSummary";
import { GeneratedHealthSummary } from "../GeneratedHealthSummary";
import { SummaryLoading } from "../SummaryLoading";
import { SummaryError } from "../SummaryError";
import type { HealthSummaryData } from "@/types";
import { X } from "lucide-react";
import { createIntake, completeIntake } from "@/lib/api/intake";
import { linkAnonymousIntake } from "@/lib/api/auth";
import { useAuthStore } from "@/core/stores/auth.store";
import { savePendingIntake, getPendingIntake, clearPendingIntake } from "@/lib/pending-intake";
import {
    areAnswerMapsEqual,
    getVisibleSteps,
    pruneHiddenFieldAnswers,
} from "@/lib/intake-logic";
import { BloodTestIntegratedBanner } from "@/components/blood-analysis/BloodTestIntegratedBanner";

import { Logo } from "@/components/brand/Logo";

interface DynamicWizardProps {
    initialConfig?: IntakeConfig | null;
    onBack?: () => void;
    assignedTo?: string;
    bloodTestId?: string;
    bloodTestSource?: "upload" | "order";
    displayStepOffset?: number;
    displayTotalSteps?: number;
    onSummaryGenerated?: (payload: {
        intakeId: string;
        summaryData: HealthSummaryData;
        formData: Record<string, unknown>;
    }) => void;
}

export function DynamicWizard({
    initialConfig,
    onBack,
    assignedTo,
    bloodTestId,
    bloodTestSource = "order",
    displayStepOffset = 0,
    displayTotalSteps,
    onSummaryGenerated,
}: DynamicWizardProps) {
    const router = useRouter();
    const { isAuthenticated, user, token } = useAuthStore();

    const [config, setConfig] = useState<IntakeConfig | null>(initialConfig || null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(!initialConfig);
    const [configError, setConfigError] = useState<string | null>(null);

    // AI Summary State
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [summaryData, setSummaryData] = useState<HealthSummaryData | null>(null);
    const [intakeId, setIntakeId] = useState<string | null>(null);

    // Track if we've already triggered generation for this step
    const hasGeneratedRef = useRef(false);

    const sanitizedFormData = useMemo(
        () => (config ? pruneHiddenFieldAnswers(config.steps, formData) : formData),
        [config, formData]
    );
    const visibleSteps = config ? getVisibleSteps(config.steps, sanitizedFormData) : [];
    const totalSteps = visibleSteps.length;

    // Store visible steps length to avoid dependency on full object in summary effect
    const stepsLengthRef = useRef(totalSteps);
    stepsLengthRef.current = totalSteps;


    useEffect(() => {
        if (initialConfig?.steps?.length) {
            setConfig(initialConfig);
            setConfigError(null);
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const url = new URL(`${API_BASE_URL}/api/v1/intakes/config`);
                if (assignedTo) {
                    url.searchParams.set('assignedTo', assignedTo);
                }

                const res = await fetch(url.toString());
                if (!res.ok) {
                    setConfig(null);
                    setConfigError('No active intake flow is available right now.');
                    return;
                }

                const result = await res.json();
                if (result.success && result.data?.steps?.length > 0) {
                    setConfig(result.data);
                    setConfigError(null);
                } else {
                    setConfig(null);
                    setConfigError('No active intake flow is available right now.');
                }
            } catch {
                setConfig(null);
                setConfigError('Unable to load intake flow. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [assignedTo, initialConfig]);

    useEffect(() => {
        if (!config) {
            return;
        }

        if (!areAnswerMapsEqual(formData, sanitizedFormData)) {
            setFormData(sanitizedFormData);
        }
    }, [config, formData, sanitizedFormData]);

    const handleNext = (stepData: Record<string, unknown>) => {
        const updatedData = config
            ? pruneHiddenFieldAnswers(config.steps, { ...formData, ...stepData })
            : { ...formData, ...stepData };
        setFormData(updatedData);

        if (config && currentStepIndex < totalSteps) {
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
        if (currentStepIndex > totalSteps) {
            setCurrentStepIndex(totalSteps);
        }
    }, [currentStepIndex, totalSteps]);

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
                    const intakeResponse = await createIntake(sanitizedFormData);
                    setIntakeId(intakeResponse.id);

                    const completeResponse = await completeIntake(intakeResponse.id);
                    // Transform API response to HealthSummaryData format
                    const nextSummaryData = {
                        healthSummary: completeResponse.healthSummary,
                        recommendations: completeResponse.recommendations,
                        warnings: completeResponse.warnings,
                        nextSteps: completeResponse.nextSteps,
                    };
                    setSummaryData(nextSummaryData);
                    onSummaryGenerated?.({
                        intakeId: intakeResponse.id,
                        summaryData: nextSummaryData,
                        formData: sanitizedFormData,
                    });
                } catch (error) {
                    console.error('Failed to generate health summary:', error);
                    setSummaryError(error instanceof Error ? error.message : 'Failed to generate health summary');
                } finally {
                    setIsGeneratingSummary(false);
                }
            })();
        }
    }, [
        currentStepIndex,
        isGeneratingSummary,
        onSummaryGenerated,
        sanitizedFormData,
        summaryData,
        summaryError,
    ]);

    // Restore pending intake data after login
    useEffect(() => {
        const pendingIntake = getPendingIntake();
        if (pendingIntake && isAuthenticated && user?.email) {
            const restoreIntake = async () => {
                try {
                    // If we have an intake ID from an anonymous session, link it to the authenticated user
                    if (pendingIntake.intakeId) {
                        await linkAnonymousIntake({
                            anonymousIntakeId: pendingIntake.intakeId,
                            token,
                        });
                        console.log('Anonymous intake linked to authenticated user');
                    }

                    // Restore form data
                    if (pendingIntake.formData) {
                        const restoredFormData = config
                            ? pruneHiddenFieldAnswers(config.steps, pendingIntake.formData)
                            : pendingIntake.formData;
                        setFormData(restoredFormData);
                    }
                    // Restore intake ID if available
                    if (pendingIntake.intakeId) {
                        setIntakeId(pendingIntake.intakeId);
                    }
                    // Restore summary data if available
                    if (pendingIntake.summaryData) {
                        setSummaryData(pendingIntake.summaryData as HealthSummaryData);
                        // Jump to summary step if we have summary data
                        const visibleStepCount = config
                            ? getVisibleSteps(
                                config.steps,
                                pruneHiddenFieldAnswers(config.steps, pendingIntake.formData || {})
                            ).length
                            : stepsLengthRef.current;
                        if (visibleStepCount !== undefined) {
                            setCurrentStepIndex(visibleStepCount);
                        }
                    }
                } catch (error) {
                    console.error('Failed to link anonymous intake:', error);
                    // Even if linking fails, restore the form data so user can continue
                    if (pendingIntake.formData) {
                        const restoredFormData = config
                            ? pruneHiddenFieldAnswers(config.steps, pendingIntake.formData)
                            : pendingIntake.formData;
                        setFormData(restoredFormData);
                    }
                } finally {
                    // Clear pending intake from storage
                    clearPendingIntake();
                }
            };

            restoreIntake();
        }
    }, [config, isAuthenticated, token, user?.email]);

    const handleRetry = () => {
        setSummaryError(null);
        hasGeneratedRef.current = false;

        // Trigger generation by forcing a re-render
        (async () => {
            setIsGeneratingSummary(true);

        try {
            const intakeResponse = await createIntake(sanitizedFormData);
            setIntakeId(intakeResponse.id);

            const completeResponse = await completeIntake(intakeResponse.id);
            // Transform API response to HealthSummaryData format
            const nextSummaryData = {
                healthSummary: completeResponse.healthSummary,
                recommendations: completeResponse.recommendations,
                warnings: completeResponse.warnings,
                nextSteps: completeResponse.nextSteps,
            };
            setSummaryData(nextSummaryData);
            onSummaryGenerated?.({
                intakeId: intakeResponse.id,
                summaryData: nextSummaryData,
                formData: sanitizedFormData,
            });
        } catch (error) {
            console.error('Failed to generate health summary:', error);
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate health summary');
        } finally {
            setIsGeneratingSummary(false);
        }
    })();
    };

    const handleNextSteps = () => {
        // Navigate to next steps page if we have an intake ID
        if (intakeId) {
            router.push(`/health-summary/${intakeId}/next-steps`);
        }
    };

    const handleWhyThis = () => {
        // Show explanation modal
        console.log('Show why this summary');
    };

    const handleSaveLater = () => {
        // Check if user is authenticated (anonymous users will have no email)
        if (!isAuthenticated || !user?.email) {
            // Store the current intake data for later restoration after login
            savePendingIntake({
                formData: sanitizedFormData,
                intakeId,
                summaryData,
            });
            // Redirect to login page with return URL
            const returnUrl = encodeURIComponent('/');
            router.push(`/login?redirect=${returnUrl}`);
        } else {
            // User is authenticated, go back to home view (which shows CustomerHome)
            console.log('Saving intake for authenticated user:', intakeId);
            if (onBack) {
                onBack();
            } else {
                router.push('/');
            }
        }
    };

    const handleContactSupport = () => {
        // Open support contact
        window.location.href = 'mailto:support@healthpilot.com';
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[600px] space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-[#effefb] border-t-[#14b8a6] animate-spin" />
                <p className="text-[#667085] font-medium animate-pulse">Loading Health Check...</p>
            </div>
        );
    }

    if (!config || !config.steps.length) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <h2 className="text-lg font-semibold text-amber-900">Intake Is Not Available</h2>
                <p className="mt-2 text-sm text-amber-800">
                    {configError || 'No active intake flow is available right now.'}
                </p>
            </div>
        );
    }

    const safeStepIndex = Math.min(currentStepIndex, totalSteps);
    const isSummary = safeStepIndex === totalSteps;
    const currentStep = visibleSteps[safeStepIndex];
    const stepNumber = safeStepIndex + 1;
    const resolvedDisplayTotalSteps = displayTotalSteps ?? (totalSteps + displayStepOffset);
    const displayStepNumber = isSummary
        ? resolvedDisplayTotalSteps
        : Math.min(resolvedDisplayTotalSteps, stepNumber + displayStepOffset);
    const progress = resolvedDisplayTotalSteps > 0
        ? (displayStepNumber / resolvedDisplayTotalSteps) * 100
        : 0;

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <Logo size="sm" />

            <div className="space-y-6">
                {/* Step Info Header */}
                <div className="flex justify-between items-start pt-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-[#101828]">
                            Step {displayStepNumber} of {resolvedDisplayTotalSteps}
                        </h2>
                        <p className="text-[#667085] text-sm">{isSummary ? "Summary" : currentStep.title}</p>
                    </div>
                    <button
                        className="p-2 hover:bg-[#F2F4F7] rounded-full transition-colors text-[#667085]"
                        onClick={() => onBack ? onBack() : router.push('/')}
                    >
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
                    {!isSummary && bloodTestId && (
                        <div className="mb-8">
                            <BloodTestIntegratedBanner
                                bloodTestId={bloodTestId}
                                source={bloodTestSource}
                            />
                        </div>
                    )}

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
                                summaryId={intakeId || undefined}
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
                            data={sanitizedFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                            isFirstStep={safeStepIndex === 0}
                            isLastStep={safeStepIndex === totalSteps - 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

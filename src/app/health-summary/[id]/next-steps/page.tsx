"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIntake } from "@/lib/api/intake";
import { Header } from "@/components/layout/Header";
import { RecommendedNextSteps } from "@/components/intake/RecommendedNextSteps";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { NextStepRecommendation } from "@/types";

// Default next steps to show if AI didn't generate any
const DEFAULT_NEXT_STEPS: NextStepRecommendation[] = [
  {
    id: "track-sleep",
    title: "Track Sleep and Energy Patterns",
    description: "Monitor your sleep quality and energy levels throughout the day to identify patterns and potential triggers affecting your wellbeing.",
    effortLevel: "LOW",
    icon: "sleep",
    whatHappensNext: "You'll log your sleep and energy daily. After 1-2 weeks, patterns emerge that reveal triggers and help guide next steps.",
  },
  {
    id: "explore-food-triggers",
    title: "Explore Food and Digestive Triggers",
    description: "Identify foods that may be affecting your health by tracking what you eat and how you feel afterward.",
    effortLevel: "MODERATE",
    icon: "food",
    whatHappensNext: "You'll try an elimination approach, removing common trigger foods. Results typically show in 2-4 weeks.",
  },
  {
    id: "consult-provider",
    title: "Consult a Healthcare Provider",
    description: "Speak with a qualified healthcare professional who can provide personalized medical advice and run appropriate tests.",
    effortLevel: "HIGH",
    icon: "doctor",
    whatHappensNext: "A provider can run blood tests, diagnose conditions, and prescribe treatments if needed. They can also refer you to specialists.",
  },
];

export default function NextStepsPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const summaryId = params.id;

  const [nextSteps, setNextSteps] = useState<NextStepRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextSteps = async () => {
      if (!summaryId) return;

      try {
        const intake = await getIntake(summaryId);

        // Get next steps from the recommendation, or use defaults
        const aiNextSteps = intake.recommendation?.nextSteps;
        const steps = aiNextSteps && Array.isArray(aiNextSteps) && aiNextSteps.length > 0
          ? aiNextSteps
          : DEFAULT_NEXT_STEPS;
        setNextSteps(steps);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load next steps");
      } finally {
        setLoading(false);
      }
    };

    fetchNextSteps();
  }, [summaryId]);

  const handleLearnMore = (step: NextStepRecommendation) => {
    // For now, just log - could navigate to a detail page or show modal
    console.log("Learn more about:", step.title);
    // Future: router.push(`/health-summary/${summaryId}/next-steps/${step.id}`);
  };

  const handleSaveLater = () => {
    // Navigate back to health history or dashboard
    router.push("/health-history");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#14b8a6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Next Steps
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/health-history")}
            className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-md"
          >
            Back to Health History
          </button>
        </div>
      </div>
    );
  }

  if (nextSteps.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.push(`/health-summary/${summaryId}`)}
            className="flex items-center text-[#14b8a6] hover:text-[#0d9488] text-sm font-medium mb-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Health Summary
          </button>

          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Next Steps Available
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t generate personalized next steps for your health
              summary. Please try completing a new health intake.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-md"
            >
              Start New Health Check
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/health-summary/${summaryId}`)}
          className="flex items-center text-[#14b8a6] hover:text-[#0d9488] text-sm font-medium mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Health Summary
        </button>

        {/* Next Steps Component */}
        <RecommendedNextSteps
          nextSteps={nextSteps}
          onLearnMore={handleLearnMore}
          onSaveLater={handleSaveLater}
        />
      </main>
    </div>
  );
}

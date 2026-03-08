"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Utensils,
  Stethoscope,
  Dumbbell,
  Activity,
  Brain,
  Pill,
  ChevronRight,
  HelpCircle,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import type { NextStepRecommendation, EffortLevel } from "@/types";

interface RecommendedNextStepsProps {
  nextSteps: NextStepRecommendation[];
  onLearnMore?: (step: NextStepRecommendation) => void;
  onWhyThese?: () => void;
  onSaveLater?: () => void;
}

const effortLevelConfig: Record<
  EffortLevel,
  { label: string; color: string; bgColor: string }
> = {
  LOW: {
    label: "LOW EFFORT",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  MODERATE: {
    label: "MODERATE EFFORT",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  HIGH: {
    label: "HIGH EFFORT",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

const iconMap: Record<string, React.ElementType> = {
  sleep: Moon,
  food: Utensils,
  doctor: Stethoscope,
  exercise: Dumbbell,
  tracking: Activity,
  mental_health: Brain,
  supplements: Pill,
};

export function RecommendedNextSteps({
  nextSteps,
  onLearnMore,
  onWhyThese,
  onSaveLater,
}: RecommendedNextStepsProps) {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    const newSelected = new Set(selectedSteps);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSteps(newSelected);
  };

  const handleWhyThese = () => {
    setShowWhyModal(true);
    onWhyThese?.();
  };

  return (
    <>
      {/* Why These Recommendations Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowWhyModal(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <button
              onClick={() => setShowWhyModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why These Recommendations?
              </h2>

              <p className="text-gray-600 mb-6">
                These recommendations are based on the health information you
                provided. They&apos;re suggestions to help you explore potential
                next steps, not required actions.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Personalized to Your Data
                    </h3>
                    <p className="text-sm text-gray-600">
                      We analyzed your health goals, symptoms, and lifestyle
                      factors to identify relevant next steps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Effort Levels
                    </h3>
                    <p className="text-sm text-gray-600">
                      Each step shows an effort level to help you understand the
                      commitment involved.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Choose What Works for You
                    </h3>
                    <p className="text-sm text-gray-600">
                      You can select any combination of steps, or none at all.
                      It&apos;s completely up to you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="px-8 border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10"
                  onClick={() => setShowWhyModal(false)}
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Recommended Next Steps
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your health summary, these are suggestions to consider. You
            can choose any combination, or none at all.
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="space-y-4">
          {nextSteps.map((step) => {
            const Icon = iconMap[step.icon] || Activity;
            const effortConfig = effortLevelConfig[step.effortLevel];
            const isSelected = selectedSteps.has(step.id);

            return (
              <Card
                key={step.id}
                className={`transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#14b8a6] bg-[#14b8a6]/5"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleStep(step.id)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-[#14b8a6]/20" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected ? "text-[#14b8a6]" : "text-gray-600"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {step.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${effortConfig.bgColor} ${effortConfig.color}`}
                        >
                          {effortConfig.label}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {step.description}
                      </p>

                      {/* What Usually Happens Next */}
                      <div className="bg-[#14b8a6]/10 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-[#14b8a6] mb-1">
                          What Usually Happens Next
                        </p>
                        <p className="text-sm text-gray-700">
                          {step.whatHappensNext}
                        </p>
                      </div>

                      {/* Learn More Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#14b8a6] border-[#14b8a6]/30 hover:bg-[#14b8a6]/10 hover:border-[#14b8a6]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLearnMore?.(step);
                        }}
                      >
                        Learn About This Option
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onClick={handleWhyThese}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Why these recommendations?
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onClick={onSaveLater}
          >
            <Save className="mr-2 h-4 w-4" />
            Save / continue later
          </Button>
        </div>
      </div>
    </>
  );
}

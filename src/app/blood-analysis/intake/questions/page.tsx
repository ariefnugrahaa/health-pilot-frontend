"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DynamicWizard } from "@/components/intake/dynamic/DynamicWizard";

const BLOOD_ENHANCED_INTAKE = "Blood-Enhanced Intake";

export default function BloodAnalysisIntakeQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bloodTestId = searchParams.get("bloodTestId");
  const bloodTestSource = searchParams.get("source") === "upload" ? "upload" : "order";

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <DynamicWizard
        assignedTo={BLOOD_ENHANCED_INTAKE}
        bloodTestId={bloodTestId ?? undefined}
        bloodTestSource={bloodTestSource}
        displayStepOffset={1}
        displayTotalSteps={5}
        onBack={() => {
          if (bloodTestId) {
            router.push(`/blood-analysis/intake?bloodTestId=${bloodTestId}`);
            return;
          }

          router.push("/blood-analysis/intake");
        }}
        onSummaryGenerated={({ intakeId }) => {
          const nextUrl = new URL("/blood-analysis/summary", window.location.origin);
          nextUrl.searchParams.set("intakeId", intakeId);
          if (bloodTestId) {
            nextUrl.searchParams.set("bloodTestId", bloodTestId);
          }
          router.push(`${nextUrl.pathname}?${nextUrl.searchParams.toString()}`);
        }}
      />
    </div>
  );
}

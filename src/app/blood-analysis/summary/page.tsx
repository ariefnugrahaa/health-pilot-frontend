"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronUp, Loader2, Radio } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { BiomarkerCard } from "@/components/blood-analysis/BiomarkerCard";
import { getBloodTestReport, type BloodTestReport } from "@/lib/api/blood-tests";
import { getIntake } from "@/lib/api/intake";

interface IntakeRecommendation {
  id: string;
  content?: string;
  actions?: string[];
  warnings?: string[];
  nextSteps?: Array<{ id: string; title: string }>;
}

interface IntakeResponse {
  id: string;
  recommendation?: IntakeRecommendation | null;
}

function extractSummaryBullets(report: BloodTestReport, intake: IntakeResponse | null): string[] {
  const bullets: string[] = [];
  const summary = intake?.recommendation?.content ?? "";

  summary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 2)
    .forEach((sentence) => bullets.push(sentence));

  const abnormalBiomarkers = report.biomarkers.filter((biomarker) => biomarker.status !== "IN_RANGE");
  abnormalBiomarkers.slice(0, 2).forEach((biomarker) => bullets.push(biomarker.detail));

  intake?.recommendation?.actions?.slice(0, 2).forEach((action) => bullets.push(action));

  return bullets.slice(0, 5);
}

export default function BloodAnalysisSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intakeId = searchParams.get("intakeId");
  const bloodTestId = searchParams.get("bloodTestId");

  const [report, setReport] = useState<BloodTestReport | null>(null);
  const [intake, setIntake] = useState<IntakeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patternsExpanded, setPatternsExpanded] = useState(true);
  const [recapExpanded, setRecapExpanded] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!intakeId) {
        setError("Missing intake reference.");
        setIsLoading(false);
        return;
      }

      try {
        const [nextIntake, nextReport] = await Promise.all([
          getIntake(intakeId) as Promise<IntakeResponse>,
          bloodTestId ? getBloodTestReport(bloodTestId) : Promise.resolve(null),
        ]);

        setIntake(nextIntake);
        setReport(nextReport);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to build summary");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [bloodTestId, intakeId]);

  const bullets = useMemo(
    () => (report ? extractSummaryBullets(report, intake) : []),
    [intake, report]
  );
  const recapBiomarkers = useMemo(() => {
    if (!report) {
      return [];
    }

    return report.featuredBiomarkerCodes
      .map((code) => report.biomarkers.find((biomarker) => biomarker.code === code))
      .filter(
        (biomarker): biomarker is BloodTestReport["biomarkers"][number] => Boolean(biomarker)
      );
  }, [report]);

  const nextStepsHref = intakeId ? `/health-summary/${intakeId}/next-steps` : "/";
  const backHref = bloodTestId ? `/blood-analysis/results/${bloodTestId}` : "/blood-analysis";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="mx-auto max-w-[1360px] px-6 pb-20 pt-16 lg:px-10">
        {isLoading ? (
          <div className="flex min-h-[520px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#14b8a6]" />
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-[#f1c8c8] bg-[#fff6f6] p-8 text-[18px] text-[#9b3737]">
            {error}
          </div>
        ) : (
          <>
            <section className="mx-auto max-w-[1200px] text-center">
              <h1 className="text-[68px] font-semibold leading-none tracking-[-0.05em] text-[#202124]">
                Your In-Depth Health Summary
              </h1>
              <p className="mt-8 text-[30px] leading-[1.5] text-[#5f6368]">
                Based on your detailed intake and blood test results, here&apos;s a refined summary of your key health insights and areas to focus on.
              </p>
            </section>

            <section className="mx-auto mt-14 max-w-[1260px] space-y-10">
              <div className="overflow-hidden rounded-[28px] border border-[#d9dde3] bg-white shadow-[0_12px_36px_rgba(16,24,40,0.07)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-12 py-10 text-left"
                  onClick={() => setPatternsExpanded((current) => !current)}
                >
                  <div className="flex items-center gap-6">
                    <Radio className="h-11 w-11 text-[#202124]" />
                    <h2 className="text-[42px] font-semibold tracking-[-0.04em] text-[#202124]">
                      Health Patterns &amp; Recommendations
                    </h2>
                  </div>
                  {patternsExpanded ? (
                    <ChevronUp className="h-12 w-12 text-[#202124]" />
                  ) : (
                    <ChevronDown className="h-12 w-12 text-[#202124]" />
                  )}
                </button>

                {patternsExpanded && (
                  <div className="px-14 pb-12 text-[22px] leading-[1.7] text-[#202124]">
                    <ul className="space-y-6">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {report && (
                <div className="overflow-hidden rounded-[28px] border border-[#d9dde3] bg-white shadow-[0_12px_36px_rgba(16,24,40,0.07)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-12 py-10 text-left"
                    onClick={() => setRecapExpanded((current) => !current)}
                  >
                    <div className="flex items-center gap-6">
                      <Radio className="h-11 w-11 text-[#202124]" />
                      <h2 className="text-[42px] font-semibold tracking-[-0.04em] text-[#202124]">
                        Blood Test Recap
                      </h2>
                    </div>
                    {recapExpanded ? (
                      <ChevronUp className="h-12 w-12 text-[#202124]" />
                    ) : (
                      <ChevronDown className="h-12 w-12 text-[#202124]" />
                    )}
                  </button>

                  {recapExpanded && (
                    <div className="grid gap-6 px-10 pb-10 md:grid-cols-2 xl:grid-cols-4">
                      {recapBiomarkers.map((biomarker) => (
                        <BiomarkerCard key={biomarker.id} biomarker={biomarker} compact />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="mx-auto mt-16 flex max-w-[1260px] flex-col gap-5 md:flex-row md:justify-between">
              <Button
                asChild
                variant="outline"
                className="h-[78px] rounded-[18px] border-[#14b8a6] px-10 text-[22px] font-medium text-[#129b99] hover:bg-[#effcfb]"
              >
                <Link href={backHref}>Back to summary</Link>
              </Button>
              <Button
                onClick={() => router.push(nextStepsHref)}
                className="h-[78px] rounded-[18px] bg-[#14b8a6] px-10 text-[22px] font-medium text-white hover:bg-[#0f9a89]"
              >
                View personalized recommendations
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

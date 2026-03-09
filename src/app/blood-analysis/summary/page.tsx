"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

function BloodAnalysisSummaryContent() {
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
            <section className="mx-auto max-w-[800px] text-center">
              <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight text-[#202124]">
                Your In-Depth Health Summary
              </h1>
              <p className="mt-4 text-[16px] leading-[1.6] text-[#5f6368]">
                Based on your detailed intake and blood test results, here&apos;s a refined summary of your key health insights and areas to focus on.
              </p>
            </section>

            <section className="mx-auto mt-10 max-w-[960px] space-y-6">
              <div className="overflow-hidden rounded-2xl border border-[#d9dde3] bg-white shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left"
                  onClick={() => setPatternsExpanded((current) => !current)}
                >
                  <div className="flex items-center gap-4">
                    <Radio className="h-6 w-6 text-[#202124]" />
                    <h2 className="text-[20px] font-semibold text-[#202124]">
                      Health Patterns &amp; Recommendations
                    </h2>
                  </div>
                  {patternsExpanded ? (
                    <ChevronUp className="h-6 w-6 text-[#202124]" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-[#202124]" />
                  )}
                </button>

                {patternsExpanded && (
                  <div className="px-6 pb-6 md:px-14 md:pb-8 text-[14px] leading-relaxed text-[#475467]">
                    <ul className="space-y-4">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="list-disc ml-4">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {report && (
                <div className="overflow-hidden rounded-2xl border border-[#d9dde3] bg-white shadow-sm">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left"
                    onClick={() => setRecapExpanded((current) => !current)}
                  >
                    <div className="flex items-center gap-4">
                      <Radio className="h-6 w-6 text-[#202124]" />
                      <h2 className="text-[20px] font-semibold text-[#202124]">
                        Blood Test Recap
                      </h2>
                    </div>
                    {recapExpanded ? (
                      <ChevronUp className="h-6 w-6 text-[#202124]" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-[#202124]" />
                    )}
                  </button>

                  {recapExpanded && (
                    <div className="grid gap-4 px-6 pb-6 md:px-8 md:pb-8 md:grid-cols-2 xl:grid-cols-4">
                      {recapBiomarkers.map((biomarker) => (
                        <BiomarkerCard key={biomarker.id} biomarker={biomarker} compact />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="mx-auto mt-10 flex max-w-[960px] flex-col gap-4 md:flex-row md:justify-center">
              <Button
                asChild
                variant="outline"
                className="h-[48px] rounded-lg border-[#14b8a6] px-8 text-[16px] font-medium text-[#129b99] hover:bg-[#effcfb] w-full md:w-auto"
              >
                <Link href={backHref}>Back to summary</Link>
              </Button>
              <Button
                onClick={() => router.push(nextStepsHref)}
                className="h-[48px] rounded-lg bg-[#14b8a6] px-8 text-[16px] font-medium text-white hover:bg-[#0f9a89] w-full md:w-auto"
              >
                View personalized recommendations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-[#14b8a6]" />
      </div>
    </div>
  );
}

export default function BloodAnalysisSummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BloodAnalysisSummaryContent />
    </Suspense>
  );
}

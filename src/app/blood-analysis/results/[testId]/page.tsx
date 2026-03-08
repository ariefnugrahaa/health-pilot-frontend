"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Download, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { BiomarkerCard } from "@/components/blood-analysis/BiomarkerCard";
import { getBloodTestReport, type BloodTestReport } from "@/lib/api/blood-tests";

function SummaryBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "good" | "high" | "low";
}) {
  const toneClasses =
    tone === "good"
      ? "border-[#0f9a89] bg-[#effcf8] text-[#0f7f73]"
      : tone === "high"
        ? "border-[#b94747] bg-[#fff6f6] text-[#b94747]"
        : "border-[#b78c3f] bg-[#fffaf1] text-[#a77825]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[20px] ${toneClasses}`}>
      {tone === "good" ? "✓" : tone === "high" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      {count} {label}
    </span>
  );
}

export default function BloodTestResultsPage() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();

  const [report, setReport] = useState<BloodTestReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const nextReport = await getBloodTestReport(params.testId);
        setReport(nextReport);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load blood test report");
      } finally {
        setIsLoading(false);
      }
    };

    void loadReport();
  }, [params.testId]);

  const featuredBiomarkers = useMemo(() => {
    if (!report) {
      return [];
    }

    return report.featuredBiomarkerCodes
      .map((code) => report.biomarkers.find((biomarker) => biomarker.code === code))
      .filter(
        (biomarker): biomarker is BloodTestReport["biomarkers"][number] => Boolean(biomarker)
      );
  }, [report]);

  const handleDownload = () => {
    if (!report) {
      return;
    }

    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `blood-test-report-${report.testId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-16 lg:px-10">
        {isLoading ? (
          <div className="flex min-h-[520px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#14b8a6]" />
          </div>
        ) : error || !report ? (
          <div className="rounded-[24px] border border-[#f1c8c8] bg-[#fff6f6] p-8 text-[18px] text-[#9b3737]">
            {error ?? "Report not found"}
          </div>
        ) : (
          <>
            <section className="text-center">
              <h1 className="text-[58px] font-semibold leading-none tracking-[-0.04em] text-[#202124]">
                Blood Test Results &amp; Interpretation
              </h1>
            </section>

            <section className="mt-16 rounded-[28px] border border-[#d9dde3] bg-white px-10 py-9 shadow-[0_8px_28px_rgba(16,24,40,0.06)]">
              <div className="flex flex-col gap-4 text-left">
                <div className="text-[22px] text-[#5f6368]">
                  Overall blood health:{" "}
                  <span className="font-semibold text-[#202124]">{report.overallHeadline}</span>
                </div>
                <p className="max-w-4xl text-[24px] leading-[1.6] text-[#5f6368]">{report.overallSummary}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <SummaryBadge label="in range" count={report.counts.inRange} tone="good" />
                  <SummaryBadge label="slightly high" count={report.counts.slightlyHigh} tone="high" />
                  <SummaryBadge label="slightly low" count={report.counts.slightlyLow} tone="low" />
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-[40px] font-semibold tracking-[-0.03em] text-[#202124]">
                Key Biomarkers Results
              </h2>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {featuredBiomarkers.map((biomarker) => (
                  <BiomarkerCard key={biomarker.id} biomarker={biomarker} />
                ))}
              </div>
            </section>

            <div className="mt-16 flex flex-col gap-5 md:flex-row md:justify-between">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="h-[72px] rounded-[18px] border-[#14b8a6] px-10 text-[22px] font-medium text-[#129b99] hover:bg-[#effcfb]"
              >
                <Download className="mr-3 h-6 w-6" />
                Save blood test report
              </Button>
              <Button
                onClick={() => router.push(`/blood-analysis/intake?bloodTestId=${report.testId}`)}
                className="h-[72px] rounded-[18px] bg-[#14b8a6] px-10 text-[22px] font-medium text-white hover:bg-[#0f9a89]"
              >
                Continue health check
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock3, HeartPulse, ShieldCheck, X } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function BloodAnalysisIntakePage() {
  const searchParams = useSearchParams();
  const bloodTestId = searchParams.get("bloodTestId");
  const backHref = bloodTestId ? `/blood-analysis/results/${bloodTestId}` : "/blood-analysis";
  const startHref = bloodTestId
    ? `/blood-analysis/intake/questions?bloodTestId=${bloodTestId}`
    : "/blood-analysis/intake/questions";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 pb-20 pt-14 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[32px] font-semibold text-[#202124]">Step 0 of 5</p>
              <p className="mt-2 text-[24px] text-[#5f6368]">Context Screen</p>
            </div>
            <Link
              href={backHref}
              className="rounded-full p-3 text-[#202124] transition-colors hover:bg-white"
            >
              <X className="h-10 w-10" />
            </Link>
          </div>

          <div className="mt-6 h-[14px] w-full rounded-full bg-[#dadce0]" />

          <section className="mt-20 text-center">
            <h1 className="text-[72px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#202124]">
              Let&apos;s understand your health more deeply
            </h1>
            <p className="mx-auto mt-10 max-w-[1200px] text-[32px] leading-[1.5] text-[#5f6368]">
              This detailed intake helps us connect your symptoms, habits and
              (if available) blood test data for more accurate insights.
            </p>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[26px] border border-[#d9dde3] bg-white px-10 py-10 shadow-[0_10px_32px_rgba(16,24,40,0.05)]">
              <h2 className="text-[34px] font-semibold tracking-[-0.03em] text-[#202124]">
                What to expect
              </h2>
              <div className="mt-8 space-y-6 text-[20px] text-[#202124]">
                <div className="flex items-start gap-4">
                  <Clock3 className="mt-1 h-6 w-6 text-[#202124]" />
                  <span>Takes 8-10 minutes</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[22px] font-semibold">?</span>
                  <span>You can skip questions if unsure</span>
                </div>
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-1 h-6 w-6 text-[#202124]" />
                  <span>Your answers are private and secure</span>
                </div>
                <div className="flex items-start gap-4">
                  <HeartPulse className="mt-1 h-6 w-6 text-[#202124]" />
                  <span>This is not medical diagnosis</span>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#d9dde3] bg-white px-10 py-10 shadow-[0_10px_32px_rgba(16,24,40,0.05)]">
              <h2 className="text-[34px] font-semibold tracking-[-0.03em] text-[#202124]">
                What we&apos;ll ask about
              </h2>
              <div className="mt-8 space-y-6 text-[20px] text-[#202124]">
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[#202124]">✓</span>
                  <span>General health &amp; symptoms</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[#202124]">✓</span>
                  <span>Lifestyle &amp; daily habits</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[#202124]">✓</span>
                  <span>Sleep, energy &amp; stress</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[#202124]">✓</span>
                  <span>Existing conditions (if any)</span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-16 flex flex-col gap-5 md:flex-row md:justify-center">
            <Link
              href={backHref}
              className="inline-flex h-[78px] items-center justify-center rounded-[18px] border border-[#14b8a6] px-10 text-[22px] font-medium text-[#129b99] transition-colors hover:bg-[#effcfb]"
            >
              Back to summary
            </Link>
            <Link
              href={startHref}
              className="inline-flex h-[78px] items-center justify-center rounded-[18px] bg-[#14b8a6] px-10 text-[22px] font-medium text-white transition-colors hover:bg-[#0f9a89]"
            >
              Start detailed intake
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

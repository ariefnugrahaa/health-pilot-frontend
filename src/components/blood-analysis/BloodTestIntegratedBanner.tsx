"use client";

import Link from "next/link";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BloodTestIntegratedBannerProps {
  bloodTestId: string;
  source?: "upload" | "order";
}

export function BloodTestIntegratedBanner({
  bloodTestId,
  source = "order",
}: BloodTestIntegratedBannerProps) {
  const buttonLabel =
    source === "upload" ? "View uploaded result" : "View blood test result";

  return (
    <div className="rounded-[24px] border border-[#cbeee7] bg-[#e8f8f4] px-6 py-6 shadow-sm md:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-white/55 text-[#129b99]">
          <FileSpreadsheet className="h-10 w-10" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold text-[#202124] md:text-[22px]">
            Your blood test results have been integrated
          </h3>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5f6368] md:text-[18px]">
            We&apos;ll consider your cortisol, glucose, cholesterol and other markers
            along with your responses here.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-[56px] rounded-[16px] border-[#14b8a6] bg-transparent px-6 text-[18px] font-medium text-[#129b99] hover:bg-white/60"
        >
          <Link href={`/blood-analysis/results/${bloodTestId}`}>
            {buttonLabel}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

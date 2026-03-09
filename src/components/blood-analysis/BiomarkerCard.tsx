"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronUp, TrendingDown, TrendingUp, ChevronsDown, ChevronsUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BloodTestReportBiomarker } from "@/lib/api/blood-tests";

interface BiomarkerCardProps {
  biomarker: BloodTestReportBiomarker;
  compact?: boolean;
}

const statusStyles: Record<
  BloodTestReportBiomarker["status"],
  {
    label: string;
    className: string;
    icon: typeof Check;
    valueClassName: string;
  }
> = {
  IN_RANGE: {
    label: "In range",
    className: "border-[#0f9a89] text-[#0f7f73] bg-white",
    icon: Activity,
    valueClassName: "text-[#202124]",
  },
  SLIGHTLY_HIGH: {
    label: "Slightly high",
    className: "border-[#b94747] text-[#b94747] bg-white",
    icon: TrendingUp,
    valueClassName: "text-[#202124]",
  },
  SLIGHTLY_LOW: {
    label: "Slightly low",
    className: "border-[#b78c3f] text-[#a77825] bg-white",
    icon: TrendingDown,
    valueClassName: "text-[#202124]",
  },
};

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function BiomarkerCard({ biomarker, compact = false }: BiomarkerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusStyles[biomarker.status];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-[24px] border border-[#d9dde3] bg-white p-6 shadow-[0_6px_24px_rgba(16,24,40,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 text-[15px] font-medium text-[#202124] leading-tight">
          {biomarker.displayName}
          {!biomarker.displayName.includes("(") && <span className="block text-[#757575] text-[13px] mt-0.5">({biomarker.code})</span>}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 min-h-[26px] rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
            status.className
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      <div className={cn("mt-6 text-center", compact && "mt-4")}>
        <div className={cn("flex items-center justify-center gap-1.5 text-[24px] font-bold tracking-tight md:text-[26px]", status.valueClassName)}>
          {biomarker.status === "SLIGHTLY_HIGH" ? (
            <ChevronsUp className="h-5 w-5 text-inherit" />
          ) : biomarker.status === "SLIGHTLY_LOW" ? (
            <ChevronsDown className="h-5 w-5 text-inherit" />
          ) : (
            <ChevronsDown className="h-5 w-5 text-[#888]" />
          )}
          <span>{formatValue(biomarker.value)} {biomarker.unit}</span>
        </div>
        <p className="mt-1 text-[13px] text-[#757575]">(Optimal range: {biomarker.referenceRange})</p>
      </div>

      {expanded && (
        <div className="mt-5 rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[15px] leading-7 text-[#475467]">
          {biomarker.detail}
        </div>
      )}

      <button
        type="button"
        className="mt-5 flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#14b8a6] text-[15px] font-medium text-[#14b8a6] transition-colors hover:bg-[#effcfb]"
        onClick={() => setExpanded((current) => !current)}
      >
        View details
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}

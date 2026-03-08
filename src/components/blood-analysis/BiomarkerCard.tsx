"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronUp, Info, TrendingDown, TrendingUp } from "lucide-react";
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
    className: "border-[#0f9a89] text-[#0f7f73] bg-[#effcf8]",
    icon: Check,
    valueClassName: "text-[#202124]",
  },
  SLIGHTLY_HIGH: {
    label: "Slightly high",
    className: "border-[#b94747] text-[#b94747] bg-[#fff6f6]",
    icon: TrendingUp,
    valueClassName: "text-[#202124]",
  },
  SLIGHTLY_LOW: {
    label: "Slightly low",
    className: "border-[#b78c3f] text-[#a77825] bg-[#fffaf1]",
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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[18px] font-semibold text-[#202124]">
            <span>{biomarker.displayName}</span>
            <Info className="h-4 w-4 text-[#5f6368]" />
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium",
            status.className
          )}
        >
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </span>
      </div>

      <div className={cn("mt-8 text-center", compact && "mt-6")}>
        <div className={cn("text-[28px] font-semibold tracking-tight md:text-[40px]", status.valueClassName)}>
          {biomarker.status === "SLIGHTLY_HIGH" ? "↗ " : biomarker.status === "SLIGHTLY_LOW" ? "↘ " : "↘ "}
          {formatValue(biomarker.value)} {biomarker.unit}
        </div>
        <p className="mt-3 text-[16px] text-[#757575]">(Optimal range: {biomarker.referenceRange})</p>
      </div>

      {expanded && (
        <div className="mt-5 rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[15px] leading-7 text-[#475467]">
          {biomarker.detail}
        </div>
      )}

      <button
        type="button"
        className="mt-6 flex h-[60px] w-full items-center justify-center gap-3 rounded-[16px] border border-[#14b8a6] text-[18px] font-medium text-[#129b99] transition-colors hover:bg-[#effcfb]"
        onClick={() => setExpanded((current) => !current)}
      >
        View details
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
      </button>
    </div>
  );
}

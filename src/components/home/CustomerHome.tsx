"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  CreditCard,
  FileText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useAuthStore } from "@/core/stores/auth.store";
import {
  LandingExperience,
  TrustHighlightIcon,
} from "@/types/landing-settings";

interface CustomerHomeProps {
  onStart: () => void;
  landingSettings: LandingExperience;
}

function getTrustIcon(icon: TrustHighlightIcon) {
  if (icon === "encrypted") {
    return <ShieldCheck className="h-6 w-6" />;
  }

  if (icon === "payment") {
    return <CreditCard className="h-6 w-6" />;
  }

  return <Stethoscope className="h-6 w-6" />;
}

export function CustomerHome({ onStart, landingSettings }: CustomerHomeProps) {
  const { user } = useAuthStore();
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {landingSettings.hero.headline}
          </h1>
          <p className="mb-1 text-sm text-gray-500">Hello, {firstName}</p>
          <p className="text-gray-600">{landingSettings.hero.subtext}</p>
        </div>

        <div className="mb-8 rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h3 className="mb-2 text-2xl font-semibold text-gray-900">
                Your Health Summary
              </h3>
              <p className="mb-6 text-gray-500">
                View your past health summaries and insights
              </p>
              <Link
                href="/health-history"
                className="inline-flex items-center rounded-md bg-[#14b8a6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0d9488]"
              >
                View Summary
                <Activity className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="flex justify-center md:w-1/2">
              <div className="flex h-48 w-64 items-center justify-center rounded-2xl bg-[#F0FDF9]">
                <FileText className="h-16 w-16 text-[#14b8a6]/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            className="cursor-pointer rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            onClick={onStart}
          >
            {landingSettings.guidedHealthCheck.showRecommendedBadge && (
              <div className="mb-4 flex items-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#d2f6ef] px-2.5 py-0.5 text-xs font-semibold text-[#0b6b68]">
                  <Sparkles className="h-3 w-3" />
                  RECOMMENDED
                </span>
              </div>
            )}
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {landingSettings.guidedHealthCheck.title}
            </h3>
            <p className="mb-6 text-gray-600">
              {landingSettings.guidedHealthCheck.description}
            </p>
            <Button
              className="inline-flex items-center rounded-md border border-[#14b8a6] bg-transparent px-6 py-2 font-medium text-[#14b8a6] transition-colors hover:bg-[#14b8a6]/10"
              onClick={(event) => {
                event.stopPropagation();
                onStart();
              }}
            >
              {landingSettings.guidedHealthCheck.ctaButtonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            {landingSettings.fullBloodTest.showRecommendedBadge && (
              <div className="mb-4 flex items-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#d2f6ef] px-2.5 py-0.5 text-xs font-semibold text-[#0b6b68]">
                  <Sparkles className="h-3 w-3" />
                  RECOMMENDED
                </span>
              </div>
            )}
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {landingSettings.fullBloodTest.title}
            </h3>
            <p className="mb-6 text-gray-600">
              {landingSettings.fullBloodTest.description}
            </p>
            <Link href="/blood-analysis">
              <Button
                variant="outline"
                className="inline-flex items-center rounded-md border border-[#14b8a6] px-6 py-2 font-medium text-[#14b8a6] hover:bg-[#14b8a6]/10"
              >
                {landingSettings.fullBloodTest.ctaButtonLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {landingSettings.infoBanner.enabled && (
          <div className="mb-10 rounded-xl border border-[#d2f6ef] bg-[#effefb] px-5 py-4 text-center text-sm font-medium text-[#0c5446]">
            {landingSettings.infoBanner.description}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {landingSettings.trustHighlights.map((item, index) => (
            <div key={`${item.title}-${index}`} className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#14b8a6]/10 text-[#14b8a6]">
                {getTrustIcon(item.icon)}
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

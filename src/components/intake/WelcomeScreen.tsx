"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import {
  LandingExperience,
  TrustHighlightIcon,
} from "@/types/landing-settings";

interface WelcomeScreenProps {
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

export function WelcomeScreen({
  onStart,
  landingSettings,
}: WelcomeScreenProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-12 overflow-visible py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-4 pt-4 text-center">
        <Logo />
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-[#101828] md:text-[42px]">
          {landingSettings.hero.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-[#6bb0a2]/80">
          {landingSettings.hero.subtext}
        </p>
      </div>

      <div className="relative grid gap-8 px-2 md:grid-cols-2">
        <div className="relative h-full cursor-pointer group" onClick={onStart}>
          {landingSettings.guidedHealthCheck.showRecommendedBadge && (
            <div className="absolute -top-3 right-4 z-30 flex items-center space-x-1 rounded-full border border-[#14b8a6]/20 bg-[#d2f6ef] px-4 py-1.5 text-[10px] font-black tracking-wider text-[#086375] shadow-sm ring-4 ring-white">
              <Sparkles className="h-3 w-3 fill-current" />
              <span>RECOMMENDED</span>
            </div>
          )}

          <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[28px] border border-[#EAECF0] bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:border-[#14b8a6]/40 hover:shadow-[0_20px_50px_rgba(20,184,166,0.1)]">
            <div className="mb-2 flex-grow space-y-4">
              <h2 className="text-[26px] font-black leading-tight text-[#101828]">
                {landingSettings.guidedHealthCheck.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#667085]">
                {landingSettings.guidedHealthCheck.description}
              </p>
            </div>
            <div className="w-full px-4 pt-8">
              <Button className="group flex h-16 w-full items-center justify-center space-x-3 rounded-2xl bg-[#14b8a6] text-xl font-bold text-white shadow-lg shadow-[#14b8a6]/20 transition-all hover:bg-[#0d9488]">
                <span className="transition-transform group-hover:-translate-x-1">
                  {landingSettings.guidedHealthCheck.ctaButtonLabel}
                </span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="group relative h-full cursor-pointer">
          {landingSettings.fullBloodTest.showRecommendedBadge && (
            <div className="absolute -top-3 right-4 z-30 flex items-center space-x-1 rounded-full border border-[#14b8a6]/20 bg-[#d2f6ef] px-4 py-1.5 text-[10px] font-black tracking-wider text-[#086375] shadow-sm ring-4 ring-white">
              <Sparkles className="h-3 w-3 fill-current" />
              <span>RECOMMENDED</span>
            </div>
          )}

          <div className="flex h-full flex-col items-center rounded-[28px] border border-[#EAECF0] bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(234,236,240,0.1)]">
            <div className="mb-2 flex-grow space-y-4">
              <h2 className="text-[26px] font-black leading-tight text-[#101828]">
                {landingSettings.fullBloodTest.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#667085]">
                {landingSettings.fullBloodTest.description}
              </p>
            </div>
            <div className="w-full px-4 pt-8">
              <Link href="/blood-analysis" className="w-full">
                <Button
                  variant="outline"
                  className="group flex h-16 w-full items-center justify-center space-x-3 rounded-2xl border-2 border-[#d2f6ef] text-xl font-bold text-[#14b8a6] transition-all hover:border-[#14b8a6] hover:bg-[#effefb]"
                >
                  <span>{landingSettings.fullBloodTest.ctaButtonLabel}</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {landingSettings.infoBanner.enabled && (
        <div className="mx-auto flex max-w-4xl items-center space-x-4 rounded-2xl border border-[#d2f6ef] bg-[#effefb] p-5 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1dd3b0]/30">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14b8a6] font-serif text-sm italic text-white">
              i
            </div>
          </div>
          <p className="text-sm font-semibold leading-snug text-[#0c5446] md:text-base">
            {landingSettings.infoBanner.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 border-t border-[#F2F4F7] pt-12 md:grid-cols-3">
        {landingSettings.trustHighlights.map((highlight, index) => (
          <div
            key={`${highlight.title}-${index}`}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#086375] text-white shadow-md">
              {getTrustIcon(highlight.icon)}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black tracking-tight text-[#101828]">
                {highlight.title}
              </h3>
              <p className="max-w-[180px] text-[11px] font-bold text-[#667085]">
                {highlight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Home,
  Loader2,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/core/stores/auth.store";
import {
  createBloodTestOrder,
  getBloodTestOrderOptions,
  type BloodTestDateOption,
  type BloodTestLabOption,
} from "@/lib/api/blood-tests";

export default function BloodTestOrderPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [labs, setLabs] = useState<BloodTestLabOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadOrderOptions = async () => {
      try {
        const options = await getBloodTestOrderOptions();
        if (!options.enabled) {
          setError("Blood test ordering is currently disabled.");
          return;
        }

        setLabs(options.labs);
        const firstLab = options.labs[0];
        const firstDate = firstLab?.availableDates[0];
        const firstTimeSlot = firstDate?.timeSlots[0];

        setSelectedLabId(firstLab?.id ?? null);
        setSelectedDate(firstDate?.date ?? null);
        setSelectedTimeSlotId(firstTimeSlot?.id ?? null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to load labs");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrderOptions();
  }, []);

  const selectedLab = useMemo(
    () => labs.find((lab) => lab.id === selectedLabId) ?? null,
    [labs, selectedLabId]
  );
  const selectedDateOption = useMemo(
    () => selectedLab?.availableDates.find((date) => date.date === selectedDate) ?? null,
    [selectedDate, selectedLab]
  );

  const handleSelectLab = (lab: BloodTestLabOption) => {
    setSelectedLabId(lab.id);
    const firstDate = lab.availableDates[0] ?? null;
    setSelectedDate(firstDate?.date ?? null);
    setSelectedTimeSlotId(firstDate?.timeSlots[0]?.id ?? null);
  };

  const handleSelectDate = (date: BloodTestDateOption) => {
    setSelectedDate(date.date);
    setSelectedTimeSlotId(date.timeSlots[0]?.id ?? null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedLabId || !selectedDate || !selectedTimeSlotId) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await createBloodTestOrder({
        labId: selectedLabId,
        bookingDate: selectedDate,
        timeSlotId: selectedTimeSlotId,
        panelType: "comprehensive",
      });

      router.push(`/blood-analysis/results/${order.testId}`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to confirm order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      <main className="mx-auto max-w-[1280px] px-6 pb-16 pt-14 lg:px-10">
        <Link
          href="/blood-analysis"
          className="inline-flex items-center gap-2 text-[18px] font-medium text-[#14b8a6] transition-colors hover:text-[#0f9a89]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Blood test page
        </Link>

        <section className="mt-8">
          <h1 className="text-[60px] font-semibold leading-none tracking-[-0.03em] text-[#202124]">
            Order a Blood Test
          </h1>
          <p className="mt-5 text-[24px] text-[#5f6368]">
            Easily book a blood test at a partnered clinic to get key biomarker data.
          </p>
        </section>

        {!isAuthenticated && (
          <div className="mt-12 rounded-[24px] border border-[#d9dde3] bg-white p-8 text-[#202124]">
            <h2 className="text-[28px] font-semibold">Login required</h2>
            <p className="mt-3 text-[18px] text-[#5f6368]">
              Sign in to book a blood test and save your report.
            </p>
            <Button
              asChild
              className="mt-6 h-[56px] rounded-[16px] bg-[#14b8a6] px-8 text-[18px] font-medium text-white hover:bg-[#0f9a89]"
            >
              <Link href="/login?redirect=%2Fblood-analysis%2Forder">Go to login</Link>
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <>
            {isLoading ? (
              <div className="mt-16 flex min-h-[320px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#14b8a6]" />
              </div>
            ) : error ? (
              <div className="mt-16 rounded-[24px] border border-[#f1c8c8] bg-[#fff6f6] p-8 text-[18px] text-[#9b3737]">
                {error}
              </div>
            ) : selectedLab ? (
              <>
                <section className="mt-20">
                  <h2 className="text-[68px] font-semibold leading-none tracking-[-0.04em] text-[#202124]">
                    Choose Partner Lab
                  </h2>

                  <div className="mt-10 space-y-7">
                    {labs.map((lab) => {
                      const isSelected = lab.id === selectedLabId;

                      return (
                        <button
                          key={lab.id}
                          type="button"
                          className={`flex w-full items-center justify-between rounded-[24px] border px-8 py-7 text-left transition-all ${
                            isSelected
                              ? "border-[#0d716d] bg-[#0d716d] text-white shadow-[0_18px_34px_rgba(13,113,109,0.18)]"
                              : "border-[#d0d5dd] bg-white text-[#202124]"
                          }`}
                          onClick={() => handleSelectLab(lab)}
                        >
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="text-[28px] font-semibold">{lab.name}</span>
                              <span className={`text-[18px] ${isSelected ? "text-white/90" : "text-[#202124]"}`}>
                                {" "}
                                |{" "}
                              </span>
                              <span className={`text-[18px] ${isSelected ? "text-white/90" : "text-[#202124]"}`}>
                                {lab.rating.toFixed(1)} ({lab.reviewCount} reviews)
                              </span>
                            </div>

                            <div className={`flex items-center gap-2 text-[18px] ${isSelected ? "text-white/90" : "text-[#5f6368]"}`}>
                              <MapPin className="h-5 w-5" />
                              {lab.addressLine}
                            </div>

                            <div
                              className={`inline-flex flex-wrap items-center gap-5 rounded-[18px] px-6 py-4 text-[18px] ${
                                isSelected ? "bg-[#ecf7f5] text-[#0d716d]" : "bg-[#f8fafc] text-[#374151]"
                              }`}
                            >
                              <span className="inline-flex items-center gap-3">
                                <Home className="h-5 w-5" />
                                {lab.serviceLabel}
                              </span>
                              <span className="text-[#9aa4b2]">|</span>
                              <span className="inline-flex items-center gap-3">
                                <Clock3 className="h-5 w-5" />
                                {lab.resultTimeLabel}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`flex h-14 w-14 items-center justify-center rounded-full border text-xl ${
                              isSelected
                                ? "border-white bg-white text-[#0d716d]"
                                : "border-[#adb5bd] bg-white text-transparent"
                            }`}
                          >
                            <Check className="h-7 w-7" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="mt-20">
                  <h2 className="text-[68px] font-semibold leading-none tracking-[-0.04em] text-[#202124]">
                    Choose Schedule
                  </h2>

                  <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex min-w-[340px] items-center justify-between rounded-[18px] border border-[#14b8a6] bg-white px-7 py-6 text-[22px] font-medium text-[#0d716d]">
                      <span>{selectedDateOption?.label ?? "Select date"}</span>
                      <CalendarDays className="h-6 w-6" />
                    </div>

                    <div className="flex flex-1 flex-wrap items-center gap-5">
                      {selectedLab.availableDates.map((date) => {
                        const isSelected = date.date === selectedDate;
                        return (
                          <button
                            key={date.date}
                            type="button"
                            className={`rounded-[18px] border px-6 py-4 text-[20px] font-medium transition-colors ${
                              isSelected
                                ? "border-[#0d716d] bg-[#0d716d] text-white"
                                : "border-[#14b8a6] bg-white text-[#0d716d]"
                            }`}
                            onClick={() => handleSelectDate(date)}
                          >
                            {date.label.split(" - ").pop()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    {(selectedDateOption?.timeSlots ?? []).map((timeSlot) => {
                      const isSelected = timeSlot.id === selectedTimeSlotId;
                      return (
                        <button
                          key={timeSlot.id}
                          type="button"
                          className={`min-w-[220px] rounded-[18px] border px-8 py-5 text-[22px] font-medium transition-colors ${
                            isSelected
                              ? "border-[#0d716d] bg-[#0d716d] text-white"
                              : "border-[#14b8a6] bg-white text-[#0d716d]"
                          }`}
                          onClick={() => setSelectedTimeSlotId(timeSlot.id)}
                        >
                          {timeSlot.label}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="mt-16 flex items-center justify-end gap-6">
                  <Link href="/blood-analysis" className="text-[20px] font-medium text-[#129b99]">
                    Cancel
                  </Link>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting || !selectedTimeSlotId}
                    className="h-[64px] rounded-[18px] bg-[#14b8a6] px-10 text-[22px] font-medium text-white hover:bg-[#0f9a89]"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Order"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-16 rounded-[24px] border border-[#d9dde3] bg-white p-8 text-[18px] text-[#5f6368]">
                No active labs are currently configured in admin.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

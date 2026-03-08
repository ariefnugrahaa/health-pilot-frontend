"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DatePickerProps extends Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect'> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  helperText,
  error,
  className,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLButtonElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync month with value
  React.useEffect(() => {
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const displayValue = value ? format(value, "PPP") : "";

  return (
    <div ref={containerRef} className={cn("grid gap-3 relative", className)}>
      {label && (
        <label className="text-[#101828] font-semibold text-sm">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={inputRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 rounded-2xl border text-left px-6 flex items-center justify-between transition-all duration-200",
          "hover:border-[#14b8a6]/50 hover:shadow-sm",
          isOpen
            ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20 shadow-md"
            : "border-[#EAECF0]",
          error && "border-red-500 focus:ring-red-500/20",
          !value && "text-[#9CA3AF]"
        )}
      >
        <span className={value ? "text-[#101828] text-lg" : "text-[#9CA3AF] text-lg"}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="h-5 w-5 text-[#667085]" />
      </button>

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-xs text-[#667085]">{helperText}</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl border border-[#EAECF0] shadow-xl overflow-hidden p-4">
            {/* Custom Navigation Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="h-9 w-9 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-[#667085]" />
              </button>
              <span className="font-bold text-[#101828]">
                {format(month, "MMMM yyyy")}
              </span>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="h-9 w-9 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-[#667085]" />
              </button>
            </div>

            {/* Calendar */}
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              showOutsideDays
              fixedWeeks
              classNames={{
                months: "flex flex-col",
                month: "flex flex-col gap-1",
                month_caption: "hidden", // Hide default caption
                caption_label: "hidden",
                weekdays: "flex flex-row mb-2",
                weekday: "w-10 h-8 text-xs font-bold text-[#667085] flex items-center justify-center",
                week: "flex flex-row",
                day: "p-0",
                day_button: cn(
                  "w-10 h-10 rounded-full text-sm font-medium transition-all duration-200",
                  "hover:bg-[#14b8a6]/10 hover:text-[#14b8a6]",
                  "focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/30"
                ),
                range_start: "bg-[#14b8a6] text-white rounded-full",
                range_end: "bg-[#14b8a6] text-white rounded-full",
                selected: "bg-[#14b8a6] text-white hover:bg-[#0d9488] hover:text-white rounded-full font-bold",
                today: "border-2 border-[#14b8a6] text-[#14b8a6] font-bold",
                outside: "text-[#D1D5DB]",
                disabled: "text-[#D1D5DB] cursor-not-allowed hover:bg-transparent",
              }}
              {...props}
            />

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EAECF0]">
              <button
                type="button"
                onClick={() => {
                  onChange?.(undefined);
                  setIsOpen(false);
                }}
                className="text-sm text-[#667085] hover:text-[#14b8a6] font-medium transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange?.(new Date());
                  setIsOpen(false);
                }}
                className="text-sm text-[#14b8a6] hover:text-[#0d9488] font-bold transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

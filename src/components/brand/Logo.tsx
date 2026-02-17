"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
    const dimensions = {
        sm: { container: "h-12 w-12", icon: "h-5 w-5", text: "text-xl", subtext: "text-[7px]" },
        md: { container: "h-16 w-16", icon: "h-6 w-6", text: "text-2xl", subtext: "text-[10px]" },
        lg: { container: "h-20 w-20", icon: "h-8 w-8", text: "text-3xl", subtext: "text-[12px]" },
    }[size];

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-1", className)}>
            <div className={cn("relative mb-1", dimensions.container)}>
                {/* The compass spikes - 8-point premium version */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform hover:rotate-45 duration-700">
                    {/* Vertical/Horizontal */}
                    <div className="absolute w-[2px] h-full bg-[#14b8a6]/40" />
                    <div className="absolute h-[2px] w-full bg-[#14b8a6]/40" />

                    {/* Diagonals */}
                    <div className="absolute w-[1.5px] h-[80%] bg-[#14b8a6]/30 rotate-45" />
                    <div className="absolute w-[1.5px] h-[80%] bg-[#14b8a6]/30 -rotate-45" />
                </div>

                {/* The main logo circle */}
                <div className="absolute inset-1 rounded-full bg-white border-[3px] border-[#14b8a6] flex items-center justify-center shadow-sm z-10">
                    <div className="relative flex items-center justify-center">
                        <div className={cn("text-[#14b8a6] fill-[#1dd3b0]/30", dimensions.icon)}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#14b8a6]">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        {/* Inner pulse circle */}
                        <div className="absolute h-2 w-2 rounded-full border border-white bg-[#14b8a6] bottom-0 right-0 shadow-sm animate-pulse" />
                    </div>
                </div>
            </div>

            {showText && (
                <div className="flex flex-col items-center">
                    <h2 className={cn("font-black text-[#101828] tracking-tighter uppercase leading-none", dimensions.text)}>
                        Health Pilot
                    </h2>
                    <p className={cn("font-bold text-[#667085] tracking-[0.2em] uppercase mt-1", dimensions.subtext)}>
                        Guidance you can act on.
                    </p>
                </div>
            )}
        </div>
    );
}

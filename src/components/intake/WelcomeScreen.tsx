"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Info, ShieldCheck, Stethoscope, CreditCard } from "lucide-react";

interface WelcomeScreenProps {
    onStart: () => void;
}

import { Logo } from "@/components/brand/Logo";


export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 overflow-visible">
            {/* Header Content */}
            <div className="text-center space-y-4 pt-4">
                <Logo />
                <h1 className="text-4xl md:text-[42px] font-black tracking-tight text-[#101828] leading-[1.1] max-w-3xl mx-auto">
                    Get personalized health guidance based on your unique profile
                </h1>
                <p className="text-[#6bb0a2]/80 font-medium text-lg max-w-2xl mx-auto leading-relaxed mt-4">
                    HealthPilot offers tailored insights into your well-being. Our system provides guidance-only, empowering you with knowledge. No preparation needed, just choose your path to start.
                </p>
            </div>

            {/* Path Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 relative px-2">

                {/* Path 1: Guided Check (Recommended) */}
                <div className="relative group cursor-pointer h-full" onClick={onStart}>
                    {/* Recommended Badge */}
                    <div className="absolute -top-3 right-4 z-30 flex items-center space-x-1 bg-[#d2f6ef] text-[#086375] px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider ring-4 ring-white shadow-sm border border-[#14b8a6]/20">
                        <Sparkles className="h-3 w-3 fill-current" />
                        <span>RECOMMENDED</span>
                    </div>

                    <div className="relative h-full bg-white border border-[#EAECF0] rounded-[28px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(20,184,166,0.1)] hover:border-[#14b8a6]/40 transition-all duration-500 overflow-hidden flex flex-col items-center text-center">
                        <div className="space-y-4 mb-2 flex-grow">
                            <h2 className="text-[26px] font-black text-[#101828] leading-tight">Start Guided Health Check</h2>
                            <p className="text-[#667085] leading-relaxed text-sm">
                                Answer a few questions to get personalized guidance. You can upload blood test results now or later if you have.
                            </p>
                        </div>
                        <div className="w-full pt-8 px-4">
                            <Button
                                className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl h-16 text-xl font-bold transition-all shadow-lg shadow-[#14b8a6]/20 flex items-center justify-center space-x-3 group"
                            >
                                <span className="group-hover:-translate-x-1 transition-transform">Get Started</span>
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Path 2: Blood Test Analysis */}
                <div className="relative group cursor-pointer h-full">
                    <div className="h-full bg-white border border-[#EAECF0] rounded-[28px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(234,236,240,0.1)] transition-all duration-500 flex flex-col items-center text-center">
                        <div className="space-y-4 mb-2 flex-grow">
                            <h2 className="text-[26px] font-black text-[#101828] leading-tight">Full Blood Test Analysis</h2>
                            <p className="text-[#667085] leading-relaxed text-sm">
                                Upload existing blood test or order a new test through HealthPilot, then return to continue your health check.
                            </p>
                        </div>
                        <div className="w-full pt-8 px-4">
                            <Button
                                variant="outline"
                                className="w-full border-2 border-[#d2f6ef] text-[#14b8a6] hover:bg-[#effefb] hover:border-[#14b8a6] rounded-2xl h-16 text-xl font-bold transition-all flex items-center justify-center space-x-3 group"
                            >
                                <span>Start Blood Test</span>
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-[#effefb] rounded-2xl p-5 flex items-center space-x-4 border border-[#d2f6ef] max-w-4xl mx-auto shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[#1dd3b0]/30 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-[#14b8a6] text-white flex items-center justify-center font-serif italic text-sm">i</div>
                </div>
                <p className="text-[#0c5446] text-sm md:text-base font-semibold leading-snug">
                    You can start without any preparation. The system will guide you step by step through the process.
                </p>
            </div>

            {/* Bottom Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-[#F2F4F7]">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-[#086375] flex items-center justify-center text-white shadow-md">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-black text-[#101828] text-sm tracking-tight">Not a medical diagnosis</h3>
                        <p className="text-[11px] font-bold text-[#667085] max-w-[180px]">Guidance only, empowering your health journey.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-[#086375] flex items-center justify-center text-white shadow-md">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-black text-[#101828] text-sm tracking-tight">Private and secure data</h3>
                        <p className="text-[11px] font-bold text-[#667085] max-w-[180px]">Your information is protected with advanced encryption.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-[#086375] flex items-center justify-center text-white shadow-md">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-black text-[#101828] text-sm tracking-tight">No payment required</h3>
                        <p className="text-[11px] font-bold text-[#667085] max-w-[180px]">Free to begin exploring your personalized health insights.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}



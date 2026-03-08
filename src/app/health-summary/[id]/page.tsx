"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIntake } from "@/lib/api/intake";
import { Header } from "@/components/layout/Header";
import { GeneratedHealthSummary } from "@/components/intake/GeneratedHealthSummary";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HealthSummaryDetailPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const summaryId = params.id;

  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!summaryId) return;

      try {
        const intake = await getIntake(summaryId);

        // Transform intake data to summary format
        setSummaryData({
          healthSummary: intake.recommendation?.content || "Your health summary",
          recommendations: intake.recommendation?.actions || [],
          warnings: intake.recommendation?.warnings || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load health summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [summaryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#14b8a6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Summary</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/health-history")}
            className="bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-md"
          >
            Back to Health History
          </button>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/health-history")}
          className="flex items-center text-[#14b8a6] hover:text-[#0d9488] text-sm font-medium mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Health History
        </button>

        {/* Health Summary Display */}
        <GeneratedHealthSummary
          data={summaryData}
          summaryId={summaryId}
          onSaveLater={() => {
            // Handle save/continue later
            router.push("/health-history");
          }}
        />
      </main>
    </div>
  );
}

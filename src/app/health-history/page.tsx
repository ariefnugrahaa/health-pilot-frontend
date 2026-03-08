"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIntakes } from "@/lib/api/intake";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, FileText, Syringe, ClipboardList, ArrowRight } from "lucide-react";

interface HealthHistoryItem {
  id: string;
  date: string;
  description: string;
  type: "guided_health_check" | "blood_test";
}

export default function HealthHistoryPage() {
  const [healthHistory, setHealthHistory] = useState<HealthHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        const intakes = await getIntakes();

        // Transform intakes to health history format
        const history = intakes.map((intake: any) => ({
          id: intake.id,
          date: intake.completedAt
            ? new Date(intake.completedAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : new Date(intake.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
          description:
            intake.type === "blood_test"
              ? "Blood test enhanced"
              : "Guided health check",
          type: intake.type || "guided_health_check",
        }));

        setHealthHistory(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load health history");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthHistory();
  }, []);

  const getIconForType = (type: HealthHistoryItem["type"]) => {
    switch (type) {
      case "blood_test":
        return <Syringe className="w-5 h-5 text-gray-600" />;
      case "guided_health_check":
      default:
        return <ClipboardList className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center text-[#14b8a6] hover:text-[#0d9488] text-sm font-medium mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Homepage
        </Link>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Health History
          </h1>
          <p className="text-gray-600">
            View and revisit your past health summaries
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#14b8a6]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mt-6">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && healthHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No health history yet
            </h3>
            <p className="text-gray-600 mb-6">
              Complete a health check to see your first summary here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-md"
            >
              Start Health Check
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Health History List */}
        {!loading && !error && healthHistory.length > 0 && (
          <div className="space-y-4 mt-6">
            {healthHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-4">
                      {getIconForType(item.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.date}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/health-summary/${item.id}`}
                    className="px-4 py-2 border border-[#14b8a6] text-[#14b8a6] rounded-md hover:bg-[#14b8a6]/10 transition-colors flex items-center whitespace-nowrap"
                  >
                    View Summary
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

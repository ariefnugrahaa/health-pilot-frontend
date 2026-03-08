"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIntakes } from "@/lib/api/intake";
import { Header } from "@/components/layout/Header";
import {
  ArrowLeft,
  FileText,
  Syringe,
  ChevronRight,
  ChevronDown,
  Filter,
  ArrowUpDown,
} from "lucide-react";

interface HealthReport {
  id: string;
  date: string;
  createdAt: string;
  type: "guided_health_check" | "blood_test";
  status: string;
  isLatest: boolean;
}

export default function HealthReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<"all" | "guided_health_check" | "blood_test">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const intakes = await getIntakes();

        // Transform intakes to reports format
        const reportsData: HealthReport[] = intakes.map((intake: any, index: number) => ({
          id: intake.id,
          date: intake.completedAt
            ? new Date(intake.completedAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : new Date(intake.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
          createdAt: intake.completedAt || intake.createdAt,
          type: intake.type || "guided_health_check",
          status: intake.status,
          isLatest: index === 0,
        }));

        setReports(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load health reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter and sort reports
  const filteredReports = reports
    .filter((report) => filterBy === "all" || report.type === filterBy)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Separate current and past reports
  const currentReport = filteredReports.find((r) => r.isLatest && filterBy === "all");
  const pastReports = filteredReports.filter((r) => r !== currentReport);

  const getIconForType = (type: HealthReport["type"]) => {
    switch (type) {
      case "blood_test":
        return <Syringe className="w-5 h-5 text-gray-600" />;
      case "guided_health_check":
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: HealthReport["type"]) => {
    switch (type) {
      case "blood_test":
        return "Blood test enhanced";
      case "guided_health_check":
      default:
        return "Guided health check";
    }
  };

  const ReportCard = ({ report, showLatest = false }: { report: HealthReport; showLatest?: boolean }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
            {getIconForType(report.type)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-900 font-medium">{report.date}</span>
            {showLatest && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Latest
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500">{getTypeLabel(report.type)}</span>
          <button
            onClick={() => router.push(`/health-summary/${report.id}`)}
            className="flex items-center text-[#14b8a6] hover:text-[#0d9488] font-medium text-sm transition-colors"
          >
            View Summary
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Back Navigation */}
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </Link>

        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Health Reports
            </h1>
            <p className="text-gray-500">
              View and manage your latest and past health reports
            </p>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowSortDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter by: {filterBy === "all" ? "All" : filterBy === "guided_health_check" ? "Health Check" : "Blood Test"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setFilterBy("all");
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${filterBy === "all" ? "text-[#14b8a6] font-medium" : "text-gray-700"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setFilterBy("guided_health_check");
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${filterBy === "guided_health_check" ? "text-[#14b8a6] font-medium" : "text-gray-700"}`}
                  >
                    Health Check
                  </button>
                  <button
                    onClick={() => {
                      setFilterBy("blood_test");
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${filterBy === "blood_test" ? "text-[#14b8a6] font-medium" : "text-gray-700"}`}
                  >
                    Blood Test
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowFilterDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort: {sortBy === "newest" ? "Newest first" : "Oldest first"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${sortBy === "newest" ? "text-[#14b8a6] font-medium" : "text-gray-700"}`}
                  >
                    Newest first
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${sortBy === "oldest" ? "text-[#14b8a6] font-medium" : "text-gray-700"}`}
                  >
                    Oldest first
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#14b8a6]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
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
        {!loading && !error && filteredReports.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No health reports yet
            </h3>
            <p className="text-gray-500 mb-6">
              Complete a health check to see your first report here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start Health Check
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}

        {/* Reports List */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className="space-y-8">
            {/* Current Report */}
            {currentReport && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Current Report
                </h2>
                <ReportCard report={currentReport} showLatest />
              </div>
            )}

            {/* Past Reports */}
            {pastReports.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Past Reports
                </h2>
                <div className="space-y-3">
                  {pastReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            )}

            {/* If only showing filtered results (no current/past separation) */}
            {!currentReport && filteredReports.length > 0 && (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

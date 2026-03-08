import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Activity, FileText, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back 👋 Here's where you left off
          </h1>
          <p className="text-gray-600">
            Based on your last health check, you can continue your journey or start a new one
            anytime.
          </p>
        </div>

        {/* Health Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Health Summary
              </h3>
              <p className="text-gray-500 mb-6">Last updated: Jan 30, 2026</p>
              <Link
                href="/health-history"
                className="inline-flex items-center bg-[#14b8a6] hover:bg-[#0d9488] text-white font-medium py-3 px-6 rounded-md"
              >
                View Summary
                <Activity className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-48 bg-[#F0FDF9] rounded-2xl flex items-center justify-center">
                <FileText className="w-16 h-16 text-[#14b8a6]/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Guided Health Check Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-medium px-2.5 py-0.5 rounded-full">
                RECOMMENDED
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Guided Health Check
            </h3>
            <p className="text-gray-600 mb-6">
              Answer a few questions to get personalized guidance. You can upload
              blood test results now or later if you have.
            </p>
            <Link
              href="/"
              className="inline-flex items-center border border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 font-medium py-2 px-6 rounded-md"
            >
              Get Started
              <Plus className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Blood Test Analysis Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Full Blood Test Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Upload existing blood test or order a new test through HealthPilot,
              then return to continue your health check.
            </p>
            <Link
              href="/blood-test"
              className="inline-flex items-center border border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 font-medium py-2 px-6 rounded-md"
            >
              Start Blood Test
              <Plus className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem
            icon={<Activity className="w-6 h-6" />}
            title="Not a medical diagnosis"
            description="Guidance only, empowering your health journey."
          />
          <FeatureItem
            icon={<FileText className="w-6 h-6" />}
            title="Private and secure data"
            description="Your information is protected with advanced encryption."
          />
          <FeatureItem
            icon={<Activity className="w-6 h-6" />}
            title="No payment required"
            description="Free to begin exploring your personalized health insights."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

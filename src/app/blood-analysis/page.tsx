"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, ArrowRight, FileUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/core/stores/auth.store";
import { uploadBloodTestResults } from "@/lib/api/blood-tests";
import { BloodTestUploadModal } from "@/components/blood-analysis/BloodTestUploadModal";

function BloodAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isUploadRequested = searchParams.get("upload") === "1";
  const isModalOpen = isUploadModalOpen || isUploadRequested;

  const handleFilesAdded = (incomingFiles: FileList | File[]) => {
    const nextFiles = Array.from(incomingFiles);
    setUploadError(null);
    setSelectedFiles((currentFiles) => {
      const fileMap = new Map(currentFiles.map((file) => [`${file.name}-${file.size}`, file]));
      nextFiles.forEach((file) => {
        fileMap.set(`${file.name}-${file.size}`, file);
      });
      return Array.from(fileMap.values());
    });
  };

  const handleCloseModal = () => {
    if (isUploading) {
      return;
    }

    setIsUploadModalOpen(false);
    setSelectedFiles([]);
    setUploadError(null);

    if (isUploadRequested) {
      router.replace("/blood-analysis");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("Select at least one PNG, JPG, or PDF file to continue.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadResult = await uploadBloodTestResults({
        fileNames: selectedFiles.map((file) => file.name),
        panelType: "comprehensive",
      });

      router.push(
        `/blood-analysis/intake/questions?bloodTestId=${uploadResult.testId}&source=upload`
      );
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload blood test results"
      );
      setIsUploading(false);
    }
  };

  const loginHref = `/login?redirect=${encodeURIComponent("/blood-analysis?upload=1")}`;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white">
        <Header />

        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-[15px] font-medium text-[#14b8a6] transition-colors hover:text-[#0d9488]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
              Full Blood Test Analysis
            </h1>
            <p className="mt-3 text-lg text-[#667085]">
              Use your blood test data to get deeper, biomarker-based insights.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#EAECF0] bg-white p-10 text-center shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex items-center justify-center">
              <FileUp className="h-14 w-14 text-[#086375]" strokeWidth={2} />
            </div>

            <h2 className="mb-2 text-[22px] font-bold text-[#101828]">
              Upload existing blood test
            </h2>
            <p className="mb-8 min-h-[48px] text-[15px] leading-relaxed text-[#667085]">
              You already have recent
              <br />
              results (PDF/Image)
            </p>

            <Button
              variant="outline"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#14b8a6] px-6 text-[15px] font-semibold text-[#14b8a6] transition-all hover:bg-[#effefb]"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload results
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#EAECF0] bg-white p-10 text-center shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex items-center justify-center">
              <Activity className="h-14 w-14 text-[#086375]" strokeWidth={2} />
            </div>

            <h2 className="mb-2 text-[22px] font-bold text-[#101828]">
              Order a blood test
            </h2>
            <p className="mb-8 min-h-[48px] text-[15px] leading-relaxed text-[#667085]">
              We&apos;ll guide you to a partner lab and notify you when
              <br />
              results are ready
            </p>

            <Button
              asChild
              variant="outline"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#14b8a6] px-6 text-[15px] font-semibold text-[#14b8a6] transition-all hover:bg-[#effefb]"
            >
              <Link href="/blood-analysis/order">
                Order a Blood Test
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <BloodTestUploadModal
        isOpen={isModalOpen}
        isAuthenticated={isAuthenticated}
        files={selectedFiles}
        error={uploadError}
        isUploading={isUploading}
        loginHref={loginHref}
        onClose={handleCloseModal}
        onFilesAdded={handleFilesAdded}
        onUpload={handleUpload}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white">
        <Header />
      </div>
      <div className="flex items-center justify-center py-40">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    </div>
  );
}

export default function BloodAnalysisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BloodAnalysisContent />
    </Suspense>
  );
}

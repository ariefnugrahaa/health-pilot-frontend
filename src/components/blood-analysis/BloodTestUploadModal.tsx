"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BloodTestUploadModalProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  files: File[];
  error: string | null;
  isUploading: boolean;
  loginHref: string;
  onClose: () => void;
  onFilesAdded: (files: FileList | File[]) => void;
  onUpload: () => void;
}

const ACCEPTED_FILE_TYPES = ".png,.jpg,.jpeg,.pdf";

export function BloodTestUploadModal({
  isOpen,
  isAuthenticated,
  files,
  error,
  isUploading,
  loginHref,
  onClose,
  onFilesAdded,
  onUpload,
}: BloodTestUploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const helperText = useMemo(() => {
    if (files.length === 0) {
      return "Supported format: PNG, JPG, PDF";
    }

    return `${files.length} file${files.length > 1 ? "s" : ""} selected`;
  }, [files.length]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8">
      <div className="w-full max-w-[800px] rounded-[24px] bg-white p-6 shadow-[0_24px_72px_rgba(16,24,40,0.24)] md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#202124] md:text-[34px]">
              Upload Your Blood Test Results
            </h2>
            <p className="mt-3 text-[16px] text-[#5f6368]">
              Add your latest lab report to include biomarker data in your health check.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#202124] transition-colors hover:bg-[#f3f4f6]"
            aria-label="Close upload modal"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-[20px] border border-[#d9dde3] bg-[#f8fafc] p-6 md:p-8">
            <h3 className="text-[24px] font-semibold text-[#202124]">Login required</h3>
            <p className="mt-3 max-w-2xl text-[18px] leading-8 text-[#5f6368]">
              Sign in to upload your blood test and continue with the blood-enhanced intake flow.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-[56px] rounded-[16px] px-6 text-[18px] font-medium text-[#129b99] hover:bg-[#effcfb]"
              >
                Cancel
              </Button>
              <Button
                asChild
                className="h-[56px] rounded-[16px] bg-[#14b8a6] px-6 text-[18px] font-medium text-white hover:bg-[#0f9a89]"
              >
                <Link href={loginHref}>Go to login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) {
                  onFilesAdded(event.target.files);
                  event.target.value = "";
                }
              }}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.files?.length) {
                  onFilesAdded(event.dataTransfer.files);
                }
              }}
              className="mt-8 flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-[#cfe8e4] bg-[#e9f8f5] px-6 py-10 text-center transition-colors hover:bg-[#e2f5f1] md:px-10 md:py-14"
            >
              <UploadCloud className="h-14 w-14 text-[#202124]" strokeWidth={1.8} />
              <p className="mt-6 text-[24px] font-semibold text-[#202124]">Drop files here</p>
              <p className="mt-2 text-[18px] text-[#5f6368]">{helperText}</p>
              <p className="mt-5 text-[18px] font-semibold text-[#202124]">OR</p>
              <span className="mt-4 text-[18px] font-semibold text-[#0f8e88] underline underline-offset-4">
                Browse files
              </span>
            </button>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex items-center gap-3 rounded-[16px] border border-[#d9dde3] bg-[#f8fafc] px-4 py-3 text-left"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-[#129b99]" />
                    <div className="min-w-0">
                      <p className="truncate text-[16px] font-medium text-[#202124]">{file.name}</p>
                      <p className="text-[14px] text-[#667085]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-[16px] border border-[#f1c8c8] bg-[#fff6f6] px-4 py-3 text-[15px] text-[#9b3737]">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isUploading}
                className="h-[56px] rounded-[16px] px-6 text-[18px] font-medium text-[#129b99] hover:bg-[#effcfb]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onUpload}
                disabled={isUploading || files.length === 0}
                className="h-[56px] rounded-[16px] bg-[#14b8a6] px-6 text-[18px] font-medium text-white hover:bg-[#0f9a89]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

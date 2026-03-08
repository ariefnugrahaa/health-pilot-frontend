import { api } from "./client";

export interface BloodTestTimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
}

export interface BloodTestDateOption {
  date: string;
  label: string;
  timeSlots: BloodTestTimeSlot[];
}

export interface BloodTestLabOption {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
  addressLine: string;
  serviceTypes: Array<"HOME_VISIT" | "ON_SITE">;
  serviceLabel: string;
  resultTimeLabel: string;
  rating: number;
  reviewCount: number;
  availableDates: BloodTestDateOption[];
}

export interface BloodTestOrderOptions {
  enabled: boolean;
  labs: BloodTestLabOption[];
}

export interface CreateBloodTestOrderPayload {
  labId: string;
  bookingDate: string;
  timeSlotId: string;
  panelType?: "targeted" | "goal-based" | "comprehensive";
}

export interface CreateBloodTestOrderResponse {
  bookingId: string;
  testId: string;
  bookingStatus: string;
}

export interface UploadBloodTestResultsPayload {
  fileNames: string[];
  panelType?: "targeted" | "goal-based" | "comprehensive";
}

export interface UploadBloodTestResultsResponse {
  testId: string;
  status: string;
  uploadedFiles: string[];
}

export interface BloodTestReportBiomarker {
  id: string;
  code: string;
  name: string;
  displayName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: "IN_RANGE" | "SLIGHTLY_HIGH" | "SLIGHTLY_LOW";
  detail: string;
}

export interface BloodTestReport {
  testId: string;
  intakeAssignment: string;
  overallHeadline: string;
  overallSummary: string;
  counts: {
    inRange: number;
    slightlyHigh: number;
    slightlyLow: number;
  };
  biomarkers: BloodTestReportBiomarker[];
  featuredBiomarkerCodes: string[];
  booking: {
    id: string | null;
    labName: string;
    labAddress: string | null;
    bookingDate: string | null;
    timeSlot: string | null;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

export async function getBloodTestOrderOptions(): Promise<BloodTestOrderOptions> {
  const response = await api.get("/api/v1/blood-tests/order-options");

  const data: ApiResponse<BloodTestOrderOptions> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch blood test order options");
  }

  return data.data;
}

export async function createBloodTestOrder(
  payload: CreateBloodTestOrderPayload
): Promise<CreateBloodTestOrderResponse> {
  const response = await api.post("/api/v1/blood-tests/orders", payload);

  const data: ApiResponse<CreateBloodTestOrderResponse> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to create blood test order");
  }

  return data.data;
}

export async function uploadBloodTestResults(
  payload: UploadBloodTestResultsPayload
): Promise<UploadBloodTestResultsResponse> {
  const response = await api.post("/api/v1/blood-tests/uploads", payload);

  const data: ApiResponse<UploadBloodTestResultsResponse> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to upload blood test results");
  }

  return data.data;
}

export async function getBloodTestReport(testId: string): Promise<BloodTestReport> {
  const response = await api.get(`/api/v1/blood-tests/${testId}/report`);

  const data: ApiResponse<BloodTestReport> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to fetch blood test report");
  }

  return data.data;
}

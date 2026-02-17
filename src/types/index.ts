export type UserRole = "patient" | "provider" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodTest {
  id: string;
  userId: string;
  testDate: string;
  testName: string;
  results: BloodTestResult[];
  labPartner?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface BloodTestResult {
  name: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: "normal" | "low" | "high";
  interpretation?: string;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  category: "supplement" | "medication" | "lifestyle" | "procedure";
  dosage?: string;
  frequency?: string;
  duration?: string;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  credentials: string[];
  practiceName?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  isVerified: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  type: "consultation" | "followup" | "procedure" | "emergency";
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes?: string;
}

export interface Diagnostic {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  confidence: number;
  recommendations: string[];
  requiresFollowUp: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  totalTests: number;
  activeTreatments: number;
  upcomingAppointments: number;
  healthScore: number;
  trends: {
    date: string;
    score: number;
  }[];
}

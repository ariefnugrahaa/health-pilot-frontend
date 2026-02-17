/**
 * Health Intake API Service
 * Handles communication with backend intake endpoints
 */

import { useAuthStore } from "@/core/stores/auth.store";

export interface IntakeFormData {
  // Biometrics & Demographics (Flat structure from Wizard)
  height?: string | number;
  weight?: string | number;
  dob?: string | Date; // Date string YYYY-MM-DD
  gender?: string; // 'male' | 'female' etc.
  goal?: string; // primary goal

  medicalHistory?: {
    conditions?: string[];
    currentMedications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
  };
  familyHistory?: {
    conditions?: Array<{
      condition: string;
      relation: string;
    }>;
  };
  symptoms?: Array<{
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
    duration: string;
    frequency: string;
  }>;
  goals?: Array<{
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  lifestyle?: {
    smokingStatus: 'never' | 'former' | 'current';
    alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
    exerciseFrequency: 'none' | 'light' | 'moderate' | 'active' | 'very_active';
    dietType: string;
    sleepHours: number;
    stressLevel: 'low' | 'moderate' | 'high';
  };
  preferences?: {
    riskTolerance: 'low' | 'medium' | 'high';
    budgetSensitivity: 'low' | 'medium' | 'high';
    preferSubscription: boolean;
    deliveryPreference: 'home' | 'clinic' | 'pharmacy';
  };

  // Also support dynamic keys from wizard steps
  [key: string]: any;
}

export interface CreateIntakeResponse {
  id: string;
  status: string;
  createdAt: string;
}

export interface CompleteIntakeResponse {
  intakeId: string;
  status: string;
  completedAt: string | null;
  recommendationId: string;
  healthSummary: string;
  recommendations: string[];
  warnings: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

/**
 * Helper to get headers with auth token
 */
const getHeaders = () => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Create a new health intake
 */
export async function createIntake(formData: IntakeFormData): Promise<CreateIntakeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/intakes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create intake' }));
    throw new Error(error.error?.message || error.message || 'Failed to create intake');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Complete intake and trigger AI health summary generation
 */
export async function completeIntake(intakeId: string): Promise<CompleteIntakeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/intakes/${intakeId}/complete`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to complete intake' }));
    throw new Error(error.error?.message || error.message || 'Failed to complete intake');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get intake by ID
 */
export async function getIntake(intakeId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/v1/intakes/${intakeId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch intake' }));
    throw new Error(error.error?.message || error.message || 'Failed to fetch intake');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get user's intakes
 */
export async function getIntakes(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/intakes`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch intakes' }));
    throw new Error(error.error?.message || error.message || 'Failed to fetch intakes');
  }

  const data = await response.json();
  return data.data;
}


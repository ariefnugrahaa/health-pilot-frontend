/**
 * Pending Intake Utilities
 * Handles saving and restoring pending intake data for anonymous users
 */

export interface PendingIntakeData {
  formData: any;
  intakeId?: string | null;
  summaryData?: any;
}

const PENDING_INTAKE_KEY = 'pendingIntake';

/**
 * Save pending intake data to session storage
 */
export function savePendingIntake(data: PendingIntakeData): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(PENDING_INTAKE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save pending intake:', error);
  }
}

/**
 * Get pending intake data from session storage
 */
export function getPendingIntake(): PendingIntakeData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = sessionStorage.getItem(PENDING_INTAKE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get pending intake:', error);
    return null;
  }
}

/**
 * Clear pending intake data from session storage
 */
export function clearPendingIntake(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(PENDING_INTAKE_KEY);
  } catch (error) {
    console.error('Failed to clear pending intake:', error);
  }
}

/**
 * Check if there is a pending intake
 */
export function hasPendingIntake(): boolean {
  return getPendingIntake() !== null;
}

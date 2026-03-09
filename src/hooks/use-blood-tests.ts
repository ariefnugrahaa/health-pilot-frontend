import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBloodTestOrderOptions,
  createBloodTestOrder,
  uploadBloodTestResults,
  getBloodTestReport,
  type CreateBloodTestOrderPayload,
  type CreateBloodTestOrderResponse,
  type UploadBloodTestResultsPayload,
  type UploadBloodTestResultsResponse,
  type BloodTestReport,
  type BloodTestOrderOptions,
} from '@/lib/api/blood-tests';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/core/stores/auth.store';

// ============================================
// Query Keys
// ============================================

export const bloodTestKeys = {
  all: ['blood-tests'] as const,
  orderOptions: () => [...bloodTestKeys.all, 'order-options'] as const,
  orders: () => [...bloodTestKeys.all, 'orders'] as const,
  report: (testId: string) => [...bloodTestKeys.all, 'report', testId] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Get blood test order options (labs, dates, time slots)
 */
export function useBloodTestOrderOptions() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<BloodTestOrderOptions, Error>({
    queryKey: bloodTestKeys.orderOptions(),
    queryFn: getBloodTestOrderOptions,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - labs don't change often
  });
}

/**
 * Get blood test report
 */
export function useBloodTestReport(testId: string | undefined) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<BloodTestReport, Error>({
    queryKey: bloodTestKeys.report(testId || ''),
    queryFn: () => getBloodTestReport(testId!),
    enabled: isAuthenticated && !!testId,
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create a blood test order
 */
export function useCreateBloodTestOrder() {
  const queryClient = useQueryClient();

  return useMutation<CreateBloodTestOrderResponse, Error, CreateBloodTestOrderPayload>({
    mutationFn: (payload) => createBloodTestOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodTestKeys.orders() });
      toast.success('Blood test booked successfully');
    },
    onError: (error) => {
      toast.error('Failed to book blood test', { description: error.message });
    },
  });
}

/**
 * Upload blood test results
 */
export function useUploadBloodTestResults() {
  const queryClient = useQueryClient();

  return useMutation<UploadBloodTestResultsResponse, Error, UploadBloodTestResultsPayload>({
    mutationFn: (payload) => uploadBloodTestResults(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodTestKeys.orders() });
      toast.success('Blood test results uploaded');
    },
    onError: (error) => {
      toast.error('Failed to upload results', { description: error.message });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createIntake,
  completeIntake,
  getIntake,
  getIntakes,
  type IntakeFormData,
  type CreateIntakeResponse,
  type CompleteIntakeResponse,
} from '@/lib/api/intake';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/core/stores/auth.store';

// ============================================
// Query Keys
// ============================================

export const intakeKeys = {
  all: ['intakes'] as const,
  lists: () => [...intakeKeys.all, 'list'] as const,
  list: (filters?: { status?: string }) => [...intakeKeys.lists(), filters] as const,
  details: () => [...intakeKeys.all, 'detail'] as const,
  detail: (id: string) => [...intakeKeys.details(), id] as const,
  config: () => [...intakeKeys.all, 'config'] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Get all user intakes
 */
export function useIntakes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: intakeKeys.lists(),
    queryFn: getIntakes,
    enabled: isAuthenticated,
  });
}

/**
 * Get a single intake by ID
 */
export function useIntake(id: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: intakeKeys.detail(id),
    queryFn: () => getIntake(id),
    enabled: isAuthenticated && !!id,
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create a new intake
 */
export function useCreateIntake() {
  const queryClient = useQueryClient();

  return useMutation<CreateIntakeResponse, Error, IntakeFormData>({
    mutationFn: (formData) => createIntake(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() });
      toast.success('Health intake created');
    },
    onError: (error) => {
      toast.error('Failed to create intake', { description: error.message });
    },
  });
}

/**
 * Complete an intake and generate health summary
 */
export function useCompleteIntake() {
  const queryClient = useQueryClient();

  return useMutation<CompleteIntakeResponse, Error, string>({
    mutationFn: (intakeId) => completeIntake(intakeId),
    onSuccess: (data, intakeId) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(intakeId) });
      toast.success('Health summary generated');
    },
    onError: (error) => {
      toast.error('Failed to complete intake', { description: error.message });
    },
  });
}

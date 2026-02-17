import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  category: 'blood' | 'vital' | 'supplement' | 'diagnostic';
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'treatment' | 'supplement' | 'lifestyle' | 'followup';
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: string;
  dueDate?: string;
}

export interface DashboardState {
  metrics: HealthMetric[];
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  
  setMetrics: (metrics: HealthMetric[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  addMetric: (metric: HealthMetric) => void;
  updateMetric: (id: string, updates: Partial<HealthMetric>) => void;
  removeMetric: (id: string) => void;
  updateRecommendationStatus: (id: string, status: Recommendation['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      metrics: [],
      recommendations: [],
      loading: false,
      error: null,

      setMetrics: (metrics) => set({ metrics }),
      setRecommendations: (recommendations) => set({ recommendations }),
      
      addMetric: (metric) => set((state) => ({
        metrics: [...state.metrics, metric],
      })),
      
      updateMetric: (id, updates) => set((state) => ({
        metrics: state.metrics.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      })),
      
      removeMetric: (id) => set((state) => ({
        metrics: state.metrics.filter((m) => m.id !== id),
      })),
      
      updateRecommendationStatus: (id, status) => set((state) => ({
        recommendations: state.recommendations.map((r) =>
          r.id === id ? { ...r, status } : r
        ),
      })),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      clearData: () => set({
        metrics: [],
        recommendations: [],
        loading: false,
        error: null,
      }),
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

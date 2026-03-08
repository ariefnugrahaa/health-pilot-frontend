import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login, register, logout as logoutApi, refreshToken as refreshTokenApi, type LoginCredentials, type RegisterData, type User } from "@/lib/api/auth";

export type UserRole = "patient" | "provider" | "admin";

export interface UserState {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface AuthStore {
  user: UserState | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  setUser: (user: UserState | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

const mapUserData = (userData: User): UserState => ({
  id: userData.id,
  email: userData.email,
  firstName: userData.firstName,
  lastName: userData.lastName,
  name: userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || userData.lastName || undefined,
  role: userData.role as UserRole,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await login(credentials);

          set({
            user: mapUserData(response.user),
            token: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await register(data);

          set({
            user: mapUserData(response.user),
            token: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) {
            await logoutApi(token);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          return false;
        }

        try {
          const response = await refreshTokenApi(refreshToken);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
          });
          return true;
        } catch (error) {
          console.error('Token refresh error:', error);
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      setUser: (user: UserState | null) => set({ user }),
      setToken: (token: string | null) => set({ token, isAuthenticated: !!token }),
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
      setLoading: (isLoading: boolean) => set({ isLoading }),

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

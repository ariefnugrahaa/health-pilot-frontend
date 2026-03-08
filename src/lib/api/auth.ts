/**
 * Authentication API Service
 * Handles communication with backend auth endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

export interface RegisterResponse {
  user: User;
  tokens: TokenPair;
}

export interface AnonymousSessionResponse {
  userId: string;
  tokens: TokenPair;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.error?.message || error.message || 'Login failed');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.error?.message || error.message || 'Registration failed');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create anonymous session
 */
export async function createAnonymousSession(): Promise<AnonymousSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/anonymous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create session' }));
    throw new Error(error.error?.message || error.message || 'Failed to create session');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Token refresh failed' }));
    throw new Error(error.error?.message || error.message || 'Token refresh failed');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Logout
 */
export async function logout(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Logout failed' }));
    throw new Error(error.error?.message || error.message || 'Logout failed');
  }
}

/**
 * Link anonymous intake to authenticated user
 */
export async function linkAnonymousIntake(params: {
  anonymousIntakeId: string;
  anonymousUserId?: string;
  token?: string | null;
}): Promise<{ intakeId: string; message: string }> {
  const { token, ...bodyParams } = params;
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/link-anonymous-intake`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(bodyParams),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to link intake' }));
    throw new Error(error.error?.message || error.message || 'Failed to link intake');
  }

  const data = await response.json();
  return data.data;
}

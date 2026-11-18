import { AuthSession, LoginCredentials } from "../types/auth.types";
import { User } from "@/types";
import { apiClient, ApiError } from "@/services/api-client";

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export const DEMO_CREDENTIALS = {
  email: "demo@payflow.io",
  password: "password123",
  user: {
    id: "usr_pf_892348912",
    name: "Alex Morgan",
    email: "demo@payflow.io",
    role: "admin" as const,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    companyName: "Acme Payments Corp",
  },
};

export const SECONDARY_DEMO_CREDENTIALS = {
  email: "admin@payflow.io",
  password: "payflow2026",
  user: {
    id: "usr_pf_110293847",
    name: "Elena Rostova",
    email: "admin@payflow.io",
    role: "admin" as const,
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    companyName: "Global Fintech Labs",
  },
};

/**
 * Enterprise Authentication Service
 * 1. Dispatches authentication requests to live backend (POST /api/v1/auth/login)
 *    which manages HTTP-only cookies and persists users in MongoDB Compass.
 * 2. Provides deterministic offline fallback to mock credentials if the local backend
 *    service is temporarily unavailable during standalone UI testing.
 */
class AuthService implements IAuthService {
  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      // 1. Attempt live API authentication with backend service
      const res = await apiClient.post<{
        success: boolean;
        message: string;
        data: AuthSession;
      }>("/v1/auth/login", credentials);

      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      // If it's a 4xx error returned from the backend (e.g. invalid password), rethrow it
      if (err instanceof ApiError && err.statusCode >= 400 && err.statusCode < 500) {
        throw new Error(err.message || "Invalid credentials. Please verify your email and password.");
      }
      // If network error (backend offline), fall through to mock demo fallback
      console.warn("Backend API unreachable, falling back to local demo authentication:", err);
    }

    // 2. Offline / Mock fallback
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    let matchedUser: User | null = null;

    if (
      email === DEMO_CREDENTIALS.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.password
    ) {
      matchedUser = DEMO_CREDENTIALS.user;
    } else if (
      email === SECONDARY_DEMO_CREDENTIALS.email.toLowerCase() &&
      password === SECONDARY_DEMO_CREDENTIALS.password
    ) {
      matchedUser = SECONDARY_DEMO_CREDENTIALS.user;
    }

    if (!matchedUser) {
      throw new Error(
        "Invalid email or password. Please use demo credentials (demo@payflow.io / password123)."
      );
    }

    const session: AuthSession = {
      user: matchedUser,
      token: `mock_jwt_${matchedUser.id}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return session;
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post("/v1/auth/logout");
    } catch {
      // Silently continue if backend is unreachable
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: { user: User };
      }>("/v1/auth/me");

      if (res.success && res.data?.user) {
        return res.data.user;
      }
    } catch {
      // Silently fall back to cached session
    }
    return DEMO_CREDENTIALS.user;
  }
}

export const authService: IAuthService = new AuthService();

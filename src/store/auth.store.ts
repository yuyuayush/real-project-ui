import { create } from "zustand";
import { User } from "@/types";
import { AuthSession } from "@/features/auth/types/auth.types";
import { setAuthCookie, removeAuthCookie } from "@/lib/cookies";

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setAuth: (session: AuthSession) => void;
  logout: () => void;
  initAuth: () => void;
}

const STORAGE_KEY = "payflow_auth_session";

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,

  setAuth: (session: AuthSession) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setAuthCookie(session.token);
      } catch (e) {
        console.error("Failed to persist auth session to storage:", e);
      }
    }
    set({
      user: session.user,
      token: session.token,
      isAuthenticated: true,
      isLoading: false,
      isHydrated: true,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
        removeAuthCookie();
      } catch (e) {
        console.error("Failed to remove auth session from storage:", e);
      }
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: true,
    });
  },

  initAuth: () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        // Verify expiry
        if (new Date(session.expiresAt) > new Date()) {
          setAuthCookie(session.token);
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isHydrated: true,
            isLoading: false,
          });
          return;
        } else {
          localStorage.removeItem(STORAGE_KEY);
          removeAuthCookie();
        }
      }
    } catch (e) {
      console.error("Failed to parse stored auth session:", e);
      localStorage.removeItem(STORAGE_KEY);
      removeAuthCookie();
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
      isLoading: false,
    });
  },
}));

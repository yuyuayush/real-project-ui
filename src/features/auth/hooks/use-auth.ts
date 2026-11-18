"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "../services/auth.service";
import { LoginCredentials } from "../types/auth.types";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, isHydrated, setAuth, logout, initAuth } =
    useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      initAuth();
    }
  }, [isHydrated, initAuth]);

  const login = async (credentials: LoginCredentials) => {
    useAuthStore.setState({ isLoading: true });
    try {
      const session = await authService.login(credentials);
      setAuth(session);
      return session;
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.push("/login");
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,
    login,
    logout: handleLogout,
  };
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "./login-form";

export function LoginView() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, router]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/80 p-4 sm:p-6">
      <div className="w-full max-w-[420px]">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        © 2026 PayFlow, Inc. • Enterprise Payment Infrastructure
      </p>
    </main>
  );
}

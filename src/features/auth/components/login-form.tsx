"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  KeyRound,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { useAuth } from "../hooks/use-auth";
import { DEMO_CREDENTIALS } from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login(data);
      toast.success("Welcome back!", {
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setAuthError(message);
      toast.error("Sign-in Failed", {
        description: message,
      });
    }
  };

  const handleFillDemo = () => {
    setValue("email", DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", DEMO_CREDENTIALS.password, { shouldValidate: true });
    setAuthError(null);
    toast.info("Demo credentials applied", {
      description: "Click 'Sign in' to enter the dashboard.",
    });
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-sm">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm mb-3">
          <Zap className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Sign in to PayFlow
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Banner */}
      <div className="mt-5 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/70 px-3.5 py-2.5 text-xs text-indigo-950">
        <div className="flex items-center space-x-2">
          <KeyRound className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            Demo: <strong className="font-medium">demo@payflow.io</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors"
        >
          Auto-fill
        </button>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mt-4 flex items-start space-x-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            startIcon={<Mail className="h-4 w-4 text-slate-400" />}
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-rose-600 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info("Password Reset", {
                  description:
                    "Please use the demo credentials provided above (demo@payflow.io / password123).",
                })
              }
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            startIcon={<Lock className="h-4 w-4 text-slate-400" />}
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-rose-600 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <label
            htmlFor="rememberMe"
            className="text-xs text-slate-600 cursor-pointer select-none"
          >
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all text-sm mt-2"
          isLoading={isSubmitting}
        >
          Sign In
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

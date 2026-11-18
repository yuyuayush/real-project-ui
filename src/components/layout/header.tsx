"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  Shield,
  LogOut,
  Settings,
  User as UserIcon,
  Check,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setCurrentDateString(
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now)
    );
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <span>PayFlow</span>
            <span>/</span>
            <span className="text-slate-600 font-medium">Dashboard</span>
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">
            Payments Overview
          </h1>
        </div>
      </div>

      {/* Right Controls: Search, Date, Notifications, Profile Dropdown */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Date Display (Desktop) */}
        {currentDateString && (
          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentDateString}</span>
          </div>
        )}

        {/* Global Search Bar (Medium & Up) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Input
            type="text"
            placeholder="Search docs, orders, APIs..."
            startIcon={<Search className="h-4 w-4 text-slate-400" />}
            className="h-9 text-xs bg-slate-50/80 border-slate-200 focus-visible:bg-white"
          />
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white ring-2 ring-white">
              3
            </span>
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Notifications
                </span>
                <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-indigo-50/50 p-2 border border-indigo-100/50">
                  <p className="font-semibold text-slate-800">
                    Webhook batch acknowledged
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    42 events processed idempotently via backend.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="font-semibold text-slate-800">
                    Payout settled
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    $72,400.00 wired to JPMorgan Chase treasury.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 rounded-lg p-1 hover:bg-slate-50 transition-colors"
          >
            <Avatar className="h-8 w-8 ring-1 ring-slate-200">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
                {user?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || "Alex Morgan"}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user?.companyName || "Acme Payments Corp"}
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">
                  {user?.name || "Alex Morgan"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || "demo@payflow.io"}
                </p>
                <div className="mt-1.5 inline-flex items-center space-x-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                  <Shield className="h-3 w-3 text-indigo-600" />
                  <span className="capitalize">{user?.role || "Admin"} Access</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Merchant Settings", {
                      description: "Configured for Stripe API & webhook listeners.",
                    });
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Account Settings
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

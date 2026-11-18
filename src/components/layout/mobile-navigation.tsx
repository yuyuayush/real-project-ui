"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Zap, LogOut } from "lucide-react";
import { NAV_ITEMS, NavItem } from "./sidebar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleNavClick = (item: NavItem) => {
    onClose();
    if (item.isComingSoon) {
      toast.info(`${item.title} Module`, {
        description: "Coming soon in Phase 2.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] text-slate-300 shadow-2xl flex flex-col justify-between p-5 border-r border-[#1E293B] animate-in slide-in-from-left duration-200">
        <div>
          {/* Top Brand & Close */}
          <div className="flex items-center justify-between pb-5 border-b border-[#1E293B]">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PayFlow
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mt-5 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.title}
                  href={item.isComingSoon ? "/dashboard" : item.href}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {item.isComingSoon && (
                    <span className="rounded bg-[#1E293B] px-1.5 py-0.5 text-[9px] text-slate-400">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer User Info */}
        <div className="border-t border-[#1E293B] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                {user?.name?.[0] || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || "Alex Morgan"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user?.email || "demo@payflow.io"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="rounded p-1.5 text-slate-400 hover:bg-[#334155] hover:text-rose-400"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

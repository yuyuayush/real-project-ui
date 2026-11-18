"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Package,
  CreditCard,
  Repeat,
  RotateCcw,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isComingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    isComingSoon: true,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    isComingSoon: true,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    isComingSoon: true,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    isComingSoon: true,
  },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Repeat,
    isComingSoon: true,
  },
  {
    title: "Refunds",
    href: "/dashboard/refunds",
    icon: RotateCcw,
    isComingSoon: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    isComingSoon: true,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
  onNavClick?: () => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  className,
  onNavClick,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleNavClick = (item: NavItem) => {
    onNavClick?.();
    if (item.isComingSoon) {
      toast.info(`${item.title} Module`, {
        description:
          "This module is scheduled for Phase 2 (Stripe Connect & Subscriptions integration). Currently exploring Phase 1 Overview.",
      });
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col justify-between bg-[#0F172A] text-slate-300 transition-all duration-300 border-r border-[#1E293B] select-none h-screen sticky top-0 z-30",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#1E293B]">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md ring-1 ring-white/10">
              <Zap className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-white text-base">
                    PayFlow
                  </span>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                    SaaS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">
                  Payment Infrastructure
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle for Desktop */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <div className="px-3 py-4 space-y-1">
          <div className={cn("px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500", isCollapsed && "sr-only")}>
            Main Menu
          </div>

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
                  "group flex items-center rounded-lg px-3 py-2.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-[#1E293B] hover:text-slate-100",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200",
                    !isCollapsed && "mr-3"
                  )}
                />
                {!isCollapsed && (
                  <div className="flex w-full items-center justify-between">
                    <span>{item.title}</span>
                    {item.isComingSoon && (
                      <span className="rounded bg-[#1E293B] px-1.5 py-0.5 text-[9px] font-normal text-slate-400">
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="border-t border-[#1E293B] p-3 space-y-2">
        {/* Support hint */}
        {!isCollapsed && (
          <div className="rounded-lg bg-[#1E293B]/60 p-3 text-xs text-slate-400">
            <div className="flex items-center space-x-2 text-slate-300 font-medium mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
              <span>Developer API</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Backend service active on port 5000 with Stripe webhooks.
            </p>
          </div>
        )}

        {/* User Card */}
        <div
          className={cn(
            "flex items-center rounded-lg p-2 hover:bg-[#1E293B] transition-colors",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || "A"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || "Alex Morgan"}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user?.email || "demo@payflow.io"}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={logout}
              className="rounded p-1.5 text-slate-400 hover:bg-[#334155] hover:text-rose-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

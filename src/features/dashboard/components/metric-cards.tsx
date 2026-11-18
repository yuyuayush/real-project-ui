"use client";

import React from "react";
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDashboardMetrics } from "../hooks/use-dashboard-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MetricCards() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-8 w-36" />
            <Skeleton className="mt-3 h-4 w-40" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: metrics.totalRevenue.title,
      value: metrics.totalRevenue.value,
      change: metrics.totalRevenue.percentageChange,
      period: metrics.totalRevenue.comparisonText,
      trend: metrics.totalRevenue.trend,
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      isPositiveGood: true,
    },
    {
      title: metrics.successfulPayments.title,
      value: metrics.successfulPayments.value,
      change: metrics.successfulPayments.percentageChange,
      period: metrics.successfulPayments.comparisonText,
      trend: metrics.successfulPayments.trend,
      icon: CheckCircle2,
      iconBg: "bg-indigo-50 text-indigo-600 ring-indigo-100",
      isPositiveGood: true,
    },
    {
      title: metrics.failedPayments.title,
      value: metrics.failedPayments.value,
      change: metrics.failedPayments.percentageChange,
      period: metrics.failedPayments.comparisonText,
      trend: metrics.failedPayments.trend,
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-600 ring-rose-100",
      // For failed payments, negative change (-2.4%) is good (fewer failures)
      isPositiveGood: false,
    },
    {
      title: metrics.totalCustomers.title,
      value: metrics.totalCustomers.value,
      change: metrics.totalCustomers.percentageChange,
      period: metrics.totalCustomers.comparisonText,
      trend: metrics.totalCustomers.trend,
      icon: Users,
      iconBg: "bg-sky-50 text-sky-600 ring-sky-100",
      isPositiveGood: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        // Calculate whether the trend is favorable
        const isFavorable = card.isPositiveGood
          ? card.change >= 0
          : card.change <= 0;

        return (
          <Card
            key={card.title}
            className="transition-all hover:shadow-md border-slate-200/80 bg-white"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {card.title}
                </span>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
                    card.iconBg
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </h3>
              </div>

              <div className="mt-2.5 flex items-center space-x-1.5 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center font-semibold rounded-md px-1.5 py-0.5",
                    isFavorable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  )}
                >
                  {card.change >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 stroke-[2.5]" />
                  )}
                  {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
                </span>
                <span className="text-slate-400 truncate">{card.period}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

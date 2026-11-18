"use client";

import React from "react";
import { MetricCards } from "./metric-cards";
import { RevenueChart } from "./revenue-chart";
import { PaymentMethodsBreakdown } from "./payment-methods-breakdown";
import { TransactionsTable } from "./transactions-table";
import { ShieldCheck, Download, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DashboardView() {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    toast.promise(
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      {
        loading: "Synchronizing ledger from gateway...",
        success: "Dashboard metrics refreshed successfully",
        error: "Failed to refresh metrics",
      }
    );
  };

  const handleExport = () => {
    toast.success("Audit Export Generated", {
      description: "Financial report (CSV) exported for current period.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Merchant Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Merchant Operations
            </h2>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gateway Live
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time ledger orchestration & settlement telemetry for Acme Payments Corp.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs h-9 bg-white border-slate-200 hover:bg-slate-50"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            Sync Ledger
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={handleExport}
            className="text-xs h-9 font-medium"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Audit
          </Button>
        </div>
      </div>

      {/* 1. Four Key Metric Cards */}
      <MetricCards />

      {/* 2. Revenue Chart & Payment Methods Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <PaymentMethodsBreakdown />
        </div>
      </div>

      {/* 3. Recent Transactions Table */}
      <div>
        <TransactionsTable />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenueAnalytics } from "../hooks/use-dashboard-data";
import { TimeframeFilter, RevenueDataPoint } from "../types/dashboard.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface TooltipPayloadItem {
  value: number;
  payload: RevenueDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-800">{label}</p>
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center justify-between space-x-4">
            <span className="text-slate-500">Gross Revenue:</span>
            <span className="font-bold text-indigo-600">
              {formatCurrency(data.revenue)}
            </span>
          </div>
          {data.previousRevenue !== undefined && (
            <div className="flex items-center justify-between space-x-4">
              <span className="text-slate-400">Previous Period:</span>
              <span className="font-medium text-slate-500">
                {formatCurrency(data.previousRevenue)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between space-x-4 border-t border-slate-100 pt-1">
            <span className="text-slate-500">Transactions:</span>
            <span className="font-medium text-slate-700">
              {data.transactionCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>("daily");
  const { data: analytics, isLoading } = useRevenueAnalytics(timeframe);

  const formatYAxis = (tick: number) => {
    if (tick >= 1000000) return `$${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `$${(tick / 1000).toFixed(0)}k`;
    return `$${tick}`;
  };

  return (
    <Card className="transition-all border-slate-200/80 bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Revenue Analytics
          </CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Gross transaction volume processed across all payment rails.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 self-start sm:self-auto">
          {(["daily", "weekly", "monthly"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTimeframe(filter)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                timeframe === filter
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading || !analytics ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          <div>
            {/* Quick Summary Bar */}
            <div className="mb-4 grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 sm:grid-cols-3">
              <div>
                <span className="text-[11px] font-medium text-slate-400">
                  Total in Period
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {formatCurrency(analytics.summary.totalRevenue)}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400">
                  Avg. Transaction
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {formatCurrency(analytics.summary.averageTransactionValue)}
                </p>
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-medium text-slate-400">
                  Peak Day ({analytics.summary.peakDate})
                </span>
                <p className="text-sm font-bold text-emerald-600">
                  {formatCurrency(analytics.summary.peakAmount)}
                </p>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.data}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    dy={5}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomChartTooltip />} />

                  {/* Previous period line */}
                  <Area
                    type="monotone"
                    dataKey="previousRevenue"
                    stroke="#CBD5E1"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#previousGradient)"
                  />

                  {/* Current period active area */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    activeDot={{
                      r: 6,
                      style: { fill: "#4F46E5", stroke: "#FFFFFF", strokeWidth: 2 },
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

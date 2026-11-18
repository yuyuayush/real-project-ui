"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import {
  TimeframeFilter,
  TransactionFilterParams,
} from "../types/dashboard.types";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 60 * 1000,
  });
}

export function useRevenueAnalytics(timeframe: TimeframeFilter) {
  return useQuery({
    queryKey: ["dashboard", "revenue", timeframe],
    queryFn: () => dashboardService.getRevenueAnalytics(timeframe),
    staleTime: 60 * 1000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["dashboard", "payment-methods"],
    queryFn: () => dashboardService.getPaymentMethods(),
    staleTime: 60 * 1000,
  });
}

export function useRecentTransactions(params: TransactionFilterParams) {
  return useQuery({
    queryKey: [
      "dashboard",
      "transactions",
      params.search,
      params.status,
      params.paymentMethod,
      params.sortBy,
      params.sortOrder,
      params.page,
      params.limit,
    ],
    queryFn: () => dashboardService.getTransactions(params),
    staleTime: 30 * 1000,
  });
}

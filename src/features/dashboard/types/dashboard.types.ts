import { PaymentMethodType, PaymentStatus } from "@/types";

export type TimeframeFilter = "daily" | "weekly" | "monthly";

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  numericValue: number;
  percentageChange: number;
  comparisonText: string;
  trend: "up" | "down" | "neutral";
  format: "currency" | "number" | "percentage";
}

export interface DashboardMetrics {
  totalRevenue: MetricCardData;
  successfulPayments: MetricCardData;
  failedPayments: MetricCardData;
  totalCustomers: MetricCardData;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  previousRevenue?: number;
  transactionCount: number;
}

export interface RevenueAnalyticsResponse {
  timeframe: TimeframeFilter;
  data: RevenueDataPoint[];
  summary: {
    totalRevenue: number;
    averageTransactionValue: number;
    peakDate: string;
    peakAmount: number;
  };
}

export interface TransactionCustomer {
  name: string;
  email: string;
  avatar?: string;
}

export interface Transaction {
  id: string; // e.g. txn_1OxK23Lkd91023
  orderNumber: string; // e.g. ORD-2026-8901
  customer: TransactionCustomer;
  amount: number; // in cents or dollars (we store dollar number e.g. 149.50)
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: {
    brand?: string;
    last4?: string;
    upiId?: string;
    bankName?: string;
    walletProvider?: string;
  };
  date: string; // ISO date
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  failureReason?: string;
  refundReason?: string;
}

export interface PaymentMethodBreakdown {
  method: PaymentMethodType;
  label: string;
  sharePercentage: number;
  totalVolume: number;
  transactionCount: number;
  color: string;
}

export interface TransactionFilterParams {
  search?: string;
  status?: PaymentStatus | "all";
  paymentMethod?: PaymentMethodType | "all";
  sortBy?: "date" | "amount" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

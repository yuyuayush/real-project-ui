/**
 * Shared Core TypeScript Types for PayFlow Dashboard
 */

export type DateRangeOption = "today" | "7d" | "30d" | "90d" | "12m";

export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";

export type PaymentMethodType = "card" | "upi" | "netbanking" | "wallet";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "finance_manager" | "viewer";
  avatarUrl?: string;
  companyName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import {
  DashboardMetrics,
  PaymentMethodBreakdown,
  RevenueAnalyticsResponse,
  TimeframeFilter,
  Transaction,
  TransactionFilterParams,
} from "../types/dashboard.types";
import { PaginatedResult } from "@/types";
import {
  MOCK_METRICS,
  MOCK_PAYMENT_METHODS,
  MOCK_REVENUE_DAILY,
  MOCK_REVENUE_MONTHLY,
  MOCK_REVENUE_WEEKLY,
  MOCK_TRANSACTIONS,
} from "../constants/mock-data";

export interface IDashboardService {
  getMetrics(): Promise<DashboardMetrics>;
  getRevenueAnalytics(timeframe: TimeframeFilter): Promise<RevenueAnalyticsResponse>;
  getPaymentMethods(): Promise<PaymentMethodBreakdown[]>;
  getTransactions(
    params?: TransactionFilterParams
  ): Promise<PaginatedResult<Transaction>>;
}

class DashboardService implements IDashboardService {
  private simulateDelay(ms: number = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getMetrics(): Promise<DashboardMetrics> {
    await this.simulateDelay(200);
    return { ...MOCK_METRICS };
  }

  public async getRevenueAnalytics(
    timeframe: TimeframeFilter
  ): Promise<RevenueAnalyticsResponse> {
    await this.simulateDelay(250);

    let data = MOCK_REVENUE_DAILY;
    if (timeframe === "weekly") {
      data = MOCK_REVENUE_WEEKLY;
    } else if (timeframe === "monthly") {
      data = MOCK_REVENUE_MONTHLY;
    }

    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalTransactions = data.reduce(
      (acc, curr) => acc + curr.transactionCount,
      0
    );
    const avgValue =
      totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    let peakAmount = 0;
    let peakDate = "";
    data.forEach((item) => {
      if (item.revenue > peakAmount) {
        peakAmount = item.revenue;
        peakDate = item.date;
      }
    });

    return {
      timeframe,
      data,
      summary: {
        totalRevenue,
        averageTransactionValue: avgValue,
        peakDate,
        peakAmount,
      },
    };
  }

  public async getPaymentMethods(): Promise<PaymentMethodBreakdown[]> {
    await this.simulateDelay(180);
    return [...MOCK_PAYMENT_METHODS];
  }

  public async getTransactions(
    params: TransactionFilterParams = {}
  ): Promise<PaginatedResult<Transaction>> {
    await this.simulateDelay(280);

    const {
      search = "",
      status = "all",
      paymentMethod = "all",
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      limit = 6,
    } = params;

    let filtered = [...MOCK_TRANSACTIONS];

    // Search filter across ID, orderNumber, customer name, email
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.orderNumber.toLowerCase().includes(q) ||
          t.customer.name.toLowerCase().includes(q) ||
          t.customer.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    // Payment method filter
    if (paymentMethod !== "all") {
      filtered = filtered.filter((t) => t.paymentMethod === paymentMethod);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page: safePage,
      limit,
      totalPages,
    };
  }
}

export const dashboardService: IDashboardService = new DashboardService();

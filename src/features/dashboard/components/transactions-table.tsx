"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Receipt,
  FileQuestion,
} from "lucide-react";
import { useRecentTransactions } from "../hooks/use-dashboard-data";
import {
  Transaction,
  TransactionFilterParams,
} from "../types/dashboard.types";
import { PaymentStatus, PaymentMethodType } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TransactionDetailModal } from "./transaction-detail-modal";

const getPaymentMethodIcon = (method: PaymentMethodType) => {
  switch (method) {
    case "card":
      return <CreditCard className="h-3.5 w-3.5 text-indigo-600" />;
    case "upi":
      return <Smartphone className="h-3.5 w-3.5 text-cyan-600" />;
    case "netbanking":
      return <Landmark className="h-3.5 w-3.5 text-emerald-600" />;
    case "wallet":
      return <Wallet className="h-3.5 w-3.5 text-amber-600" />;
  }
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case "succeeded":
      return <Badge variant="success">Succeeded</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "refunded":
      return <Badge variant="secondary">Refunded</Badge>;
  }
};

export function TransactionsTable() {
  const [params, setParams] = useState<TransactionFilterParams>({
    search: "",
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 6,
  });

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data, isLoading } = useRecentTransactions(params);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // reset page on search
    }));
  };

  const handleStatusChange = (status: PaymentStatus | "all") => {
    setParams((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handleSort = (field: "date" | "amount" | "status") => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <Card className="transition-all border-slate-200/80 bg-white">
      <CardHeader className="flex flex-col space-y-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Recent Transactions
          </CardTitle>
          <p className="mt-1 text-xs text-slate-500">
            Real-time ledger of inbound payments and refund activities.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="w-full sm:w-56">
            <Input
              type="text"
              placeholder="Search customer, ID..."
              value={params.search}
              onChange={handleSearchChange}
              startIcon={<Search className="h-3.5 w-3.5 text-slate-400" />}
              className="h-8 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/70 p-0.5">
            {(["all", "succeeded", "pending", "failed", "refunded"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                    params.status === status
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="inline-flex items-center space-x-1 font-semibold hover:text-slate-900"
                >
                  <span>Amount</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="inline-flex items-center space-x-1 font-semibold hover:text-slate-900"
                >
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-7 w-7 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : !data || data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileQuestion className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-700">
                      No transactions found
                    </p>
                    <p className="text-xs text-slate-400">
                      Try clearing your search terms or changing your status filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((txn) => (
                <TableRow key={txn.id} className="hover:bg-slate-50/70">
                  <TableCell className="font-mono text-xs font-medium text-slate-900">
                    <div className="flex flex-col">
                      <span>{txn.id}</span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        {txn.orderNumber}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2.5">
                      <Avatar className="h-7 w-7">
                        {txn.customer.avatar ? (
                          <AvatarImage
                            src={txn.customer.avatar}
                            alt={txn.customer.name}
                          />
                        ) : null}
                        <AvatarFallback className="text-[10px]">
                          {txn.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800">
                          {txn.customer.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {txn.customer.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900 text-xs">
                      {formatCurrency(txn.amount, txn.currency)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="inline-flex items-center space-x-1.5 text-xs text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100">
                        {getPaymentMethodIcon(txn.paymentMethod)}
                      </span>
                      <span className="capitalize text-[11px] font-medium">
                        {txn.paymentMethodDetails?.brand || txn.paymentMethod}
                        {txn.paymentMethodDetails?.last4 &&
                          ` ••${txn.paymentMethodDetails.last4}`}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-500">
                      {formatDate(txn.date)}
                    </span>
                  </TableCell>

                  <TableCell>{getStatusBadge(txn.status)}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTransaction(txn)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {data && data.total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {(data.page - 1) * data.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(data.page * data.limit, data.total)}
              </span>{" "}
              of <span className="font-semibold text-slate-800">{data.total}</span>{" "}
              transactions
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page <= 1}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                Previous
              </Button>
              <span className="text-xs font-medium text-slate-700 px-1">
                {data.page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page >= data.totalPages}
                className="h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </Card>
  );
}

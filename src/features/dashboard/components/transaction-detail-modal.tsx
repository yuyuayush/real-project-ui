"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Transaction } from "../types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-medium text-slate-400">
                {transaction.id}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(transaction.id, "Transaction ID")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Copy ID"
              >
                {copiedId === transaction.id ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Transaction Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5">
          {/* Main Amount Callout */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Total Charged</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>
            <div>{getStatusBadge(transaction.status)}</div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Order Reference</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {transaction.orderNumber}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Timestamp</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {formatDateTime(transaction.date)}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Customer</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {transaction.customer.name}
              </p>
              <p className="text-slate-500">{transaction.customer.email}</p>
            </div>
            <div>
              <span className="text-slate-400">Payment Method</span>
              <p className="font-semibold text-slate-800 mt-0.5 uppercase">
                {transaction.paymentMethod}
              </p>
              <p className="text-slate-500">
                {transaction.paymentMethodDetails?.brand}{" "}
                {transaction.paymentMethodDetails?.last4 &&
                  `ending in ${transaction.paymentMethodDetails.last4}`}
                {transaction.paymentMethodDetails?.upiId}
                {transaction.paymentMethodDetails?.bankName}
                {transaction.paymentMethodDetails?.walletProvider}
              </p>
            </div>
          </div>

          {/* Future Stripe Integration Info */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-indigo-900 font-semibold">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Gateway Mapping (Stripe Architecture Ready)</span>
            </div>
            <div className="flex items-center justify-between text-indigo-950 font-mono text-[11px]">
              <span className="text-slate-500">PaymentIntent:</span>
              <span className="flex items-center space-x-1">
                <span>{transaction.stripePaymentIntentId || "pi_simulated_live"}</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      transaction.stripePaymentIntentId || "pi_simulated_live",
                      "PaymentIntent ID"
                    )
                  }
                >
                  <Copy className="h-3 w-3 text-indigo-600" />
                </button>
              </span>
            </div>
          </div>

          {/* Failure or Refund Note if present */}
          {transaction.failureReason && (
            <div className="flex items-start space-x-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Decline Reason:</span>{" "}
                {transaction.failureReason}
              </div>
            </div>
          )}

          {transaction.refundReason && (
            <div className="flex items-start space-x-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <RotateCcw className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Refund Audit:</span>{" "}
                {transaction.refundReason}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3 border-t border-slate-100 pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              toast.info("Audit Receipt", {
                description: `Sent transactional receipt audit for ${transaction.orderNumber}.`,
              });
              onClose();
            }}
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}

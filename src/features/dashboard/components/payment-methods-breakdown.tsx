"use client";

import React from "react";
import { CreditCard, Smartphone, Landmark, Wallet } from "lucide-react";
import { usePaymentMethods } from "../hooks/use-dashboard-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethodType } from "@/types";

const getMethodIcon = (method: PaymentMethodType) => {
  switch (method) {
    case "card":
      return <CreditCard className="h-4 w-4 text-indigo-600" />;
    case "upi":
      return <Smartphone className="h-4 w-4 text-cyan-600" />;
    case "netbanking":
      return <Landmark className="h-4 w-4 text-emerald-600" />;
    case "wallet":
      return <Wallet className="h-4 w-4 text-amber-600" />;
    default:
      return <CreditCard className="h-4 w-4 text-slate-600" />;
  }
};

export function PaymentMethodsBreakdown() {
  const { data: methods, isLoading } = usePaymentMethods();

  return (
    <Card className="transition-all border-slate-200/80 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900">
          Payment Methods
        </CardTitle>
        <p className="text-xs text-slate-500">
          Distribution across accepted payment rails and gateways.
        </p>
      </CardHeader>

      <CardContent>
        {isLoading || !methods ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Multi-segment Progress Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              {methods.map((item) => (
                <div
                  key={item.method}
                  style={{
                    width: `${item.sharePercentage}%`,
                    backgroundColor: item.color,
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90"
                  title={`${item.label}: ${item.sharePercentage}%`}
                />
              ))}
            </div>

            {/* List breakdown */}
            <div className="space-y-3.5 divide-y divide-slate-100">
              {methods.map((item) => (
                <div
                  key={item.method}
                  className="flex items-center justify-between pt-3 first:pt-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      {getMethodIcon(item.method)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.transactionCount.toLocaleString()} transactions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">
                      {formatCurrency(item.totalVolume)}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      {item.sharePercentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

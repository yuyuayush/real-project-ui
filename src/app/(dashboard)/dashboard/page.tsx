import { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { DASHBOARD_METADATA } from "@/constants/metadata.constants";

export const metadata: Metadata = DASHBOARD_METADATA;

export default function DashboardPage() {
  return <DashboardView />;
}

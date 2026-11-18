import { Metadata } from "next";
import { LoginView } from "@/features/auth/components/login-view";
import { LOGIN_METADATA } from "@/constants/metadata.constants";

export const metadata: Metadata = LOGIN_METADATA;

export default function LoginPage() {
  return <LoginView />;
}

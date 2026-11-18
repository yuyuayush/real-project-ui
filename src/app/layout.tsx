import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ROOT_METADATA, VIEWPORT_CONFIG } from "@/constants/metadata.constants";

export const metadata: Metadata = ROOT_METADATA;

export const viewport: Viewport = VIEWPORT_CONFIG;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";

/**
 * Global Site Configuration Constants
 */
export const SITE_CONFIG = {
  name: "PayFlow",
  tagline: "Payment infrastructure, simplified.",
  description:
    "Enterprise Payment Management Dashboard with real-time analytics, transactions, and settlement telemetry.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://payflow.io",
  company: "PayFlow Inc.",
  author: "PayFlow Engineering",
  themeColor: "#4F46E5",
  keywords: [
    "payment gateway",
    "fintech",
    "stripe",
    "payment management",
    "financial dashboard",
    "merchant portal",
    "revenue analytics",
    "settlement telemetry",
    "saas",
  ],
} as const;

/**
 * Next.js Global Viewport Configuration
 */
export const VIEWPORT_CONFIG: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Root Application Metadata
 */
export const ROOT_METADATA: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.company,
  keywords: [...SITE_CONFIG.keywords],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: false, // Internal merchant platform
    follow: false,
  },
};

/**
 * Login Page Metadata
 */
export const LOGIN_METADATA: Metadata = {
  title: `Sign In | ${SITE_CONFIG.name} Merchant Dashboard`,
  description:
    "Sign in to access your payment analytics, orders, settlements, and merchant controls.",
  openGraph: {
    title: `Sign In | ${SITE_CONFIG.name}`,
    description: "Sign in to access your payment analytics and settlements.",
  },
};

/**
 * Dashboard Page Metadata
 */
export const DASHBOARD_METADATA: Metadata = {
  title: `Dashboard Overview | ${SITE_CONFIG.name}`,
  description:
    "Real-time payment analytics, transactional ledgers, and settlement metrics.",
  openGraph: {
    title: `Dashboard Overview | ${SITE_CONFIG.name}`,
    description: "Real-time payment analytics and transactional ledgers.",
  },
};

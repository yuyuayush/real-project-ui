# 💳 PayFlow - Production-Grade Payment Management Dashboard

An enterprise-grade, modern fintech payment operations dashboard built with **Next.js 15+ App Router**, **TypeScript (Strict Mode)**, **Tailwind CSS**, **Recharts**, **React Hook Form**, **Zod**, **Zustand**, and **TanStack React Query**.

Designed with fintech SaaS design principles inspired by Stripe, Adyen, and Mercury.

---

## 🌟 Architecture & Features

### 1. Feature-Based Architecture
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx         # Thin Server Component
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Route guard, collapsible sidebar, header
│   │   └── dashboard/
│   │       └── page.tsx         # Thin Server Component
│   ├── layout.tsx               # Root layout & font configuration
│   ├── globals.css              # Custom fintech design tokens & scrollbars
│   └── providers.tsx            # QueryClientProvider, Sonner Toaster
│
├── components/
│   ├── ui/                      # Base UI primitives (Button, Input, Checkbox, Card, Badge, Table, Avatar, Skeleton)
│   ├── shared/                  # Shared domain widgets
│   └── layout/
│       ├── sidebar.tsx          # Collapsible desktop sidebar & route highlight
│       ├── header.tsx           # Breadcrumbs, date display, search, notifications, profile
│       └── mobile-navigation.tsx # Slide-out mobile drawer
│
├── features/
│   ├── auth/                    # Complete Auth feature slice
│   │   ├── components/          # LoginForm, AuthBrandSide, LoginView
│   │   ├── schemas/             # Zod validation schema
│   │   ├── hooks/               # useAuth hook
│   │   ├── services/            # MockAuthService (isolated IAuthService interface)
│   │   └── types/               # AuthSession, LoginCredentials, User
│   │
│   └── dashboard/               # Complete Dashboard feature slice
│       ├── components/          # MetricCards, RevenueChart, PaymentMethodsBreakdown, TransactionsTable, TransactionDetailModal
│       ├── hooks/               # useDashboardMetrics, useRevenueAnalytics, useRecentTransactions, usePaymentMethods
│       ├── services/            # DashboardService (asynchronous typed promises)
│       ├── types/               # MetricCardData, RevenueDataPoint, Transaction, PaymentMethodBreakdown
│       └── constants/           # Isolated realistic mock datasets
│
├── constants/
│   └── metadata.constants.ts    # Centralized metadata, viewport & OpenGraph configurations
├── lib/
│   ├── utils.ts                 # cn, formatCurrency, formatDate, formatDateTime, formatPercent
│   └── cookies.ts               # Cookie helpers synchronized with edge middleware
├── middleware.ts                # Next.js Edge Middleware for route protection and redirects
├── services/
│   └── api-client.ts            # Centralized API client with JWT injection & error handling
├── store/
│   └── auth.store.ts            # Zustand client state with safe hydration & localStorage persistence
└── types/                       # Shared domain types
```

---

## 🚀 Quick Start

### 1. Installation
```bash
cd real-project-ui
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Type Checking & Build
```bash
npm run typecheck
npm run build
```

---

## 🔐 Demo Credentials

The authentication service is pre-configured with the following merchant accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Merchant Admin** | `demo@payflow.io` | `password123` |
| **Finance Director** | `admin@payflow.io` | `payflow2026` |

*A one-click **"Auto-fill"** button is also provided directly on the login form for testing convenience.*

---

## 📊 Phase 1 Implementation Highlights

### 1. Split-Screen Login Experience
- **Left:** Dark navy brand presentation (`PayFlow`, PCI-DSS compliance badge, live metric telemetry card, encrypted infrastructure features).
- **Right:** Clean, minimalist form featuring:
  - Work Email & Password with show/hide password toggle.
  - "Remember this device" checkbox.
  - "Forgot password?" link with prompt.
  - Zod validation errors with field-level alerts.
  - Submit button with async loading spinner.
  - Direct redirect to `/dashboard` upon verification.

### 2. High-Performance Dashboard Overview
- **Collapsible Sidebar:** Deep slate styling (`#0F172A`), active route indicator, collapsible desktop drawer, and mobile drawer.
- **Header:** Live date display (`Wednesday, Nov 18, 2026`), global search UI, interactive notifications preview popover, and user profile dropdown.
- **Metric Cards:** 4 real-time KPI metrics with positive/negative trend indicators and comparative baselines:
  - Total Revenue (`$1,284,390.00`, `+14.2%`)
  - Successful Payments (`18,429`, `+8.5%`)
  - Failed Payments (`214`, `-2.4%`)
  - Total Customers (`9,842`, `+12.7%`)
- **Revenue Analytics Chart (Recharts):**
  - Interactive Daily / Weekly / Monthly timeframe switching.
  - Shaded dual-area visualization with previous period comparison.
  - Custom currency & transaction count tooltip.
  - Gridlines, axis formatters (`$50k`, `$1M`), and responsive sizing.
- **Payment Methods Breakdown:**
  - Visual multi-segment progress distribution.
  - Cards (54.2%), UPI (26.8%), Net Banking (12.5%), and Wallets (6.5%).
- **Recent Transactions Ledger:**
  - Live search across transaction IDs, order numbers, and customer names.
  - Status filtering (`All`, `Succeeded`, `Pending`, `Failed`, `Refunded`).
  - Column sorting by Date and Amount.
  - Status badges with fintech color coding.
  - Pagination controls.
  - Full Transaction Detail Inspection Modal with copyable IDs and Stripe PaymentIntent mapping.

---

## 🔌 Future Stripe Integration Readiness

The frontend architecture is decoupled and strictly follows the data models established in the backend service (`real-project-svc`):

1. **Order & Transaction Types:** `Transaction` and `PaymentMethodType` map 1:1 with `OrderStatus` and `PaymentDetails` in `real-project-svc/src/models/order.model.ts`.
2. **Centralized API Client:** `src/services/api-client.ts` automatically reads `NEXT_PUBLIC_API_URL` (`http://localhost:5000/api`) and injects bearer tokens for `/checkout`, `/payments`, and `/orders` endpoints.
3. **Isolated Auth Interface:** `IAuthService` decouples login UI from the underlying mock, allowing immediate drop-in replacement with `/api/auth/login`.

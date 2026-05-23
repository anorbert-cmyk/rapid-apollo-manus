# Architecture Overview

This document describes the technical architecture of ValidateStrategy.

## Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [AI Analysis Pipeline](#ai-analysis-pipeline)
- [Payment Flow](#payment-flow)
- [Authentication](#authentication)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   React 19   │  │  Tailwind 4  │  │    tRPC Client       │  │
│  │   + Wouter   │  │    + CSS     │  │  (tanstack-query)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Node.js)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Express    │  │    tRPC      │  │     Webhooks         │  │
│  │   Router     │  │   Routers    │  │  (PayPal, Crypto)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Services Layer                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ Analysis    │  │  Payment    │  │    Email        │   │  │
│  │  │ Processor   │  │  Services   │  │   Nurturing     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│     MySQL        │ │  High-Fidelity │ │    AWS S3        │
│   (Drizzle)      │ │   AI Engine    │ │   (Storage)      │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── ThemeProvider
├── TRPCProvider
│   └── QueryClientProvider
└── Router (Wouter)
    ├── Home (Landing)
    │   ├── Navigation
    │   ├── HeroSection
    │   ├── MetricsGrid
    │   ├── ProcessSection
    │   ├── PricingCards
    │   ├── FAQSection
    │   └── Footer
    ├── Checkout
    │   ├── PaymentSelector
    │   ├── PayPalButton
    │   └── CryptoPayment
    ├── Analysis
    │   ├── ProgressTracker
    │   └── ResultRenderer
    ├── DemoAnalysis
    └── Admin (Protected)
        ├── AdminAuth (MetaMask)
        ├── SessionList
        └── AnalyticsDashboard
```

### State Management

| State Type | Solution |
|:-----------|:---------|
| Server State | TanStack Query (via tRPC) |
| UI State | React useState/useReducer |
| Theme | React Context |
| Auth | React Context + Cookies |

### Key Hooks

| Hook | Purpose |
|:-----|:--------|
| `useAuth` | Authentication state & methods |
| `useTheme` | Dark/light mode toggle |
| `trpc.*.useQuery` | Data fetching |
| `trpc.*.useMutation` | Data mutations |

---

## Backend Architecture

### Layer Structure

```
┌───────────────────────────────────────────┐
│              HTTP Layer                    │
│  (Express middleware, CORS, body parsing) │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│              tRPC Layer                    │
│  (Routers, procedures, context)           │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│            Services Layer                  │
│  (Business logic, external APIs)          │
└───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│              Data Layer                    │
│  (Drizzle ORM, MySQL queries)             │
└───────────────────────────────────────────┘
```

### tRPC Routers

| Router | Procedures | Purpose |
|:-------|:-----------|:--------|
| `system` | health, version | System status |
| `auth` | me, logout, getTier | Authentication |
| `session` | create, get, getMyAnalyses | Analysis sessions |
| `payment` | createPayPalOrder, capturePayPalOrder, createNowPaymentsInvoice | Payments |
| `analysis` | getResult, getProgress, triggerAnalysis | AI analysis |
| `admin` | getChallenge, verify, getAllSessions | Admin dashboard |

### Middleware Chain

```typescript
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);  // JWT verification
app.use('/api/trpc', trpcHandler);
app.use('/webhooks', webhookRouter);
```

---

## Database Schema

### Entity Relationship

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │    sessions     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ userId (FK)     │
│ email           │       │ sessionId (PK)  │
│ createdAt       │       │ problemStatement│
│ walletAddress   │       │ tier            │
└─────────────────┘       │ status          │
                          │ createdAt       │
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   purchases     │       │ analysis_results│       │ email_tracking  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ sessionId (FK)  │       │ sessionId (FK)  │       │ sessionId (FK)  │
│ tier            │       │ content         │       │ emailType       │
│ amountUsd       │       │ partNumber      │       │ sentAt          │
│ paymentMethod   │       │ status          │       │ openedAt        │
│ paymentStatus   │       │ createdAt       │       │ clickedAt       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Key Tables

| Table | Purpose | Key Fields |
|:------|:--------|:-----------|
| `users` | User accounts | id, email, walletAddress |
| `analysis_sessions` | Analysis requests | sessionId, tier, status |
| `purchases` | Payment records | paymentMethod, paymentStatus |
| `analysis_results` | AI outputs | content, partNumber |
| `used_signatures` | Replay prevention | signature, walletAddress |

---

## AI Analysis Pipeline

### Single-Part Flow (Observer, Insider)

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│  Payment   │────►│  Trigger   │────►│ Core Logic │
│  Complete  │     │  Analysis  │     │   Engine   │
└────────────┘     └────────────┘     └─────┬──────┘
                                            │
                                            ▼
                   ┌────────────┐     ┌────────────┐
                   │   Email    │◄────│   Store    │
                   │   Notify   │     │   Result   │
                   └────────────┘     └────────────┘
```

### Multi-Part Flow (Syndicate/APEX)

```
Payment Complete
       │
       ▼
┌──────────────────────────────────────────────────────┐
│                  APEX 4-Part Pipeline                 │
│                                                       │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────┐│
│  │ Part 1   │──►│ Part 2   │──►│ Part 3   │──►│ 4  ││
│  │ Discovery│   │ Strategy │   │ Figma    │   │Risk││
│  └──────────┘   └──────────┘   └──────────┘   └────┘│
│       │              │              │            │   │
│       ▼              ▼              ▼            ▼   │
│  ┌───────────────────────────────────────────────┐  │
│  │              Partial Results Manager          │  │
│  │         (saves progress after each part)      │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
       │
       ▼
  Final Result + Email
```

### Multi-turn Context

Each APEX part receives context from previous parts:

```typescript
const part2Prompt = buildPrompt({
  part: 2,
  problemStatement: session.problemStatement,
  previousPartSummary: part1Result.summary,  // Context injection
});
```

---

## Payment Flow

### PayPal Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Client │────►│ Server │────►│ PayPal │────►│ Client │
│ Select │     │ Create │     │  API   │     │Redirect│
│ PayPal │     │ Order  │     │        │     │Approval│
└────────┘     └────────┘     └────────┘     └───┬────┘
                                                  │
      ┌───────────────────────────────────────────┘
      ▼
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ PayPal │────►│ Client │────►│ Server │────►│Trigger │
│Approve │     │Callback│     │Capture │     │Analysis│
└────────┘     └────────┘     └────────┘     └────────┘
```

### Crypto Flow (NOWPayments)

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Client │────►│ Server │────►│  NOW   │────►│ Client │
│ Select │     │ Create │     │Payments│     │Redirect│
│ Crypto │     │Invoice │     │  API   │     │ Wallet │
└────────┘     └────────┘     └────────┘     └───┬────┘
                                                  │
                                                  ▼
              ┌────────┐     ┌────────┐     ┌────────┐
              │ IPN    │────►│ Server │────►│Trigger │
              │Webhook │     │Verify  │     │Analysis│
              └────────┘     └────────┘     └────────┘
```

---

## Authentication

### User Authentication

```
┌────────────────────────────────────────────────────────┐
│                    JWT Flow                            │
│                                                        │
│  Login ─► OAuth Provider ─► JWT Token ─► HttpOnly     │
│                                           Cookie       │
│                                                        │
│  Request ─► Cookie Parsed ─► JWT Verified ─► ctx.user │
└────────────────────────────────────────────────────────┘
```

### Admin Authentication (MetaMask)

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Admin    │────►│   Server   │────►│   Admin    │
│  Connect   │     │ Challenge  │     │    Sign    │
│   Wallet   │     │  (nonce)   │     │  Message   │
└────────────┘     └────────────┘     └─────┬──────┘
                                            │
                                            ▼
              ┌────────────┐     ┌────────────────────┐
              │   Admin    │◄────│  Verify Signature  │
              │   Access   │     │  + Check Wallet    │
              │  Granted   │     │  + Store Signature │
              └────────────┘     └────────────────────┘
```

### Signature Replay Prevention

```typescript
// 1. Check if signature was used before
const isUsed = await isSignatureUsed(signature);
if (isUsed) throw new Error("Signature already used");

// 2. Verify signature
const isValid = verifySignature(message, signature, walletAddress);
if (!isValid) throw new Error("Invalid signature");

// 3. Mark signature as used
await markSignatureUsed(signature, walletAddress);
```

---

## Error Handling

### Graceful Degradation

```typescript
// Circuit breaker pattern for AI calls
const result = await withCircuitBreaker(
  () => aiLogicEngine.execute(prompt),
  {
    maxFailures: 3,
    resetTimeout: 60000,
    fallback: () => getPartialResult(sessionId),
  }
);
```

### Partial Results

Multi-part analyses save progress after each part:

```typescript
const partialManager = createPartialResultsManager(sessionId);

for (const part of parts) {
  const result = await processPartWithRetry(part);
  await partialManager.savePart(part.number, result);
}
```

---

## Performance Considerations

| Area | Optimization |
|:-----|:-------------|
| Database | Connection pooling, indexed queries |
| API Calls | Retry with exponential backoff |
| Frontend | React.memo, lazy loading |
| CSS | Tailwind purging, critical CSS |
| Animations | `will-change`, `contain: paint` |

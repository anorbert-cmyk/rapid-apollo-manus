# API Reference

Complete API documentation for ValidateStrategy tRPC endpoints.

## Base URL

```
Development: http://localhost:3000/api/trpc
Production:  https://validatestrategy.com/api/trpc
```

---

## Authentication

### User Authentication

Requests are authenticated via HttpOnly JWT cookies. The cookie is automatically included in requests from the same origin.

### Admin Authentication

Admin endpoints require MetaMask wallet signature verification. Flow:

1. Call `admin.getChallenge` to get a nonce
2. Sign the message with MetaMask
3. Call `admin.verify` with the signature
4. Session is established

---

## Routers

### System Router

#### `system.health`

Health check endpoint.

```typescript
// Request
trpc.system.health.query()

// Response
{
  status: "ok",
  timestamp: "2025-01-05T10:00:00.000Z",
  version: "1.0.0"
}
```

---

### Auth Router

#### `auth.me`

Get current user information.

```typescript
// Request
trpc.auth.me.query()

// Response (authenticated)
{
  id: "user_123",
  email: "user@example.com",
  walletAddress: "0x1234..."
}

// Response (not authenticated)
null
```

#### `auth.logout`

Logout current user.

```typescript
// Request
trpc.auth.logout.mutate()

// Response
{ success: true }
```

#### `auth.getTier`

Get tier configuration.

```typescript
// Request
trpc.auth.getTier.query({ tier: "medium" })

// Response
{
  id: "medium",
  name: "Insider",
  displayName: "Insider Tier",
  priceUsd: 99,
  headline: "Your 90-Day Roadmap",
  features: ["..."],
  deliveryTime: "48 hours",
  // ... full TierConfig
}
```

---

### Session Router

#### `session.create`

Create a new analysis session.

```typescript
// Request
trpc.session.create.mutate({
  problemStatement: "We need to validate our B2B SaaS idea for...",
  tier: "medium",
  email: "founder@startup.com",  // optional
  isPriority: false,              // optional
  prioritySource: "email_campaign_dec2024"  // optional
})

// Response
{
  sessionId: "sess_abc123xyz"
}
```

**Input Schema:**

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `problemStatement` | string | Yes | 10-5000 characters |
| `tier` | enum | Yes | "standard", "medium", "full" |
| `email` | string | No | Valid email format |
| `isPriority` | boolean | No | Priority queue flag |
| `prioritySource` | string | No | Tracking source |

#### `session.get`

Get session by ID.

```typescript
// Request
trpc.session.get.query({ sessionId: "sess_abc123xyz" })

// Response
{
  sessionId: "sess_abc123xyz",
  problemStatement: "...",
  tier: "medium",
  status: "pending_payment",
  createdAt: "2025-01-05T10:00:00.000Z",
  userId: null
}
```

#### `session.getMyAnalyses`

Get all analyses for authenticated user. **Requires authentication.**

```typescript
// Request
trpc.session.getMyAnalyses.query()

// Response
[
  {
    sessionId: "sess_abc123",
    tier: "medium",
    status: "completed",
    createdAt: "...",
    result: { content: "...", partNumber: 1 },
    purchase: { amountUsd: 99, paymentStatus: "completed" }
  },
  // ... more sessions
]
```

---

### Payment Router

#### `payment.createPayPalOrder`

Create a PayPal order for checkout.

```typescript
// Request
trpc.payment.createPayPalOrder.mutate({
  sessionId: "sess_abc123xyz",
  tier: "medium",
  problemStatement: "..."
})

// Response
{
  orderId: "ORDER123ABC",
  approvalUrl: "https://www.paypal.com/checkoutnow?token=..."
}
```

#### `payment.capturePayPalOrder`

Capture approved PayPal order.

```typescript
// Request
trpc.payment.capturePayPalOrder.mutate({
  orderId: "ORDER123ABC",
  sessionId: "sess_abc123xyz"
})

// Response
{
  success: true,
  captureId: "CAPTURE123"
}
```

#### `payment.createNowPaymentsInvoice`

Create crypto payment invoice via NOWPayments.

```typescript
// Request
trpc.payment.createNowPaymentsInvoice.mutate({
  sessionId: "sess_abc123xyz",
  tier: "standard",
  problemStatement: "...",
  email: "user@example.com"  // optional
})

// Response
{
  invoiceId: "5678901234",
  invoiceUrl: "https://nowpayments.io/payment/?iid=..."
}
```

#### `payment.getNowPaymentsStatus`

Check crypto payment status.

```typescript
// Request
trpc.payment.getNowPaymentsStatus.query({ paymentId: "5678901234" })

// Response
{
  status: "finished",  // waiting, confirming, confirmed, finished
  paymentAmount: 49,
  actuallyPaid: 49.02
}
```

---

### Analysis Router

#### `analysis.getResult`

Get analysis result for a session.

```typescript
// Request
trpc.analysis.getResult.query({ sessionId: "sess_abc123xyz" })

// Response
{
  id: 123,
  sessionId: "sess_abc123xyz",
  content: "# Strategic Analysis\n\n## Executive Summary...",
  partNumber: 1,
  totalParts: 1,
  status: "completed",
  createdAt: "2025-01-05T12:00:00.000Z"
}
```

#### `analysis.getProgress`

Get analysis progress for multi-part analyses.

```typescript
// Request
trpc.analysis.getProgress.query({ sessionId: "sess_abc123xyz" })

// Response
{
  sessionId: "sess_abc123xyz",
  status: "processing",
  currentPart: 2,
  totalParts: 4,
  completedParts: [1],
  estimatedCompletion: "2025-01-05T14:00:00.000Z"
}
```

#### `analysis.triggerAnalysis`

Manually trigger analysis (admin or after payment verification).

```typescript
// Request
trpc.analysis.triggerAnalysis.mutate({
  sessionId: "sess_abc123xyz"
})

// Response
{
  success: true,
  message: "Analysis triggered"
}
```

---

### Admin Router

**All admin endpoints require MetaMask authentication.**

#### `admin.getChallenge`

Get authentication challenge for wallet.

```typescript
// Request
trpc.admin.getChallenge.query({ walletAddress: "0x1234..." })

// Response
{
  message: "Sign this message to verify wallet ownership.\nNonce: abc123\nTimestamp: 1704456000000",
  nonce: "abc123"
}
```

#### `admin.verify`

Verify wallet signature and establish admin session.

```typescript
// Request
trpc.admin.verify.mutate({
  walletAddress: "0x1234...",
  signature: "0xabcdef...",
  message: "Sign this message..."
})

// Response
{
  success: true,
  isAdmin: true
}
```

#### `admin.getAllSessions`

Get all sessions with pagination.

```typescript
// Request
trpc.admin.getAllSessions.query({
  limit: 50,
  offset: 0,
  status: "completed"  // optional filter
})

// Response
{
  sessions: [...],
  total: 150,
  hasMore: true
}
```

#### `admin.triggerEmail`

Manually trigger email for a session.

```typescript
// Request
trpc.admin.triggerEmail.mutate({
  sessionId: "sess_abc123xyz",
  emailType: "completion"  // welcome, completion, followup
})

// Response
{
  success: true,
  emailId: "email_xyz"
}
```

---

## Webhooks

### PayPal Webhook

```
POST /webhooks/paypal
Content-Type: application/json
```

PayPal sends webhook events for order updates. Verified using PayPal's signature verification.

### NOWPayments IPN

```
POST /webhooks/nowpayments
Content-Type: application/json
x-nowpayments-sig: <hmac_signature>
```

Verified using HMAC-SHA512 signature.

---

## Error Codes

| Code | Description |
|:-----|:------------|
| `BAD_REQUEST` | Invalid input data |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `PRECONDITION_FAILED` | Service not configured |
| `INTERNAL_SERVER_ERROR` | Server error |

### Error Response Format

```typescript
{
  error: {
    code: "BAD_REQUEST",
    message: "Problem statement must be at least 10 characters"
  }
}
```

---

## Rate Limits

| Endpoint Type | Limit |
|:--------------|:------|
| Public endpoints | 100/15min per IP |
| Admin endpoints | 10/15min per wallet |
| Webhooks | Unlimited (verified signatures) |

---

## TypeScript Types

### Tier

```typescript
type Tier = "standard" | "medium" | "full";
```

### TierConfig

```typescript
interface TierConfig {
  id: Tier;
  name: string;
  displayName: string;
  priceUsd: number;
  headline: string;
  tagline: string;
  description: string;
  features: string[];
  badge: string;
  ctaText: string;
  footerText: string;
  deliveryTime: string;
  outputLength: string;
  apiCalls: number;
  isMultiPart: boolean;
}
```

### AnalysisSession

```typescript
interface AnalysisSession {
  sessionId: string;
  problemStatement: string;
  tier: Tier;
  status: "pending_payment" | "paid" | "processing" | "completed" | "failed";
  userId: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

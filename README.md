# ValidateStrategy

<div align="center">

![ValidateStrategy](https://img.shields.io/badge/ValidateStrategy-AI%20Product%20Validator-6366f1?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**AI-powered product strategy validation platform. Get boardroom-ready analysis in 24 hours.**

[Live Demo](https://validatestrategy.com) · [Documentation](#documentation) · [Report Bug](https://github.com/yourusername/validatestrategy/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ValidateStrategy is an AI-powered SaaS platform that helps founders and product teams validate their product ideas before building. Using our **Proprietary Logic Engines (APEX)**, it generates comprehensive strategy documents including:

- **Market Fit Analysis** — Problem-solution fit validation
- **Competitor Research** — Live competitor scanning with UX teardowns
- **Strategic Roadmap** — Week-by-week execution plans
- **Figma Prompts** — 10 production-ready design prompts (APEX tier)

### Pricing Tiers

| Tier | Price | Delivery | Output |
|:-----|:------|:---------|:-------|
| **Observer** | $49 | 24h | 1-2 pages, Go/No-Go decision |
| **Insider** | $99 | 48h | 5-8 pages, Strategic roadmap |
| **Syndicate** | $199 | 72h | 15-20 pages, Full APEX analysis + Figma prompts |

---

## Features

### Core Features
- 🧠 **AI Analysis Engine** — Multi-part analysis using custom High-Fidelity Logic Engines
- 💳 **Multi-Payment** — PayPal, NOWPayments (crypto)
- 🔐 **MetaMask Admin** — Secure wallet-based admin authentication
- 📧 **Email Nurturing** — Automated email sequences with tracking
- 📊 **Live Dashboard** — Real-time analysis progress tracking

### Security Features
- ✅ Challenge-response wallet authentication with nonce
- ✅ Replay attack prevention (signature tracking)
- ✅ Zod schema validation on all inputs
- ✅ HMAC webhook signature verification
- ✅ HttpOnly, Secure, SameSite cookies

---

## Tech Stack

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Tailwind CSS 4 | Styling |
| tRPC | Type-safe API client |
| Wouter | Routing |
| Framer Motion | Animations |
| Radix UI | Accessible components |

### Backend
| Technology | Purpose |
|:-----------|:--------|
| Express 4 | HTTP server |
| tRPC | Type-safe API |
| Drizzle ORM | Database access |
| MySQL 2 | Database driver |
| Zod 4 | Schema validation |
| Winston | Logging |

### Integrations
| Service | Purpose |
|:--------|:--------|
| Custom AI Engine | High-Fidelity Analysis Generation |
| PayPal | Card/PayPal payments |
| NOWPayments | Crypto payments |
| AWS S3 | File storage |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 10.x (recommended) or npm
- **MySQL** 8.x database
- **MetaMask** (for admin access)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/validatestrategy.git
cd validatestrategy

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure your .env file (see Environment Variables section)

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|:--------|:------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm check` | TypeScript type checking |
| `pnpm test` | Run test suite |
| `pnpm format` | Format code with Prettier |
| `pnpm db:push` | Push schema changes to database |

---

## Environment Variables

Create a `.env` file based on `.env.example`:

### Required Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/validatestrategy

# AI Services
APEX_ENGINE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# Admin Access
ADMIN_WALLET_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_ADMIN_WALLET_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Security
CRON_SECRET=generate_a_strong_random_string_here
SESSION_SECRET=generate_another_strong_random_string_here
```

### Payment Providers (at least one required)

```env
# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live'

# NOWPayments (Crypto)
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret
```

### Optional Variables

```env
# Demo
DEMO_SESSION_ID=test-apex-demo-LAIdJqey

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

> ⚠️ **Security Warning**: Never commit `.env` files. They are gitignored by default.

---

## Project Structure

```
rapid-apollo-manus/
├── client/                    # Frontend (React)
│   └── src/
│       ├── _core/             # Core utilities & hooks
│       ├── components/        # UI components (Radix-based)
│       ├── contexts/          # React contexts (Theme, Auth)
│       ├── hooks/             # Custom hooks
│       ├── lib/               # Utilities (trpc, utils)
│       ├── pages/             # Page components
│       │   ├── Admin/         # Admin dashboard
│       │   ├── Analysis.tsx   # Analysis result page
│       │   ├── Checkout.tsx   # Payment checkout
│       │   ├── DemoAnalysis.tsx
│       │   └── Home.tsx       # Landing page
│       ├── App.tsx
│       ├── index.css          # Global styles
│       └── main.tsx           # Entry point
├── server/                    # Backend (Express + tRPC)
│   ├── _core/                 # Core server setup
│   ├── lib/                   # Server utilities
│   ├── middleware/            # Express middleware
│   ├── services/              # Business logic
│   │   ├── analysisProcessor.ts    # AI analysis engine
│   │   ├── nowPaymentsService.ts   # Crypto payments
│   │   ├── paypalService.ts        # PayPal integration
│   │   └── aiEngineService.ts      # AI Logic Client
│   ├── db.ts                  # Database queries (Drizzle)
│   ├── routers.ts             # tRPC routers
│   └── webhooks.ts            # Payment webhooks
├── shared/                    # Shared types & configs
│   ├── pricing.ts             # Tier configurations
│   ├── types.ts               # Shared TypeScript types
│   └── const.ts               # Constants
├── drizzle/                   # Database migrations
├── prompts/                   # AI prompt templates
└── scripts/                   # Utility scripts
```

---

## API Reference

### tRPC Routers

#### `session`
| Procedure | Type | Description |
|:----------|:-----|:------------|
| `create` | Mutation | Create new analysis session |
| `get` | Query | Get session by ID |
| `getMyAnalyses` | Query | Get user's analyses (protected) |

#### `payment`
| Procedure | Type | Description |
|:----------|:-----|:------------|
| `createNowPaymentsInvoice` | Mutation | Create crypto payment |
| `createPayPalOrder` | Mutation | Create PayPal order |
| `capturePayPalOrder` | Mutation | Capture approved PayPal order |

#### `analysis`
| Procedure | Type | Description |
|:----------|:-----|:------------|
| `getResult` | Query | Get analysis result |
| `getProgress` | Query | Get analysis progress |
| `triggerAnalysis` | Mutation | Trigger analysis after payment |

#### `admin`
| Procedure | Type | Description |
|:----------|:-----|:------------|
| `getChallenge` | Query | Get auth challenge for wallet |
| `verify` | Mutation | Verify wallet signature |
| `getAllSessions` | Query | List all sessions (protected) |
| `triggerEmail` | Mutation | Trigger email sequence |

---

## Security

### Authentication Flow

1. **User Auth**: JWT-based sessions with HttpOnly cookies
2. **Admin Auth**: MetaMask challenge-response with nonce

### Input Validation

All inputs validated with Zod schemas:

```typescript
const sessionInput = z.object({
  problemStatement: z.string().min(10).max(5000),
  tier: z.enum(["standard", "medium", "full"]),
  email: z.string().email().optional(),
});
```

### Webhook Security

All payment webhooks verified with HMAC signatures:

```typescript
// NOWPayments IPN verification
const isValid = verifyNowPaymentsSignature(payload, signature, secret);

// PayPal webhook verification
const isValid = await verifyPayPalWebhook(headers, body);
```

### Security Headers (Recommended)

Add to production deployment:

```typescript
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] }},
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

For full security audit, see [SECURITY.md](./SECURITY.md).

---

## Deployment

### Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

### Environment Requirements

- Node.js 20+
- MySQL 8+ database
- HTTPS enabled
- Webhook endpoints accessible

### Recommended Platforms

| Platform | Setup |
|:---------|:------|
| **Railway** | Connect repo, set env vars |
| **Render** | Docker or native Node |
| **Vercel** | Frontend only (needs separate backend) |
| **AWS** | EC2/ECS with RDS |

### Health Check

```bash
curl https://your-domain.com/api/trpc/system.health
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Flow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- **TypeScript** strict mode
- **Prettier** formatting
- **Zod** validation for all inputs
- **React** functional components with hooks

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Radix UI](https://radix-ui.com) — Accessible components
- [tRPC](https://trpc.io) — End-to-end type safety
- [Drizzle ORM](https://orm.drizzle.team) — TypeScript ORM

---

<div align="center">
  <sub>Built with ❤️ by the ValidateStrategy team</sub>
</div>

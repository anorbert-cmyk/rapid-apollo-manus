# Changelog

All notable changes to ValidateStrategy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub documentation suite (README, CONTRIBUTING, SECURITY, ARCHITECTURE, API, DEPLOYMENT)
- GitHub issue and PR templates

---

## [1.0.0] - 2025-01-05

### Added
- 🚀 **Core Platform**
  - AI-powered product validation using Perplexity Sonar Pro
  - Three-tier pricing system (Observer $49, Insider $99, Syndicate $199)
  - Multi-part APEX analysis for Syndicate tier (4 parts)
  - Real-time progress tracking for analyses

- 💳 **Payment Integration**
  - PayPal checkout integration
  - NOWPayments crypto payment support
  - Webhook verification for payment confirmation
  - Automatic analysis triggering on payment completion

- 🔐 **Authentication & Security**
  - MetaMask wallet-based admin authentication
  - Challenge-response with nonce for replay prevention
  - JWT session management with HttpOnly cookies
  - Signature tracking to prevent reuse

- 🎨 **Frontend**
  - Technical Brutalist design aesthetic
  - Dark/light theme support
  - Responsive mobile-first design
  - Huly-style animated pricing cards
  - Terminal-style UI elements

- 📧 **Email System**
  - Automated email notifications
  - Email tracking (opens, clicks)
  - Nurturing sequences

- 📊 **Admin Dashboard**
  - Session management
  - Payment tracking
  - Analysis monitoring
  - Manual email triggers

### Security
- Input validation with Zod schemas
- SQL injection prevention (Drizzle ORM)
- XSS prevention (React auto-escaping)
- CSRF protection (SameSite cookies)
- Webhook signature verification

---

## [0.9.0] - 2024-12-20

### Added
- Initial beta release
- Basic analysis flow
- Stripe payment integration (later replaced)

### Changed
- Migrated from Coinbase Commerce to NOWPayments

---

## Version History

| Version | Date | Highlights |
|:--------|:-----|:-----------|
| 1.0.0 | 2025-01-05 | Production release with PayPal + Crypto |
| 0.9.0 | 2024-12-20 | Beta release |

---

## Upgrade Notes

### Upgrading to 1.0.0

1. **Environment Variables**: New required variables added:
   - `NOWPAYMENTS_API_KEY`
   - `NOWPAYMENTS_IPN_SECRET`
   - `CRON_SECRET`
   - `SESSION_SECRET`

2. **Database**: Run migrations:
   ```bash
   pnpm db:push
   ```

3. **Webhooks**: Configure new webhook endpoints:
   - PayPal: `/webhooks/paypal`
   - NOWPayments: `/webhooks/nowpayments`

---

[Unreleased]: https://github.com/yourusername/validatestrategy/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/validatestrategy/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/yourusername/validatestrategy/releases/tag/v0.9.0

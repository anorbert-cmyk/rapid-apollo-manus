# Contributing to ValidateStrategy

Thank you for your interest in contributing to ValidateStrategy! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Security Guidelines](#security-guidelines)
- [Testing](#testing)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and constructive in discussions
- Welcome newcomers and help them get started
- Focus on the best outcome for the project
- Accept constructive criticism gracefully

---

## Getting Started

### Prerequisites

- Node.js ≥ 20.x
- pnpm ≥ 10.x
- MySQL 8.x
- Git

### Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/validatestrategy.git
cd validatestrategy
git remote add upstream https://github.com/ORIGINAL_OWNER/validatestrategy.git
```

### Development Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Configure your local environment
# Edit .env with your local database credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

---

## Pull Request Process

### 1. Branch Naming

Use descriptive branch names:

| Type | Format | Example |
|:-----|:-------|:--------|
| Feature | `feature/description` | `feature/add-stripe-integration` |
| Bug Fix | `fix/description` | `fix/payment-validation-error` |
| Refactor | `refactor/description` | `refactor/pricing-component` |
| Docs | `docs/description` | `docs/update-api-reference` |

### 2. Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(payment): add NOWPayments crypto integration
fix(auth): resolve MetaMask signature validation
docs(readme): update deployment instructions
```

### 3. Before Submitting

- [ ] Run type check: `pnpm check`
- [ ] Run tests: `pnpm test`
- [ ] Format code: `pnpm format`
- [ ] Update documentation if needed
- [ ] Add tests for new features

### 4. PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows project style
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No sensitive data exposed
```

---

## Coding Standards

### TypeScript

- **Strict mode** enabled
- Explicit return types for functions
- No `any` types (use `unknown` if necessary)
- Prefer `interface` over `type` for object shapes

```typescript
// ✅ Good
interface UserSession {
  id: string;
  email: string;
  createdAt: Date;
}

function getSession(id: string): Promise<UserSession | null> {
  // ...
}

// ❌ Bad
function getSession(id: any) {
  // ...
}
```

### React Components

- Functional components with hooks
- Destructure props
- Use TypeScript interfaces for props

```tsx
// ✅ Good
interface PricingCardProps {
  tier: Tier;
  selected: boolean;
  onSelect: (tier: Tier) => void;
}

export function PricingCard({ tier, selected, onSelect }: PricingCardProps) {
  return (
    <div onClick={() => onSelect(tier)}>
      {/* ... */}
    </div>
  );
}
```

### CSS / Styling

- Use Tailwind CSS utilities
- Custom CSS in `index.css` with layer organization
- CSS variables for theming
- Mobile-first responsive design

```css
/* ✅ Good - organized in layers */
@layer components {
  .glass-panel {
    @apply bg-card/70 backdrop-blur-xl border border-border;
  }
}
```

### API / Backend

- Zod validation for all inputs
- Descriptive error messages
- Proper error handling (no empty catch blocks)

```typescript
// ✅ Good
const createSessionInput = z.object({
  problemStatement: z.string()
    .min(10, "Problem statement must be at least 10 characters")
    .max(5000, "Problem statement must not exceed 5000 characters"),
  tier: z.enum(["standard", "medium", "full"]),
});
```

---

## Security Guidelines

> ⚠️ **CRITICAL**: All contributions are reviewed for security vulnerabilities.

### Must Follow

1. **Never hardcode secrets** — Use environment variables
2. **Validate all inputs** — Use Zod schemas
3. **Sanitize outputs** — Prevent XSS
4. **No sensitive data in logs** — Redact PII, tokens
5. **Verify webhooks** — Check signatures

### Secret Management

```typescript
// ✅ Good
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error("API_KEY not configured");

// ❌ Bad
const apiKey = "sk_live_xxxxxxxxxxxxx";
```

### Error Handling

```typescript
// ✅ Good - Safe error message
throw new TRPCError({
  code: "BAD_REQUEST",
  message: "Invalid payment data",
});

// ❌ Bad - Exposes internal details
throw new Error(`Database error: ${err.message} for user ${userId}`);
```

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/security.test.ts

# Watch mode
pnpm test --watch
```

### Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("PaymentService", () => {
  describe("createInvoice", () => {
    it("should create invoice with valid input", async () => {
      // Arrange
      const input = { tier: "standard", sessionId: "test-123" };
      
      // Act
      const result = await createInvoice(input);
      
      // Assert
      expect(result.invoiceId).toBeDefined();
    });

    it("should reject invalid tier", async () => {
      await expect(createInvoice({ tier: "invalid" }))
        .rejects.toThrow();
    });
  });
});
```

### Coverage Requirements

- New features must include tests
- Bug fixes should include regression tests
- Aim for >80% coverage on critical paths

---

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

Thank you for contributing! 🎉

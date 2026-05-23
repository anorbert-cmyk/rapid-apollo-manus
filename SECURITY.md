# Security Policy

## Supported Versions

| Version | Supported          |
|:--------|:-------------------|
| 1.x     | ✅ Active support  |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email**: Send details to `security@validatestrategy.com`
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

| Phase | Timeline |
|:------|:---------|
| Initial response | 24-48 hours |
| Triage & investigation | 72 hours |
| Fix development | Depends on severity |
| Disclosure | Coordinated after fix |

---

## Security Measures

### Authentication & Authorization

| Feature | Implementation | Status |
|:--------|:---------------|:-------|
| User Sessions | JWT with HttpOnly cookies | ✅ |
| Admin Auth | MetaMask challenge-response | ✅ |
| Replay Prevention | Signature tracking in DB | ✅ |
| Session Expiry | 5-minute signature validity | ✅ |

### Input Validation

All inputs validated with Zod schemas before processing:

```typescript
// Example: Session creation
z.object({
  problemStatement: z.string().min(10).max(5000),
  tier: z.enum(["standard", "medium", "full"]),
  email: z.string().email().optional(),
})
```

### Payment Security

| Gateway | Security Measure |
|:--------|:-----------------|
| PayPal | Server-side order creation, webhook signature verification |
| NOWPayments | HMAC-SHA256 IPN verification |

Webhook verification example:

```typescript
const computedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

if (computedSignature !== receivedSignature) {
  throw new Error("Invalid webhook signature");
}
```

### Data Protection

| Measure | Implementation |
|:--------|:---------------|
| Secrets | Environment variables only |
| Database | Parameterized queries (Drizzle ORM) |
| Logs | No sensitive data logged |
| Cookies | HttpOnly, Secure, SameSite=Strict |

---

## Known Vulnerabilities & Mitigations

### HIGH Priority (Resolved)

| Issue | Status | Mitigation |
|:------|:-------|:-----------|
| Replay attacks on admin auth | ✅ FIXED | Signature tracking in database |
| Webhook tampering | ✅ FIXED | HMAC signature verification |
| Payment manipulation | ✅ FIXED | Server-side amount calculation |

### MEDIUM Priority

| Issue | Status | Mitigation |
|:------|:-------|:-----------|
| Rate limiting | ⏳ RECOMMENDED | Add express-rate-limit |
| Security headers | ⏳ RECOMMENDED | Add helmet.js |
| CAPTCHA | ⏳ OPTIONAL | Consider for public forms |

---

## Security Checklist for Contributors

Before submitting code, verify:

- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated with Zod
- [ ] Error messages don't expose internal details
- [ ] No `console.log` with sensitive data
- [ ] Webhook signatures verified
- [ ] SQL queries use parameterized statements
- [ ] XSS prevention (React auto-escapes, but check dangerouslySetInnerHTML)

---

## Recommended Production Hardening

### 1. Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
```

### 2. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// API rate limit
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests" },
}));

// Strict limit for auth endpoints
app.use('/api/trpc/admin', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
}));
```

### 3. HTTPS Enforcement

```typescript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && 
      req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

---

## Penetration Test Results

### SQL Injection

| Test | Result |
|:-----|:-------|
| `'; DROP TABLE users; --` | ✅ BLOCKED |
| `' UNION SELECT * FROM users --` | ✅ BLOCKED |
| `1' OR '1'='1` | ✅ BLOCKED |

### XSS

| Test | Result |
|:-----|:-------|
| `<script>alert('xss')</script>` | ✅ ESCAPED |
| `<img onerror="alert(1)" src=x>` | ✅ ESCAPED |

### Authentication

| Test | Result |
|:-----|:-------|
| Forged JWT | ✅ REJECTED |
| Expired signature reuse | ✅ REJECTED |
| Wrong wallet signature | ✅ REJECTED |

---

## Compliance

- [x] HTTPS enforced
- [x] Secure cookie attributes
- [x] Input validation
- [x] Output encoding
- [x] Authentication required for sensitive operations
- [x] Payment data handled via PCI-DSS compliant providers (PayPal, NOWPayments)
- [x] No sensitive data in URLs

---

## Contact

Security issues: `security@validatestrategy.com`

For non-security bugs: [GitHub Issues](https://github.com/yourusername/validatestrategy/issues)

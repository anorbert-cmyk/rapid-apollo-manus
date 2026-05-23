# Deployment Guide

This guide covers deploying ValidateStrategy to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
- [Database Setup](#database-setup)
- [Payment Configuration](#payment-configuration)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services

| Service | Purpose | Required |
|:--------|:--------|:---------|
| MySQL 8+ | Database | ✅ Yes |
| High-Fidelity Logic Engine | AI analysis | ✅ Yes |
| PayPal / NOWPayments | Payments | ✅ At least one |
| SMTP / Email Service | Notifications | Optional |
| AWS S3 | File storage | Optional |

### System Requirements

- Node.js ≥ 20.x
- 1GB+ RAM
- HTTPS enabled domain

---

## Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env.production
```

### 2. Configure Required Variables

```env
# Server
NODE_ENV=production
PORT=3000

# Database (use secure password!)
DATABASE_URL=mysql://user:SECURE_PASSWORD@db-host:3306/validatestrategy

# AI
APEX_ENGINE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# Admin (your MetaMask wallet address)
ADMIN_WALLET_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_ADMIN_WALLET_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Security (generate secure random strings!)
CRON_SECRET=your-32-char-secure-random-string
SESSION_SECRET=another-32-char-secure-random-string

# Frontend URL
VITE_APP_URL=https://validatestrategy.com
```

### 3. Configure Payment Providers

**PayPal (Production):**
```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_MODE=live
```

**NOWPayments:**
```env
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret
```

### 4. Generate Secure Secrets

```bash
# Generate secure random strings
openssl rand -hex 32  # Use for CRON_SECRET
openssl rand -hex 32  # Use for SESSION_SECRET
```

---

## Build Process

### Local Build

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Type check
pnpm check

# Build for production
pnpm build
```

This creates:
- `dist/` — Server bundle
- `dist/public/` — Frontend assets

### Build Output

```
dist/
├── index.js          # Server entry
├── public/
│   ├── index.html    # Frontend entry
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── ...
```

---

## Deployment Options

### Option 1: Railway (Recommended)

**Pros:** Simple, auto-deploy, managed database

1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy MySQL add-on
4. Configure custom domain

```yaml
# railway.json (optional)
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "pnpm start",
    "healthcheckPath": "/api/trpc/system.health"
  }
}
```

### Option 2: Render

**Pros:** Free tier available, simple setup

1. Create Web Service from GitHub
2. Build Command: `pnpm install && pnpm build`
3. Start Command: `pnpm start`
4. Add environment variables
5. Configure database (Render MySQL or external)

### Option 3: DigitalOcean App Platform

**Pros:** Predictable pricing, managed infrastructure

```yaml
# .do/app.yaml
name: validatestrategy
services:
  - name: api
    source:
      repo: your-org/validatestrategy
      branch: main
    build_command: pnpm install && pnpm build
    run_command: pnpm start
    http_port: 3000
    instance_size_slug: basic-xs
    envs:
      - key: NODE_ENV
        value: production
databases:
  - name: db
    engine: MYSQL
    version: "8"
```

### Option 4: VPS (Manual)

For full control on DigitalOcean, Linode, AWS EC2, etc.

```bash
# On server
git clone https://github.com/your-org/validatestrategy.git
cd validatestrategy
pnpm install --frozen-lockfile
pnpm build

# Configure environment
cp .env.example .env
nano .env  # Configure all variables

# Start with PM2
npm install -g pm2
pm2 start dist/index.js --name validatestrategy

# Configure nginx reverse proxy
# (see nginx config below)
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name validatestrategy.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name validatestrategy.com;

    ssl_certificate /etc/letsencrypt/live/validatestrategy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/validatestrategy.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE validatestrategy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vsuser'@'%' IDENTIFIED BY 'SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON validatestrategy.* TO 'vsuser'@'%';
FLUSH PRIVILEGES;
```

### 2. Run Migrations

```bash
# Push schema to database
pnpm db:push
```

### 3. Seed Demo Data (Optional)

```bash
node scripts/seed-demo.mjs
```

---

## Email Service Configuration (Resend)

### 1. Sending Configuration (Required)

Sending is automatically enabled once your domain is verified in Resend. No individual email account creation is needed. The application is configured to send from `hello@validatestrategy.com` by default.

**Required Environment Variables:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@validatestrategy.com
```

### 2. Receiving Configuration (Optional)

To receive emails at `security@validatestrategy.com` or `conduct@validatestrategy.com`, you must configure an MX record to route inbound emails to Resend (for webhook processing) or use a forwarding service.

**Option A: Resend Inbound (Programmatic)**
Add the following MX record to your DNS:
- **Type:** MX
- **Name:** @
- **Value:** `inbound-smtp.eu-west-1.amazonaws.com` (Check your region in Resend dashboard!)
- **Priority:** 10

**Option B: Email Forwarding (Recommended for Humans)**
If you want to read these emails in your personal inbox (e.g., Gmail), use a service like **Cloudflare Email Routing** or **ImprovMX** to forward:
- `hello@validatestrategy.com` -> `your.personal@email.com`
- `security@validatestrategy.com` -> `your.personal@email.com`

*Note: The ValidateStrategy application mainly uses Resend for **sending** reports and notifications.*

---

## Payment Configuration

### PayPal Setup

1. Create PayPal Developer account
2. Create Live application
3. Get Client ID and Secret
4. Configure webhook URL: `https://yourdomain.com/webhooks/paypal`
5. Subscribe to events:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`

### NOWPayments Setup

1. Create NOWPayments account
2. Get API Key from Settings
3. Configure IPN URL: `https://yourdomain.com/webhooks/nowpayments`
4. Get IPN Secret from Settings

---

## Post-Deployment

### 1. Health Check

```bash
curl https://yourdomain.com/api/trpc/system.health
# Expected: {"status":"ok","timestamp":"..."}
```

### 2. Test Payment Flow

1. Create test session
2. Complete payment (use PayPal sandbox or small crypto amount)
3. Verify analysis triggers

### 3. Verify Admin Access

1. Navigate to `/admin`
2. Connect MetaMask with admin wallet
3. Verify signature works

### 4. Configure Monitoring

Set up alerts for:
- Server downtime
- Error rate spikes
- Payment failures
- Slow responses

---

## Monitoring

### Recommended Tools

| Tool | Purpose |
|:-----|:--------|
| UptimeRobot | Uptime monitoring |
| Sentry | Error tracking |
| Better Stack | Logs & alerting |
| Grafana | Metrics visualization |

### Application Logs

```bash
# PM2 logs
pm2 logs validatestrategy

# Docker logs
docker logs -f validatestrategy
```

### Health Endpoints

| Endpoint | Check |
|:---------|:------|
| `/api/trpc/system.health` | Server status |
| `/api/trpc/system.version` | App version |

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: ECONNREFUSED 127.0.0.1:3306
```

**Solution:** Check DATABASE_URL and ensure MySQL is running.

#### AI Engine Errors

```
Error: 401 Unauthorized
```

**Solution:** Verify APEX_ENGINE_API_KEY is correct and has credits.

#### Payment Webhooks Not Received

**Checklist:**
- [ ] Webhook URLs are HTTPS
- [ ] URLs are publicly accessible
- [ ] Firewall allows incoming webhooks
- [ ] Webhook secrets are configured

#### Admin Auth Failing

```
Error: Invalid signature
```

**Checklist:**
- [ ] ADMIN_WALLET_ADDRESS matches your wallet
- [ ] Wallet address is lowercase
- [ ] Timestamp is within 5 minutes

### Debug Mode

Enable verbose logging:

```env
NODE_ENV=development
DEBUG=*
```

### Support

For deployment issues:
1. Check application logs
2. Review environment variables
3. Test individual services
4. Open GitHub issue with details

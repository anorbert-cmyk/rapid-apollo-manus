# Pricing Page Issues Found

## Issues to Fix:

1. **Stripe buttons appear but may not be clickable** - Need to check if STRIPE_SECRET_KEY is configured
2. **Insider tier shows "$149" crossed out with "$79" as discount** - User wants regular price only
3. **"ONLY 3 SPOTS LEFT AT THIS PRICE" text on Insider** - User wants this removed
4. **PayPal buttons visible** - User wants PayPal removed entirely
5. **Observer tier shows $29** - Correct
6. **Syndicate tier shows $199** - Correct

## Current Tier Prices in Code (Checkout.tsx):
- Observer (standard): $29
- Insider (medium): $79
- Syndicate (full): $199

## Action Items:
1. Remove PayPal from Checkout.tsx and Home.tsx
2. Remove discount display from Insider tier in Home.tsx
3. Remove "ONLY 3 SPOTS LEFT" from Insider tier
4. Check Stripe configuration and button clickability

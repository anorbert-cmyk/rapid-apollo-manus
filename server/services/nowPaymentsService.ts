/**
 * NOWPayments Service
 * Handles cryptocurrency payment creation and verification via NOWPayments API
 */

import crypto from 'crypto';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

interface CreatePaymentParams {
  priceAmount: number;
  priceCurrency: string;
  payCurrency?: string;
  orderId: string;
  orderDescription?: string;
  ipnCallbackUrl?: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface PaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  invoice_url?: string;
}

interface InvoiceResponse {
  id: string;
  token_id: string;
  order_id: string;
  order_description: string;
  price_amount: string;
  price_currency: string;
  pay_currency: string | null;
  ipn_callback_url: string;
  invoice_url: string;
  success_url: string;
  cancel_url: string;
  created_at: string;
  updated_at: string;
}

interface IPNPayload {
  payment_id: number;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
}

/**
 * Get API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error('NOWPAYMENTS_API_KEY is not configured');
  }
  return apiKey;
}

/**
 * Get IPN secret from environment
 */
function getIpnSecret(): string {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) {
    throw new Error('NOWPAYMENTS_IPN_SECRET is not configured');
  }
  return secret;
}

/**
 * Check if NOWPayments is configured
 */
export function isNowPaymentsConfigured(): boolean {
  return !!(process.env.NOWPAYMENTS_API_KEY && process.env.NOWPAYMENTS_IPN_SECRET);
}

/**
 * Get available cryptocurrencies
 */
export async function getAvailableCurrencies(): Promise<string[]> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/currencies`, {
    headers: {
      'x-api-key': getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get currencies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.currencies || [];
}

/**
 * Get minimum payment amount for a currency
 */
export async function getMinimumPaymentAmount(
  currencyFrom: string,
  currencyTo: string
): Promise<number> {
  const response = await fetch(
    `${NOWPAYMENTS_API_URL}/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`,
    {
      headers: {
        'x-api-key': getApiKey(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get minimum amount: ${response.statusText}`);
  }

  const data = await response.json();
  return data.min_amount;
}

/**
 * Get estimated price for payment
 */
export async function getEstimatedPrice(
  amount: number,
  currencyFrom: string,
  currencyTo: string
): Promise<{ estimated_amount: number }> {
  const response = await fetch(
    `${NOWPAYMENTS_API_URL}/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`,
    {
      headers: {
        'x-api-key': getApiKey(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get estimate: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a payment invoice (recommended for web integrations)
 * Returns a hosted payment page URL where users can select their crypto and pay
 */
export async function createInvoice(params: CreatePaymentParams): Promise<InvoiceResponse> {
  const apiKey = getApiKey();
  
  const body = {
    price_amount: params.priceAmount,
    price_currency: params.priceCurrency,
    order_id: params.orderId,
    order_description: params.orderDescription || `Payment for order ${params.orderId}`,
    ipn_callback_url: params.ipnCallbackUrl || `${process.env.VITE_APP_URL || ''}/api/webhooks/nowpayments`,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  };

  console.log('[NOWPayments] Creating invoice:', JSON.stringify(body, null, 2));

  const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[NOWPayments] Invoice creation failed:', errorText);
    throw new Error(`Failed to create invoice: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('[NOWPayments] Invoice created:', data.id);
  return data;
}

/**
 * Create a direct payment (for specific crypto currency)
 */
export async function createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
  const apiKey = getApiKey();
  
  const body = {
    price_amount: params.priceAmount,
    price_currency: params.priceCurrency,
    pay_currency: params.payCurrency,
    order_id: params.orderId,
    order_description: params.orderDescription || `Payment for order ${params.orderId}`,
    ipn_callback_url: params.ipnCallbackUrl || `${process.env.VITE_APP_URL || ''}/api/webhooks/nowpayments`,
  };

  console.log('[NOWPayments] Creating payment:', JSON.stringify(body, null, 2));

  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[NOWPayments] Payment creation failed:', errorText);
    throw new Error(`Failed to create payment: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('[NOWPayments] Payment created:', data.payment_id);
  return data;
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
    headers: {
      'x-api-key': getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get payment status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Verify IPN callback signature
 * NOWPayments signs IPN callbacks with HMAC-SHA512
 */
export function verifyIPNSignature(payload: Record<string, unknown>, signature: string): boolean {
  const secret = getIpnSecret();
  
  // Sort the payload keys and create a string
  const sortedKeys = Object.keys(payload).sort();
  const sortedPayload: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    sortedPayload[key] = payload[key];
  }
  
  const payloadString = JSON.stringify(sortedPayload);
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(payloadString);
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === signature;
}

/**
 * Parse and validate IPN payload
 */
export function parseIPNPayload(body: unknown): IPNPayload {
  const payload = body as IPNPayload;
  
  if (!payload.payment_id || !payload.payment_status || !payload.order_id) {
    throw new Error('Invalid IPN payload: missing required fields');
  }
  
  return payload;
}

/**
 * Check if payment is confirmed (finished)
 */
export function isPaymentConfirmed(status: string): boolean {
  return status === 'finished';
}

/**
 * Check if payment is waiting for confirmation
 */
export function isPaymentPending(status: string): boolean {
  return ['waiting', 'confirming', 'confirmed', 'sending'].includes(status);
}

/**
 * Check if payment failed
 */
export function isPaymentFailed(status: string): boolean {
  return ['failed', 'refunded', 'expired'].includes(status);
}

/**
 * Payment status descriptions
 */
export const PAYMENT_STATUS_DESCRIPTIONS: Record<string, string> = {
  waiting: 'Waiting for payment',
  confirming: 'Payment detected, waiting for confirmations',
  confirmed: 'Payment confirmed, processing',
  sending: 'Sending funds to merchant',
  partially_paid: 'Partially paid',
  finished: 'Payment complete',
  failed: 'Payment failed',
  refunded: 'Payment refunded',
  expired: 'Payment expired',
};

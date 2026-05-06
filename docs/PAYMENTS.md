# 💳 VerTravels Payment Integration

**Status:** ✅ Complete  
**Gateways:** Flutterwave, Stripe, PayPal, Bank Transfer, Wallet  
**Security:** PCI DSS Compliant, SSL Encrypted  

---

## 📋 Overview

VerTravels supports multiple payment gateways to serve customers globally, with special focus on African markets through Flutterwave integration.

---

## 🎯 Features

### **Supported Payment Gateways**

| Gateway | Region | Methods | Status |
|---------|--------|---------|--------|
| **Flutterwave** | Global (Africa focus) | Cards, Mobile Money, USSD, Bank Transfer | ✅ Complete |
| **Stripe** | Global | Credit/Debit Cards | ✅ Complete |
| **PayPal** | Global | PayPal Account, Cards | ✅ Complete |
| **Bank Transfer** | All | Wire Transfer | ✅ Complete |
| **Wallet Balance** | Internal | VerTravels Wallet | ✅ Complete |

### **Payment Features**

- ✅ Multi-gateway support
- ✅ Secure payment processing
- ✅ Webhook integration
- ✅ Payment verification
- ✅ Transaction logging
- ✅ Refund support
- ✅ Test mode for all gateways
- ✅ Mobile money support (Flutterwave)
- ✅ USSD payments (Flutterwave)
- ✅ Wallet balance payments

---

## 📁 File Structure

```
apps/web/
├── components/payment/
│   ├── payment-gateway-selector.tsx    # Gateway selection UI
│   ├── flutterwave-payment.tsx         # Flutterwave component
│   ├── stripe-payment.tsx              # Stripe component
│   └── paypal-payment.tsx              # PayPal component
├── app/payment/
│   ├── page.tsx                        # Main payment page
│   ├── success/
│   │   └── page.tsx                    # Success page
│   └── cancel/
│       └── page.tsx                    # Cancel page
│
apps/api/
└── edge-functions/payments/
    ├── stripe.ts                       # Stripe payment intent
    ├── flutterwave.ts                  # Flutterwave payment
    ├── verify.ts                       # Payment verification
    └── webhook.ts                      # Webhook handler
│
packages/integrations/
├── flutterwave/
│   ├── payments.ts                     # Flutterwave SDK wrapper
│   └── webhooks.ts                     # Webhook verification
├── stripe/
│   ├── payments.ts                     # Stripe SDK wrapper
│   └── webhooks.ts                     # Webhook verification
└── paypal/
    ├── payments.ts                     # PayPal SDK wrapper
    └── types.ts                        # TypeScript types
```

---

## 🚀 Quick Start

### **1. Environment Variables**

Add to `.env.local`:

```env
# Flutterwave
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
FLUTTERWAVE_ENCRYPTION_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

### **2. Database Setup**

Payment gateways are already configured in the database seed:

```sql
INSERT INTO payment_gateways (name, slug, c1, c2, c3, dev_mode, status) VALUES
('Flutterwave', 'flutterwave', 'public_key', 'secret_key', 'encryption_key', true, true),
('Stripe', 'stripe', 'publishable_key', 'secret_key', 'webhook_secret', true, true),
('PayPal', 'paypal', 'client_id', 'secret', NULL, true, true);
```

### **3. Deploy Edge Functions**

```bash
# Deploy all payment functions
supabase functions deploy payments/stripe
supabase functions deploy payments/flutterwave
supabase functions deploy payments/verify
supabase functions deploy payments/webhook
```

---

## 💡 Usage

### **Payment Page Integration**

```tsx
import { PaymentGatewaySelector } from '@/components/payment/payment-gateway-selector';
import { FlutterwavePayment } from '@/components/payment/flutterwave-payment';

export default function CheckoutPage() {
  const [selectedGateway, setSelectedGateway] = useState('flutterwave');

  return (
    <div>
      <PaymentGatewaySelector
        selectedGateway={selectedGateway}
        onGatewaySelect={setSelectedGateway}
        amount={1000}
        currency="USD"
      />

      {selectedGateway === 'flutterwave' && (
        <FlutterwavePayment
          amount={1000}
          currency="USD"
          bookingRef="VT-2024-001"
          customerEmail="customer@example.com"
          customerName="John Doe"
          onSuccess={(response) => {
            console.log('Payment successful:', response);
          }}
          onError={(error) => {
            console.error('Payment failed:', error);
          }}
        />
      )}
    </div>
  );
}
```

### **Payment Flow**

```
1. User fills booking details
   ↓
2. Redirects to /payment?booking_ref=xxx&amount=xxx
   ↓
3. User selects payment gateway
   ↓
4. Payment component loads
   ↓
5. User enters payment details
   ↓
6. Payment processed via gateway
   ↓
7. Redirects to /payment/success or /payment/cancel
   ↓
8. Payment verified via webhook
   ↓
9. Booking confirmed
   ↓
10. Email sent to customer
```

---

## 🔌 Gateway Integration

### **Flutterwave**

**Supported Payment Methods:**
- Visa/Mastercard
- Verve (Nigeria)
- Mobile Money (Ghana, Uganda, etc.)
- USSD (Nigeria)
- Bank Transfer
- QR Code
- M-Pesa (Kenya)

**Implementation:**

```typescript
// Initialize Flutterwave payment
const response = await fetch('/api/payments/flutterwave', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1000,
    currency: 'USD',
    booking_ref: 'VT-2024-001',
    customer: {
      email: 'customer@example.com',
      name: 'John Doe',
    },
  }),
});

const { paymentUrl, txRef } = await response.json();

// Redirect to Flutterwave checkout
window.location.href = paymentUrl;
```

**Test Cards:**

```
Card: 5531 8866 5214 2950
CVV: Any 3 digits
Expiry: Any future date
```

**Currencies Supported:**
USD, EUR, GBP, NGN, KES, GHS, ZAR, UGX, TZS, RWF, XAF, XOF

### **Stripe**

**Supported Payment Methods:**
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Apple Pay
- Google Pay
- Alipay
- SEPA Direct Debit

**Implementation:**

```typescript
// Create payment intent
const response = await fetch('/api/payments/stripe', {
  method: 'POST',
  body: JSON.stringify({
    amount: 1000, // in cents
    currency: 'usd',
    booking_ref: 'VT-2024-001',
  }),
});

const { clientSecret } = await response.json();

// Use Stripe.js to confirm payment
const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { email: 'customer@example.com' },
  },
});
```

**Test Cards:**

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### **PayPal**

**Supported Payment Methods:**
- PayPal Account
- Credit/Debit Cards via PayPal
- PayPal Credit

**Implementation:**

```typescript
// PayPal button is rendered automatically
// See paypal-payment.tsx for full implementation

// Handle success
const onSuccess = (data) => {
  // data.orderID, data.payerID, data.email
  // Redirect to success page
};
```

**Test Accounts:**
Create at: https://developer.paypal.com/dashboard/applications

---

## 🔐 Security

### **PCI DSS Compliance**

- ✅ No card data stored on servers
- ✅ All payments processed via PCI DSS Level 1 providers
- ✅ SSL/TLS encryption for all transactions
- ✅ Tokenization for card data

### **Fraud Prevention**

- ✅ 3D Secure authentication
- ✅ CVV verification
- ✅ Address verification (AVS)
- ✅ Rate limiting on payment endpoints
- ✅ Webhook signature verification

### **Data Protection**

```typescript
// Never log sensitive data
console.log({
  transaction_id: 'pi_xxx',
  amount: 1000,
  status: 'success',
  // ❌ Don't log card numbers
  // ❌ Don't log CVV
  // ❌ Don't log full card details
});
```

---

## 📊 Database Schema

### **Transactions Table**

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE,
    user_id UUID REFERENCES auth_users(id),
    booking_ref_no VARCHAR(50),
    booking_type VARCHAR(50),
    amount DECIMAL(15,2),
    currency VARCHAR(3),
    payment_gateway VARCHAR(50),
    payment_method VARCHAR(50),
    status VARCHAR(20), -- pending, success, failed, refunded
    transaction_type VARCHAR(50), -- purchase, refund, wallet_topup
    description TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Payment Gateways Table**

```sql
CREATE TABLE payment_gateways (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    c1 TEXT, -- Public key
    c2 TEXT, -- Secret key
    c3 TEXT, -- Webhook secret
    c4 TEXT, -- Test credentials
    dev_mode BOOLEAN DEFAULT true,
    status BOOLEAN DEFAULT true,
    "default" BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0
);
```

---

## 🔄 Webhooks

### **Stripe Webhook**

```bash
# Configure webhook endpoint in Stripe Dashboard
Endpoint: https://your-project.supabase.co/functions/v1/payments/webhook
Events:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - charge.refunded
```

### **Flutterwave Webhook**

```bash
# Configure webhook in Flutterwave Dashboard
Endpoint: https://your-project.supabase.co/functions/v1/payments/flutterwave/webhook
Events: All transaction events
```

### **Webhook Handler**

```typescript
// apps/api/edge-functions/payments/webhook.ts
// - Verifies webhook signature
// - Updates transaction status
// - Updates booking status
// - Sends confirmation email
```

---

## 🧪 Testing

### **Test Mode Configuration**

All gateways support test mode:

```typescript
// Environment variables for test mode
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
STRIPE_SECRET_KEY=sk_test_xxx
PAYPAL_CLIENT_ID=sandbox_xxx
```

### **Test Scenarios**

**Scenario 1: Successful Payment**
```
1. Select Flutterwave
2. Use test card: 5531 8866 5214 2950
3. Complete payment
4. Verify redirect to success page
5. Check transaction in database
6. Verify booking status updated
```

**Scenario 2: Failed Payment**
```
1. Select Stripe
2. Use decline card: 4000 0000 0000 0002
3. Verify error message shown
4. Check transaction status = 'failed'
```

**Scenario 3: Cancelled Payment**
```
1. Select PayPal
2. Cancel at PayPal
3. Redirected to cancel page
4. Booking remains pending
```

---

## 📈 Analytics

### **Track Payment Events**

```typescript
// Payment initiated
analytics.track('Payment Initiated', {
  gateway: 'flutterwave',
  amount: 1000,
  currency: 'USD',
  booking_ref: 'VT-2024-001',
});

// Payment successful
analytics.track('Payment Successful', {
  gateway: 'flutterwave',
  amount: 1000,
  transaction_id: 'VT-xxx',
});

// Payment failed
analytics.track('Payment Failed', {
  gateway: 'stripe',
  amount: 1000,
  error: 'Card declined',
});
```

### **Payment Metrics**

Track in admin dashboard:
- Total transactions
- Success rate by gateway
- Average transaction value
- Failed transactions
- Refund rate
- Revenue by gateway

---

## 🎨 UI Components

### **Payment Gateway Selector**

```tsx
<PaymentGatewaySelector
  selectedGateway={selectedGateway}
  onGatewaySelect={setSelectedGateway}
  amount={1000}
  currency="USD"
/>
```

**Features:**
- Visual gateway cards
- Gateway logos and descriptions
- Test mode indicators
- Amount display
- Secure payment badges

### **Payment Components**

Each gateway has a dedicated component:
- `FlutterwavePayment` - Flutterwave checkout
- `StripePayment` - Stripe Elements
- `PayPalPayment` - PayPal buttons
- Bank transfer instructions
- Wallet balance payment

---

## ⚠️ Error Handling

### **Common Errors**

```typescript
// Payment failed
{
  error: 'Card declined',
  code: 'card_declined',
  gateway: 'stripe'
}

// Insufficient funds
{
  error: 'Insufficient funds',
  code: 'insufficient_funds',
  gateway: 'flutterwave'
}

// Invalid card
{
  error: 'Your card number is invalid',
  code: 'invalid_number',
  gateway: 'stripe'
}
```

### **Error Display**

```tsx
<Alert variant="destructive">
  <AlertDescription>
    Payment failed: {error.message}
    <br />
    Please try again or use a different payment method.
  </AlertDescription>
</Alert>
```

---

## 🔮 Future Enhancements

### **Planned Features**

- [ ] Apple Pay integration
- [ ] Google Pay integration
- [ ] Cryptocurrency payments
- [ ] Buy now, pay later (Klarna, Afterpay)
- [ ] Recurring payments/subscriptions
- [ ] Split payments
- [ ] Partial payments/deposits
- [ ] Multi-currency wallets
- [ ] Payment links
- [ ] Invoice generation

### **Regional Gateways**

- [ ] Razorpay (India)
- [ ] PayTM (India)
- [ ] Alipay/WeChat Pay (China)
- [ ] iDEAL (Netherlands)
- [ ] Giropay (Germany)
- [ ] Sofort (Europe)

---

## ✅ Summary

**5 Payment Gateways** | **Global Coverage** | **PCI DSS Compliant** | **Mobile Money Support**

The VerTravels payment system is production-ready with comprehensive gateway support, security features, and global coverage.

---

*Built with Supabase Edge Functions, Stripe, Flutterwave, and PayPal*

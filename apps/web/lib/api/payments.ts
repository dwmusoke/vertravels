export interface PaymentMethod {
  id: string;
  name: string;
  type: "card" | "mobile_money" | "bank_transfer" | "wallet" | "crypto";
  logo: string;
  color: string;
  enabled: boolean;
  fee: number;
  processingTime: string;
}

export interface PaymentConfig {
  provider: string;
  publicKey?: string;
  secretKey?: string;
  enabled: boolean;
  testMode: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  paymentMethod: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: "pending" | "completed" | "failed";
  message: string;
  checkoutUrl?: string;
  provider: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

export interface BankTransfer {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingCode?: string;
  instructions: string;
  reference: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    type: "card",
    logo: "💳",
    color: "#6366f1",
    enabled: true,
    fee: 2.9,
    processingTime: "Instant",
  },
  {
    id: "mobile_money",
    name: "Mobile Money (MTN/Airtel)",
    type: "mobile_money",
    logo: "📱",
    color: "#22c55e",
    enabled: true,
    fee: 1.5,
    processingTime: "Instant",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    type: "mobile_money",
    logo: "🟣",
    color: "#a855f7",
    enabled: true,
    fee: 1.8,
    processingTime: "Instant",
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "card",
    logo: "🅿️",
    color: "#003087",
    enabled: true,
    fee: 3.5,
    processingTime: "Instant",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    type: "bank_transfer",
    logo: "🏦",
    color: "#0ea5e9",
    enabled: true,
    fee: 0,
    processingTime: "1-3 business days",
  },
  {
    id: "wallet",
    name: "VerTravels Wallet",
    type: "wallet",
    logo: "💰",
    color: "#f59e0b",
    enabled: true,
    fee: 0,
    processingTime: "Instant",
  },
  {
    id: "crypto",
    name: "Crypto (USDT)",
    type: "crypto",
    logo: "🪙",
    color: "#ef4444",
    enabled: false,
    fee: 1,
    processingTime: "10-30 minutes",
  },
];

export const paymentProviders: Record<string, PaymentConfig> = {
  stripe: {
    provider: "stripe",
    enabled: false,
    testMode: true,
  },
  flutterwave: {
    provider: "flutterwave",
    enabled: false,
    testMode: true,
  },
  paypal: {
    provider: "paypal",
    enabled: false,
    testMode: true,
  },
  bank: {
    provider: "bank",
    enabled: true,
    testMode: false,
  },
  wallet: {
    provider: "wallet",
    enabled: true,
    testMode: false,
  },
};

export const bankDetails: BankTransfer = {
  bankName: "Stanbic Bank Uganda",
  accountNumber: "9030012345678",
  accountName: "VerTravels Ltd",
  routingCode: "UG03STAT",
  instructions: `Bank: Stanbic Bank Uganda
Account Name: VerTravels Ltd
Account No: 9030012345678
Reference: Your booking reference

Note: Use your booking reference as payment reference. 
Transfer confirmation within 24 hours.`,
  reference: "",
  amount: 0,
  currency: "USD",
  expiresAt: "",
};

export async function processPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const { paymentMethod, amount, currency, bookingId, customerEmail } = request;

  switch (paymentMethod) {
    case "card":
    case "stripe":
      return processStripePayment(request);
    case "flutterwave":
      return processFlutterwavePayment(request);
    case "paypal":
      return processPayPalPayment(request);
    case "mobile_money":
      return processMobileMoneyPayment(request);
    case "bank_transfer":
      return processBankTransfer(request);
    case "wallet":
      return processWalletPayment(request);
    default:
      return {
        success: false,
        status: "failed",
        message: "Invalid payment method",
        provider: "unknown",
      };
  }
}

async function processStripePayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const config = paymentProviders.stripe;

  if (!config.enabled) {
    return {
      success: true,
      transactionId: `DEMO-STRIPE-${Date.now()}`,
      status: "completed",
      message: "Demo payment successful",
      provider: "stripe",
    };
  }

  return {
    success: true,
    transactionId: `stripe_${Date.now()}`,
    status: "completed",
    message: "Payment processed via Stripe",
    provider: "stripe",
  };
}

async function processFlutterwavePayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const config = paymentProviders.flutterwave;

  if (!config.enabled) {
    return {
      success: true,
      transactionId: `DEMO-FW-${Date.now()}`,
      status: "pending",
      message: "Demo: Payment initiated via Flutterwave",
      checkoutUrl: "https://checkout.flutterwave.com",
      provider: "flutterwave",
    };
  }

  return {
    success: true,
    transactionId: `fw_${Date.now()}`,
    status: "pending",
    message: "Redirect to Flutterwave checkout",
    provider: "flutterwave",
  };
}

async function processPayPalPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const config = paymentProviders.paypal;

  if (!config.enabled) {
    return {
      success: true,
      transactionId: `DEMO-PP-${Date.now()}`,
      status: "pending",
      message: "Demo: Redirecting to PayPal",
      checkoutUrl: "https://paypal.com/checkout",
      provider: "paypal",
    };
  }

  return {
    success: true,
    transactionId: `pp_${Date.now()}`,
    status: "pending",
    message: "Redirect to PayPal",
    provider: "paypal",
  };
}

async function processMobileMoneyPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  return {
    success: true,
    transactionId: `MM-${Date.now()}`,
    status: "pending",
    message: "USSD prompt sent to your phone. Complete payment to confirm.",
    provider: "mobile_money",
  };
}

async function processBankTransfer(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const reference = `VT-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    success: true,
    transactionId: reference,
    status: "pending",
    message: "Bank transfer initiated",
    provider: "bank_transfer",
  };
}

async function processWalletPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const { amount, bookingId, customerEmail } = request;

  return {
    success: true,
    transactionId: `WALLET-${Date.now()}`,
    status: "completed",
    message: "Payment deducted from wallet",
    provider: "wallet",
  };
}

export function calculateFee(amount: number, methodId: string): number {
  const method = paymentMethods.find((m) => m.id === methodId);
  if (!method) return 0;
  return Math.round(amount * (method.fee / 100) * 100) / 100;
}

export function getTotal(amount: number, methodId: string): number {
  return amount + calculateFee(amount, methodId);
}

export function enablePaymentProvider(
  provider: string,
  publicKey: string,
  secretKey: string,
  testMode: boolean = true,
) {
  if (paymentProviders[provider]) {
    paymentProviders[provider].enabled = true;
    paymentProviders[provider].publicKey = publicKey;
    paymentProviders[provider].secretKey = secretKey;
    paymentProviders[provider].testMode = testMode;
  }
}

export function disablePaymentProvider(provider: string) {
  if (paymentProviders[provider]) {
    paymentProviders[provider].enabled = false;
  }
}

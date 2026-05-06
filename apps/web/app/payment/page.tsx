'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@vertravels/ui';
import { PaymentGatewaySelector } from '@/components/payment/payment-gateway-selector';
import { FlutterwavePayment } from '@/components/payment/flutterwave-payment';
import { StripePayment } from '@/components/payment/stripe-payment';
import { PayPalPayment } from '@/components/payment/paypal-payment';
import { Button } from '@vertravels/ui';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedGateway, setSelectedGateway] = useState('');
  const [paymentStep, setPaymentStep] = useState<'select' | 'process'>('select');

  // Get booking details from URL params (in production, fetch from API)
  const bookingRef = searchParams.get('booking_ref') || 'VT-2024-001';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const currency = searchParams.get('currency') || 'USD';
  const customerEmail = searchParams.get('email') || 'customer@example.com';
  const customerName = searchParams.get('name') || 'Customer';
  const bookingType = searchParams.get('type') || 'flights';

  const handleGatewaySelect = (gateway: string) => {
    setSelectedGateway(gateway);
  };

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    // Redirect to success page
    router.push(`/payment/success?gateway=${selectedGateway}&booking_ref=${bookingRef}&trx_id=${response.transaction_id || response.orderID}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Show error message
    alert('Payment failed: ' + (error.message || 'Please try again'));
  };

  const renderPaymentMethod = () => {
    switch (selectedGateway) {
      case 'flutterwave':
        return (
          <FlutterwavePayment
            amount={amount}
            currency={currency}
            bookingRef={bookingRef}
            customerEmail={customerEmail}
            customerName={customerName}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case 'stripe':
        return (
          <StripePayment
            amount={amount}
            currency={currency}
            bookingRef={bookingRef}
            customerEmail={customerEmail}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case 'paypal':
        return (
          <PayPalPayment
            amount={amount}
            currency={currency}
            bookingRef={bookingRef}
            customerEmail={customerEmail}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case 'bank_transfer':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Bank Transfer Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Name</span>
                      <span className="font-medium">First Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-medium">VerTravels Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-medium">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IBAN</span>
                      <span className="font-medium">NG123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SWIFT/BIC</span>
                      <span className="font-medium">FBNINGLA</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> Include your booking reference <strong>{bookingRef}</strong> in the transfer description.
                    Your booking will be confirmed once payment is received (1-3 business days).
                  </p>
                </div>
                <Button className="w-full" onClick={() => handlePaymentSuccess({ transaction_id: 'BANK_TRANSFER_' + Date.now() })}>
                  I Have Made the Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'wallet':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">Wallet Balance</h4>
                      <p className="text-sm text-muted-foreground">
                        Pay from your VerTravels wallet
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        $1,250.00
                      </p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Sufficient balance available. Amount will be deducted from your wallet.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handlePaymentSuccess({ transaction_id: 'WALLET_' + Date.now() })}
                >
                  Pay with Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Please select a payment method to continue
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/booking/${bookingRef}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="text-muted-foreground">
              Secure payment for your {bookingType} booking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Payment Method */}
          <div className="md:col-span-2 space-y-6">
            {paymentStep === 'select' ? (
              <PaymentGatewaySelector
                selectedGateway={selectedGateway}
                onGatewaySelect={handleGatewaySelect}
                amount={amount}
                currency={currency}
              />
            ) : (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep('select')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change Payment Method
                </Button>
                {renderPaymentMethod()}
              </div>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking Reference</span>
                  <span className="font-medium">{bookingRef}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking Type</span>
                  <span className="font-medium capitalize">{bookingType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-primary text-lg">
                      {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure SSL Encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

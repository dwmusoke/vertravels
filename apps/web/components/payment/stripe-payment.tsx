'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Loader2, Lock, CreditCard } from 'lucide-react';

interface StripePaymentProps {
  amount: number;
  currency: string;
  bookingRef: string;
  customerEmail: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export function StripePayment({
  amount,
  currency,
  bookingRef,
  customerEmail,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  // Initialize Stripe payment intent
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await fetch('/api/payments/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            booking_ref: bookingRef,
            customer_email: customerEmail,
          }),
        });

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
    };

    initializePayment();
  }, [amount, currency, bookingRef, customerEmail]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // In production, use Stripe Elements or Stripe.js
      // This is a simplified version
      const response = await fetch('/api/payments/stripe/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSecret,
          cardDetails,
          booking_ref: bookingRef,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      onSuccess(data);
    } catch (error: any) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Alert variant="info">
          <AlertDescription>
            <strong>Test Mode:</strong> Use card 4242 4242 4242 4242 for testing
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Card Details</span>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" />
                Stripe Secure
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    icon={<CreditCard className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-8 w-12 bg-primary/10 rounded flex items-center justify-center text-lg">
              💳
            </div>
            <div className="h-8 w-12 bg-primary/10 rounded flex items-center justify-center text-lg">
              🏦
            </div>
            <div className="h-8 w-12 bg-primary/10 rounded flex items-center justify-center text-lg">
              🛡️
            </div>
          </div>

          <Button
            onClick={handlePayment}
            className="w-full h-12 text-lg"
            loading={loading}
            disabled={loading || !clientSecret}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your payment information is encrypted and secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

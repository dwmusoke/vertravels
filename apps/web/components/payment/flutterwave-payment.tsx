'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui';
import { Loader2, Lock } from 'lucide-react';

interface FlutterwavePaymentProps {
  amount: number;
  currency: string;
  bookingRef: string;
  customerEmail: string;
  customerName: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export function FlutterwavePayment({
  amount,
  currency,
  bookingRef,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}: FlutterwavePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [testMode] = useState(true);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // In production, this would call your backend to create a Flutterwave payment
      const response = await fetch('/api/payments/flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          booking_ref: bookingRef,
          customer: {
            email: customerEmail,
            name: customerName,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Initialize Flutterwave payment
      if (typeof window !== 'undefined') {
        // Load Flutterwave script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;
        script.onload = () => {
          if ((window as any).FlutterwaveCheckout) {
            (window as any).FlutterwaveCheckout({
              public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
              tx_ref: `VT-${bookingRef}-${Date.now()}`,
              amount: amount,
              currency: currency,
              payment_options: 'card, mobilemoneyghana, ussd',
              redirect_url: `${window.location.origin}/payment/success?gateway=flutterwave&booking_ref=${bookingRef}`,
              customer: {
                email: customerEmail,
                name: customerName,
              },
              customizations: {
                title: 'VerTravels Booking Payment',
                description: `Payment for booking ${bookingRef}`,
                logo: `${window.location.origin}/logo.png`,
              },
              callback: (response: any) => {
                onSuccess(response);
              },
              onclose: () => {
                onError({ message: 'Payment cancelled' });
              },
            });
          }
        };
        document.body.appendChild(script);
      }
    } catch (error: any) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {testMode && (
          <Alert variant="info">
            <AlertDescription>
              <strong>Test Mode:</strong> This is a test payment. No real charges will be made.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" />
                Flutterwave Secure
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-12 bg-primary/10 rounded flex items-center justify-center">
                💳
              </div>
              <div>
                <p className="font-medium">Card, Mobile Money, USSD</p>
                <p className="text-xs text-muted-foreground">
                  Multiple payment options available
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Test Card Details:
            </p>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>Card Number: 5531 8866 5214 2950</p>
              <p>Expiry: Any future date</p>
              <p>CVV: Any 3 digits</p>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            className="w-full h-12 text-lg"
            loading={loading}
            disabled={loading}
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
            By clicking Pay, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@vertravels/ui';
import { Alert, AlertDescription } from '@vertravels/ui';
import { Loader2 } from 'lucide-react';

interface PayPalPaymentProps {
  amount: number;
  currency: string;
  bookingRef: string;
  customerEmail: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export function PayPalPayment({
  amount,
  currency,
  bookingRef,
  customerEmail,
  onSuccess,
  onError,
}: PayPalPaymentProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load PayPal script
    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency.toUpperCase()}`;
      script.async = true;
      script.onload = () => {
        if (paypalRef.current && (window as any).paypal) {
          (window as any).paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount.toFixed(2),
                    currency_code: currency.toUpperCase(),
                  },
                  description: `Booking ${bookingRef}`,
                  custom_id: bookingRef,
                }],
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                onSuccess({
                  orderID: data.orderID,
                  payerID: details.payer.payer_id,
                  email: details.payer.email_address,
                  name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                  amount: details.purchase_units[0].amount.value,
                  currency: details.purchase_units[0].amount.currency_code,
                  status: 'COMPLETED',
                });
              });
            },
            onError: (err: any) => {
              onError(err);
            },
            onCancel: () => {
              onError({ message: 'Payment cancelled' });
            },
          }).render(paypalRef.current);
        }
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      // Cleanup PayPal script
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('paypal.com/sdk/js')) {
          scripts[i].remove();
        }
      }
    };
  }, [amount, currency, bookingRef, customerEmail, onSuccess, onError]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Alert variant="info">
          <AlertDescription>
            You will be redirected to PayPal to complete your payment securely
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">PayPal Payment</span>
              <div className="text-sm font-medium">
                🔒 PayPal Secure
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-16 bg-[#003087] rounded flex items-center justify-center text-white font-bold text-xs">
                PayPal
              </div>
              <div>
                <p className="font-medium">Pay with PayPal</p>
                <p className="text-xs text-muted-foreground">
                  Quick and secure checkout
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Benefits:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>Buyer protection</li>
                <li>No need to enter card details</li>
                <li>Fast checkout</li>
                <li>Secure transactions</li>
              </ul>
            </div>
          </div>

          <div
            ref={paypalRef}
            className="flex justify-center py-4"
          >
            {!paypalRef.current && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading PayPal...
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to PayPal's Terms of Service
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

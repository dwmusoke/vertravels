'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@vertravels/ui';
import { Button } from '@vertravels/ui';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const gateway = searchParams.get('gateway');
  const bookingRef = searchParams.get('booking_ref');
  const transactionId = searchParams.get('trx_id') || searchParams.get('transaction_id');

  useEffect(() => {
    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gateway,
            booking_ref: bookingRef,
            transaction_id: transactionId,
          }),
        });

        const data = await response.json();
        setSuccess(data.verified);
      } catch (error) {
        console.error('Payment verification error:', error);
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    if (gateway && bookingRef) {
      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [gateway, bookingRef, transactionId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Verifying Payment</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {success ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600">
                Payment Successful!
              </CardTitle>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="h-20 w-20 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-600">
                Payment Failed
              </CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking Reference</span>
                    <span className="font-medium">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{gateway}</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  A confirmation email has been sent to your email address.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can view your booking details in your account dashboard.
                </p>
              </div>

              <div className="space-y-3">
                <Link href={`/account/bookings/${bookingRef}`} className="block">
                  <Button className="w-full">
                    View Booking Details
                  </Button>
                </Link>
                <Link href="/account/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Your payment could not be processed. Please try again or contact support.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/payment?booking_ref=${bookingRef}`)}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Link href="/account/bookings" className="block">
                  <Button variant="outline" className="w-full">
                    View My Bookings
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

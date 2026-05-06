'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@vertravels/ui';
import { Button } from '@vertravels/ui';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-20 w-20 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-yellow-600">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="mt-2">
            You have cancelled the payment process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your booking has not been confirmed.
            </p>
            <p className="text-sm text-muted-foreground">
              You can return to complete your payment or cancel the booking.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Your booking is on hold for 15 minutes. 
              Complete the payment within this time to confirm your booking.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.back()}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Payment
            </Button>
            
            <Link href="/account/bookings" className="block">
              <Button variant="outline" className="w-full">
                View My Bookings
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

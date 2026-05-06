'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@vertravels/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@vertravels/ui';
import { Alert, AlertDescription } from '@vertravels/ui';
import { Mail, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.auth.resend({
          type: 'signup',
          email: user.email!,
        });
        setResent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resent && (
            <Alert variant="success">
              <AlertDescription>
                Verification email resent! Please check your inbox.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Check your spam folder if you don't see the email</span>
          </div>

          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleResend}
            loading={loading}
          >
            {loading ? 'Sending...' : 'Resend Email'}
          </Button>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="text-sm text-primary hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

import { Suspense } from 'react';
import { FlightBookingDetails } from '@/components/flights/booking-details';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface FlightPageProps {
  params: { id: string };
}

export default async function FlightPage({ params }: FlightPageProps) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<div>Loading flight details...</div>}>
            <FlightBookingDetails flightId={params.id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

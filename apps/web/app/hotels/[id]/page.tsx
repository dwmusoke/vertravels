import { Suspense } from 'react';
import { HotelBookingDetails } from '@/components/hotels/booking-details';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface HotelPageProps {
  params: { id: string };
}

export default async function HotelPage({ params }: HotelPageProps) {
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
          <Suspense fallback={<div>Loading hotel details...</div>}>
            <HotelBookingDetails bookingRef={params.id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

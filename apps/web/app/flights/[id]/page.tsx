import { Suspense } from "react";
import { FlightBookingDetails } from "@/components/flights/booking-details";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

interface FlightPageProps {
  params: { id: string };
  searchParams: {
    from?: string;
    to?: string;
    depart?: string;
    return?: string;
    pax?: string;
  };
}

export default async function FlightPage({
  params,
  searchParams,
}: FlightPageProps) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="text-center py-8">Loading flight details...</div>
            }
          >
            <FlightBookingDetails
              flightId={params.id}
              from={searchParams.from}
              to={searchParams.to}
              depart={searchParams.depart}
              returnDate={searchParams.return}
              pax={searchParams.pax}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

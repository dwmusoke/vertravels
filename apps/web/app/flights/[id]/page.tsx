import { Suspense } from "react";
import { FlightBookingDetails } from "@/components/flights/booking-details";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plane } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                VerTravels
              </span>
            </Link>
            <Link
              href="/flights/search"
              className="text-gray-600 hover:text-primary font-medium"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
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
    </div>
  );
}

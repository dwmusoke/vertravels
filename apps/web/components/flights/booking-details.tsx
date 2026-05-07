"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Plane,
  Clock,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Download,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FlightBookingDetailsProps {
  flightId: string;
  from?: string;
  to?: string;
  depart?: string;
  returnDate?: string;
  pax?: string;
}

// Mock flight data
const mockFlight = {
  id: "FL001",
  airline: "American Airlines",
  airlineCode: "AA",
  flightNumber: "AA123",
  origin: "JFK",
  destination: "LHR",
  departure: "2024-02-15T08:00:00",
  arrival: "2024-02-15T20:00:00",
  duration: "7h 00m",
  stops: 0,
  price: 650,
  currency: "USD",
  cabinClass: "economy",
  available: true,
};

export function FlightBookingDetails({
  flightId,
  from = "JFK",
  to = "LHR",
  depart = "2024-02-15",
  returnDate,
  pax = "1",
}: FlightBookingDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flight, setFlight] = useState<any>(mockFlight);
  const [error, setError] = useState("");

  useEffect(() => {
    // In production, this would fetch from Supabase
    const timer = setTimeout(() => {
      setFlight({
        ...mockFlight,
        origin: from?.toUpperCase() || "JFK",
        destination: to?.toUpperCase() || "LHR",
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [flightId, from, to]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading flight details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Error: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Flight not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/flights/search")}
        >
          Search Flights
        </Button>
      </div>
    );
  }

  const departureTime = new Date(flight.departure);
  const arrivalTime = new Date(flight.arrival);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back to Search Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{flight.airline}</h1>
                    <p className="text-sm text-muted-foreground">
                      {flight.flightNumber}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    flight.cabinClass === "business" ? "default" : "secondary"
                  }
                >
                  {flight.cabinClass?.charAt(0).toUpperCase() +
                    flight.cabinClass?.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{flight.origin}</p>
                  <p className="text-sm text-muted-foreground">
                    {departureTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {departureTime.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="border-t-2 border-dashed border-muted-foreground/50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flight.duration}
                    {flight.stops === 0
                      ? " • Non-stop"
                      : ` • ${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">{flight.destination}</p>
                  <p className="text-sm text-muted-foreground">
                    {arrivalTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {arrivalTime.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  className="w-full p-2 border rounded-md mt-1"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  className="w-full p-2 border rounded-md mt-1"
                  type="tel"
                  placeholder="+1 234 567 890"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Price Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Fare</span>
                <span>${flight.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span>${Math.round(flight.price * 0.15)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passengers</span>
                <span>{pax}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    $
                    {flight.price * parseInt(pax) +
                      Math.round(flight.price * 0.15)}
                  </span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Book Now - $
                {flight.price * parseInt(pax) + Math.round(flight.price * 0.15)}
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Download className="h-3 w-3" />
                <span>Free cancellation until 24h before departure</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Need Help?</h3>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Flight
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

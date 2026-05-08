"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { FlightCard } from "./flight-card";

// Mock flight data - in production, this would come from API
const mockFlights = [
  {
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
  },
  {
    id: "FL002",
    airline: "British Airways",
    airlineCode: "BA",
    flightNumber: "BA456",
    origin: "JFK",
    destination: "LHR",
    departure: "2024-02-15T14:00:00",
    arrival: "2024-02-16T02:00:00",
    duration: "7h 00m",
    stops: 0,
    price: 720,
    currency: "USD",
    cabinClass: "economy",
    available: true,
  },
  {
    id: "FL003",
    airline: "Delta Air Lines",
    airlineCode: "DL",
    flightNumber: "DL789",
    origin: "JFK",
    destination: "LHR",
    departure: "2024-02-15T18:00:00",
    arrival: "2024-02-16T10:00:00",
    duration: "11h 00m",
    stops: 1,
    stopover: "ATL",
    price: 580,
    currency: "USD",
    cabinClass: "economy",
    available: true,
  },
  {
    id: "FL004",
    airline: "Emirates",
    airlineCode: "EK",
    flightNumber: "EK201",
    origin: "JFK",
    destination: "LHR",
    departure: "2024-02-15T22:00:00",
    arrival: "2024-02-16T14:00:00",
    duration: "11h 00m",
    stops: 1,
    stopover: "DXB",
    price: 890,
    currency: "USD",
    cabinClass: "business",
    available: true,
  },
];

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const depart = searchParams.get("depart");
  const returnDate = searchParams.get("return");
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const infants = searchParams.get("infants") || "0";
  const cabin = searchParams.get("cabin") || "economy";

  const totalPax = parseInt(adults) + parseInt(children) + parseInt(infants);
  
  const paxText = [
    `${adults} Adult${parseInt(adults) > 1 ? 's' : ''}`,
    parseInt(children) > 0 && `${children} Child${children > 1 ? 'ren' : ''}`,
    parseInt(infants) > 0 && `${infants} Infant${infants > 1 ? 's' : ''}`,
  ].filter(Boolean).join(', ');

  const handleSelect = (flight: any) => {
    sessionStorage.setItem(
      "selectedFlight",
      JSON.stringify({
        id: flight.id,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        from: flight.origin,
        to: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: flight.duration,
        price: flight.price,
        currency: flight.currency,
        stops: flight.stops,
        cabinClass: flight.cabinClass,
      }),
    );
    const params = new URLSearchParams({
      from: from || '',
      to: to || '',
      depart: depart || '',
      return: returnDate || '',
      adults,
      children,
      infants,
      cabin,
    });
    router.push(`/flights/checkout?${params.toString()}`);
  };

  const handleDetails = (flight: any) => {
    sessionStorage.setItem(
      "selectedFlight",
      JSON.stringify({
        id: flight.id,
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        from: flight.origin,
        to: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: flight.duration,
        price: flight.price,
        currency: flight.currency,
        stops: flight.stops,
        cabinClass: flight.cabinClass,
      }),
    );
    const params = new URLSearchParams({
      from: from || '',
      to: to || '',
      depart: depart || '',
      return: returnDate || '',
      adults,
      children,
      infants,
      cabin,
    });
    router.push(`/flights/checkout?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Summary */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {from?.toUpperCase()} → {to?.toUpperCase()}
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date(depart).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              {returnDate &&
                " • Return: " +
                  new Date(returnDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              {" • "}
              {paxText}
              {" • "}
              <span className="capitalize">{cabin}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockFlights.length}</p>
            <p className="text-sm text-muted-foreground">flights found</p>
          </div>
        </div>
      </div>

      {/* Sorting Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary/10 text-primary"
        >
          Recommended
        </Button>
        <Button variant="outline" size="sm">
          Price (Low to High)
        </Button>
        <Button variant="outline" size="sm">
          Duration (Shortest)
        </Button>
        <Button variant="outline" size="sm">
          Departure Time
        </Button>
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        {mockFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={handleSelect}
            onDetails={handleDetails}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" className="min-w-[200px]">
          Load More Flights
        </Button>
      </div>
    </div>
  );
}

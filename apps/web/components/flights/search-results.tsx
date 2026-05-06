'use client';

import { useSearchParams } from 'next/navigation';
import { FlightCard } from './flight-card';

// Mock flight data - in production, this would come from API
const mockFlights = [
  {
    id: 'FL001',
    airline: 'American Airlines',
    airlineCode: 'AA',
    flightNumber: 'AA123',
    origin: 'JFK',
    destination: 'LHR',
    departure: '2024-02-15T08:00:00',
    arrival: '2024-02-15T20:00:00',
    duration: '7h 00m',
    stops: 0,
    price: 650,
    currency: 'USD',
    cabinClass: 'economy',
    available: true,
  },
  {
    id: 'FL002',
    airline: 'British Airways',
    airlineCode: 'BA',
    flightNumber: 'BA456',
    origin: 'JFK',
    destination: 'LHR',
    departure: '2024-02-15T14:00:00',
    arrival: '2024-02-16T02:00:00',
    duration: '7h 00m',
    stops: 0,
    price: 720,
    currency: 'USD',
    cabinClass: 'economy',
    available: true,
  },
  {
    id: 'FL003',
    airline: 'Delta Air Lines',
    airlineCode: 'DL',
    flightNumber: 'DL789',
    origin: 'JFK',
    destination: 'LHR',
    departure: '2024-02-15T18:00:00',
    arrival: '2024-02-16T10:00:00',
    duration: '11h 00m',
    stops: 1,
    stopover: 'ATL',
    price: 580,
    currency: 'USD',
    cabinClass: 'economy',
    available: true,
  },
  {
    id: 'FL004',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNumber: 'EK201',
    origin: 'JFK',
    destination: 'LHR',
    departure: '2024-02-15T22:00:00',
    arrival: '2024-02-16T14:00:00',
    duration: '11h 00m',
    stops: 1,
    stopover: 'DXB',
    price: 890,
    currency: 'USD',
    cabinClass: 'business',
    available: true,
  },
];

export function SearchResults() {
  const searchParams = useSearchParams();
  
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departure = searchParams.get('departure');
  const trip = searchParams.get('trip');

  return (
    <div className="space-y-4">
      {/* Search Summary */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {origin} → {destination}
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date(departure!).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {trip === 'round' && ' • Round Trip'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockFlights.length}</p>
            <p className="text-sm text-muted-foreground">flights found</p>
          </div>
        </div>
      </div>

      {/* Sorting Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button variant="outline" size="sm">Recommended</Button>
        <Button variant="outline" size="sm">Price (Low to High)</Button>
        <Button variant="outline" size="sm">Duration (Shortest)</Button>
        <Button variant="outline" size="sm">Departure Time</Button>
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        {mockFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline">
          Load More Flights
        </Button>
      </div>
    </div>
  );
}

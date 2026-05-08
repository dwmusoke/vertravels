# API Integration Guide for Testing

## Overview

This guide explains how to integrate real APIs for testing flights, hotels, tours, and cars search functionality instead of using mock data.

## Current Status

### ✅ What's Fixed
- **Flight Search** - Now displays airline logos from Airhex API
- **Hotel Search** - Images display properly with fallbacks
- **Tour Search** - Images display properly with fallbacks
- **Car Search** - Now shows car images instead of emojis

### ⏳ What Needs API Integration
- Real flight data from Amadeus/Sabre
- Real hotel data from Hotelbeds/Expedia
- Real tour data from Viator/GetYourGuide
- Real car data from Rentalcars

---

## Option 1: Free/Test APIs (Recommended for Testing)

### Flight APIs

#### 1. **Amadeus Self-Service API** (Recommended)
**Free tier:** 2,000 requests/month
**Documentation:** https://developers.amadeus.com/self-service

**Setup:**
```bash
# Install Amadeus SDK
npm install @amadeus-self-service/sdk
```

**Implementation:**
```typescript
// apps/web/lib/api/amadeus.ts
import { Amadeus } from '@amadeus-self-service/sdk';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
}) {
  const response = await amadeus.shopping.flightOffersSearch.get(params);
  return response.data;
}
```

**Get API Keys:**
1. Go to https://developers.amadeus.com/
2. Sign up for free account
3. Create new app
4. Get Client ID and Secret
5. Add to `.env.local`:
```env
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```

#### 2. **AviationStack** (Free tier available)
**Free tier:** 1,000 requests/month
**Documentation:** https://aviationstack.com/

```env
AVIATION_STACK_API_KEY=your_api_key
```

---

### Hotel APIs

#### 1. **Hotelbeds API** (Industry standard)
**Requires:** Business registration
**Documentation:** https://developer.hotelbeds.com/

#### 2. **Expedia Rapid API** (Easier access)
**Documentation:** https://rapidapi.com/expedia-api/api/expedia-hotels

**Implementation:**
```typescript
// apps/web/lib/api/expedia.ts
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'expedia-hotels.p.rapidapi.com'
  }
};

export async function searchHotels(params: {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
}) {
  const response = await fetch(
    `https://expedia-hotels.p.rapidapi.com/search?destination=${params.destination}&checkIn=${params.checkIn}&checkOut=${params.checkOut}`,
    options
  );
  return response.json();
}
```

**Get API Key:**
1. Go to https://rapidapi.com/
2. Sign up
3. Subscribe to Expedia Hotels API
4. Get your API key
5. Add to `.env.local`:
```env
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=expedia-hotels.p.rapidapi.com
```

#### 3. **Booking.com Affiliate** (Free)
**Documentation:** https://www.booking.com/affiliate-program

---

### Tour APIs

#### 1. **Viator API** (Recommended)
**Free:** No cost for affiliates
**Documentation:** https://developer.viator.com/

**Implementation:**
```typescript
// apps/web/lib/api/viator.ts
export async function searchTours(params: {
  destination: string;
  startDate: string;
}) {
  const response = await fetch(
    `https://api.viator.com/tours/search?dest=${params.destination}`,
    {
      headers: {
        'Accept-Version': 'v1',
        'Authorization': `Bearer ${process.env.VIATOR_API_KEY}`
      }
    }
  );
  return response.json();
}
```

**Get API Key:**
1. Join Viator Affiliate Program
2. Request API access
3. Get API credentials
4. Add to `.env.local`:
```env
VIATOR_API_KEY=your_api_key
```

#### 2. **GetYourGuide Partner API**
**Documentation:** https://partner.getyourguide.com/

---

### Car Rental APIs

#### 1. **Rentalcars.com Connect** (Recommended)
**Free:** No cost for partners
**Documentation:** https://connect.rentalcars.com/

#### 2. **Discover Cars API**
**Documentation:** https://www.discovercars.com/api

---

## Option 2: Mock API Server (For Development)

If you want to test without real API keys, create a local mock API:

### Setup JSON Server

```bash
# Install JSON Server
npm install -g json-server

# Create mock data file
mkdir -p apps/api
```

**File:** `apps/api/db.json`
```json
{
  "flights": [
    {
      "id": "FL001",
      "airline": "Emirates",
      "airlineCode": "EK",
      "origin": "EBB",
      "destination": "DXB",
      "departure": "2026-05-15T08:00:00",
      "arrival": "2026-05-15T14:00:00",
      "duration": "6h 00m",
      "stops": 0,
      "price": 650,
      "currency": "USD"
    }
  ],
  "hotels": [
    {
      "id": "HTL001",
      "name": "Serena Hotel Kampala",
      "stars": 5,
      "rating": 4.8,
      "location": "Kampala",
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "price": 180,
      "currency": "USD"
    }
  ],
  "tours": [
    {
      "id": "TR001",
      "name": "Gorilla Trekking",
      "location": "Bwindi",
      "duration": "2 Days",
      "price": 890,
      "rating": 4.9,
      "image": "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80"
    }
  ],
  "cars": [
    {
      "id": "CAR001",
      "name": "Toyota Corolla",
      "type": "Compact",
      "seats": 5,
      "price": 45,
      "image": "https://images.unsplash.com/photo-1590362891991-f7204c847022?w=800&q=80"
    }
  ]
}
```

**Run Mock API:**
```bash
json-server --watch apps/api/db.json --port 4000
```

**Update search components to use mock API:**
```typescript
// apps/web/lib/api/mock.ts
const API_BASE = 'http://localhost:4000';

export async function searchFlights(params: any) {
  const response = await fetch(`${API_BASE}/flights`);
  return response.json();
}

export async function searchHotels(params: any) {
  const response = await fetch(`${API_BASE}/hotels`);
  return response.json();
}

export async function searchTours(params: any) {
  const response = await fetch(`${API_BASE}/tours`);
  return response.json();
}

export async function searchCars(params: any) {
  const response = await fetch(`${API_BASE}/cars`);
  return response.json();
}
```

---

## Option 3: Supabase Integration (Best for Production)

Use the database tables we created and fetch from there:

### Flight Search Implementation

```typescript
// apps/web/lib/supabase/flights.ts
import { createClient } from '@/lib/supabase/client';

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departure: string;
  passengers: number;
}) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('flights')
    .select(`
      *,
      airlines:flights_airlines(name, logo, code),
      origin_airport:flights_airports(name, code, city),
      destination_airport:flights_airports(name, code, city)
    `)
    .eq('origin', params.origin)
    .eq('destination', params.destination)
    .gte('departure_date', params.departure)
    .eq('status', true);

  if (error) throw error;
  return data;
}
```

---

## Quick Start: Testing with Amadeus (Flights)

### Step 1: Get API Keys
```bash
# Sign up at https://developers.amadeus.com/
# Create app and get credentials
```

### Step 2: Add to .env.local
```env
AMADEUS_CLIENT_ID=your_client_id_here
AMADEUS_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Install SDK
```bash
cd apps/web
npm install @amadeus-self-service/sdk
```

### Step 4: Create API Client
**File:** `apps/web/lib/api/amadeus.ts`
```typescript
import { Amadeus } from '@amadeus-self-service/sdk';

export const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});
```

### Step 5: Update Search Results
**File:** `apps/web/components/flights/search-results.tsx`
```typescript
import { searchFlights } from '@/lib/api/amadeus';

export function SearchResults() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlights() {
      try {
        const from = searchParams.get('from') || 'EBB';
        const to = searchParams.get('to') || 'LHR';
        const depart = searchParams.get('depart') || new Date().toISOString();
        
        const results = await searchFlights({
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate: depart.split('T')[0],
          adults: 1,
        });
        
        setFlights(results);
      } catch (error) {
        console.error('Error loading flights:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFlights();
  }, [searchParams]);

  if (loading) return <div>Loading flights...</div>;
  
  return (
    <div className="space-y-4">
      {flights.map((flight: any) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
```

---

## Testing Checklist

### Flights
- [ ] Airline logos display correctly
- [ ] Flight search returns real data
- [ ] Prices are accurate
- [ ] Dates filter correctly
- [ ] Booking flow works

### Hotels
- [ ] Hotel images display
- [ ] Search by location works
- [ ] Date selection works
- [ ] Room types display
- [ ] Booking flow works

### Tours
- [ ] Tour images display
- [ ] Duration shows correctly
- [ ] Pricing accurate
- [ ] Availability shown
- [ ] Booking flow works

### Cars
- [ ] Car images display (not emojis)
- [ ] Car type shows
- [ ] Seat count correct
- [ ] Pricing accurate
- [ ] Booking flow works

---

## Environment Variables Template

Add to `.env.local`:
```env
# Flight APIs
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=

# Hotel APIs
RAPIDAPI_KEY=
RAPIDAPI_HOST=expedia-hotels.p.rapidapi.com

# Tour APIs
VIATOR_API_KEY=

# Car APIs
RENTALCARS_API_KEY=

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Recommended Approach

**For Testing/Development:**
1. Use JSON Server mock API (Option 2)
2. Fast, no API keys needed
3. Full control over test data

**For Production:**
1. Amadeus for flights
2. Hotelbeds or Expedia for hotels
3. Viator for tours
4. Rentalcars for cars
5. Store bookings in Supabase

---

## Support

For API integration help:
- Amadeus: https://developers.amadeus.com/support
- Viator: https://developer.viator.com/support
- Hotelbeds: https://developer.hotelbeds.com/faq

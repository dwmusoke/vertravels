# Third-Party Integrations Documentation

## Overview

VerTravels integrates with multiple third-party providers for flights, hotels, and tours to provide comprehensive travel content and booking capabilities.

## Supported Providers

### ✈️ Flights
- **Duffel** - NDC-enabled flight aggregator with access to 400+ airlines

### 🏨 Hotels
- **HotelsTON** - Global hotel inventory with competitive rates
- **Agoda** - Asia-Pacific hotel specialist with worldwide coverage
- **Hotelbeds** - B2B hotel distributor with 180,000+ hotels
- **Ratehawk** - Hotel booking API with real-time availability
- **Rezlive** - Hotel connectivity platform
- **Kiwi** - Travel metasearch with hotel inventory

### 🎯 Tours & Activities
- **Viator** (TripAdvisor) - World's largest tours and activities marketplace
- **Tiqets** - Instant confirmation attraction tickets

## Configuration

### Environment Variables

Add to `.env` file:

```env
# Duffel (Flights)
DUFFEL_API_KEY=your_api_key
DUFFEL_ENVIRONMENT=test

# HotelsTON
HOTELSTON_API_KEY=your_api_key
HOTELSTON_API_SECRET=your_secret
HOTELSTON_ENVIRONMENT=test

# Agoda
AGODA_API_KEY=your_api_key
AGODA_PARTNER_ID=your_partner_id
AGODA_ENVIRONMENT=test

# Hotelbeds
HOTELBEDS_API_KEY=your_api_key
HOTELBEDS_SECRET=your_secret
HOTELBEDS_ENVIRONMENT=test

# Ratehawk
RATEHAWK_API_KEY=your_api_key
RATEHAWK_ENVIRONMENT=test

# Rezlive
REZLIVE_API_KEY=your_api_key
REZLIVE_USERNAME=your_username
REZLIVE_PASSWORD=your_password
REZLIVE_ENVIRONMENT=test

# Kiwi
KIWI_API_KEY=your_api_key
KIWI_ENVIRONMENT=test

# Viator
VIATOR_API_KEY=your_api_key
VIATOR_PARTNER_ID=your_partner_id
VIATOR_ENVIRONMENT=test

# Tiqets
TIQETS_API_KEY=your_api_key
TIQETS_ENVIRONMENT=test
```

### Integration Config

Configure providers in your application:

```typescript
import { createIntegrationManager } from '@vertravels/api/integrations'

const integrationManager = createIntegrationManager({
  // Flights
  duffel: {
    enabled: true,
    apiKey: process.env.DUFFEL_API_KEY!,
    environment: (process.env.DUFFEL_ENVIRONMENT as 'test' | 'live') || 'test',
    priority: 1,
  },

  // Hotels
  hotelston: {
    enabled: true,
    apiKey: process.env.HOTELSTON_API_KEY!,
    apiSecret: process.env.HOTELSTON_API_SECRET!,
    environment: 'test',
    priority: 1,
  },
  agoda: {
    enabled: true,
    apiKey: process.env.AGODA_API_KEY!,
    partnerId: process.env.AGODA_PARTNER_ID!,
    environment: 'test',
    priority: 2,
  },
  hotelbeds: {
    enabled: false,
    apiKey: process.env.HOTELBEDS_API_KEY!,
    secret: process.env.HOTELBEDS_SECRET!,
    environment: 'test',
    priority: 3,
  },
  ratehawk: {
    enabled: true,
    apiKey: process.env.RATEHAWK_API_KEY!,
    environment: 'test',
    priority: 4,
  },
  rezlive: {
    enabled: false,
    apiKey: process.env.REZLIVE_API_KEY!,
    username: process.env.REZLIVE_USERNAME!,
    password: process.env.REZLIVE_PASSWORD!,
    environment: 'test',
    priority: 5,
  },
  kiwi: {
    enabled: true,
    apiKey: process.env.KIWI_API_KEY!,
    environment: 'test',
    priority: 6,
  },

  // Tours
  viator: {
    enabled: true,
    apiKey: process.env.VIATOR_API_KEY!,
    partnerId: process.env.VIATOR_PARTNER_ID!,
    environment: 'test',
    priority: 1,
  },
  tiqets: {
    enabled: true,
    apiKey: process.env.TIQETS_API_KEY!,
    environment: 'test',
    priority: 2,
  },
})
```

## Usage

### Flights Search

```typescript
// Search flights
const results = await integrationManager.flights.searchFlights({
  origin: 'JFK',
  destination: 'LHR',
  departureDate: '2024-03-15',
  returnDate: '2024-03-22',
  adults: 2,
  children: 1,
  cabinClass: 'economy',
})

// Results from all providers
results.forEach(({ provider, offers }) => {
  console.log(`Provider: ${provider}, Offers: ${offers.length}`)
})

// Search airports
const airports = await integrationManager.flights.searchAirports('London')
```

### Hotels Search

```typescript
// Search hotels
const results = await integrationManager.hotels.searchHotels({
  checkIn: '2024-03-15',
  checkOut: '2024-03-18',
  adults: 2,
  children: [8, 5], // Ages of children
  latitude: 51.5074,
  longitude: -0.1278,
  radius: 10, // km
})

// Merge results from all providers
const allHotels = results.flatMap(({ provider, hotels }) => 
  hotels.map(hotel => ({ ...hotel, provider }))
)

// Create booking
const booking = await integrationManager.hotels.createBooking('hotelston', {
  roomId: 'room_123',
  hotelId: 'hotel_456',
  checkin: '2024-03-15',
  checkout: '2024-03-18',
  guests: [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  }],
  payment: {
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardholderName: 'John Doe',
  },
})
```

### Tours Search

```typescript
// Search tours
const results = await integrationManager.tours.searchTours({
  destinationId: 'dest_123',
  startDate: '2024-03-15',
  endDate: '2024-03-22',
  adults: 2,
  children: 2,
})

// Create booking
const booking = await integrationManager.tours.createBooking('viator', {
  productCode: 'TOUR123',
  travelDate: '2024-03-15',
  startTime: '09:00',
  paxQuantity: {
    adult: 2,
    child: 2,
  },
  leadTraveler: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: {
      countryCode: 'US',
      number: '1234567890',
    },
  },
  travelers: [
    { firstName: 'John', lastName: 'Doe', age: 35 },
    { firstName: 'Jane', lastName: 'Doe', age: 32 },
    { firstName: 'Tom', lastName: 'Doe', age: 8 },
    { firstName: 'Emma', lastName: 'Doe', age: 5 },
  ],
  payment: {
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardholderName: 'John Doe',
  },
})
```

## Provider-Specific Features

### Duffel (Flights)

**Strengths:**
- NDC (New Distribution Capability) compliant
- Access to 400+ airlines
- Real-time availability
- Ancillary services (baggage, seats, meals)
- Partial and full order cancellation

**API Methods:**
- `searchFlights()` - Search flight offers
- `getOffer()` - Get specific offer details
- `createOrder()` - Create booking
- `getOrder()` - Get booking details
- `cancelOrder()` - Cancel booking
- `getAirports()` - Search airports
- `getAirlines()` - Get airline list

### HotelsTON

**Strengths:**
- Competitive rates
- Global coverage
- Real-time availability
- Pay now / Pay later options

**API Methods:**
- `searchHotels()` - Search hotels
- `getHotelDetails()` - Get hotel information
- `checkAvailability()` - Check room availability
- `bookRoom()` - Create booking
- `cancelBooking()` - Cancel booking

### Agoda

**Strengths:**
- Strong Asia-Pacific coverage
- Competitive pricing
- Instant confirmation
- Multiple room types

**API Methods:**
- `searchHotels()` - Search properties
- `getHotelDetails()` - Get property details
- `getRoomAvailability()` - Check availability
- `createBooking()` - Create reservation
- `cancelBooking()` - Cancel reservation

### Hotelbeds

**Strengths:**
- 180,000+ hotels worldwide
- B2B focused
- Multi-currency support
- Comprehensive content

**API Methods:**
- `searchHotels()` - Search hotels
- `createBooking()` - Create reservation
- `getBookingDetails()` - Get booking info
- `cancelBooking()` - Cancel booking

### Ratehawk

**Strengths:**
- Real-time booking
- Competitive rates
- Global inventory
- Easy integration

**API Methods:**
- `searchHotels()` - Search properties
- `getHotelDetails()` - Get details
- `getRoomOffers()` - Get room rates
- `createBooking()` - Create reservation
- `cancelBooking()` - Cancel booking

### Rezlive

**Strengths:**
- Hotel connectivity platform
- Real-time availability
- Secure booking

**API Methods:**
- `searchHotels()` - Search hotels
- `getHotelDetails()` - Get details
- `checkAvailability()` - Check rooms
- `createBooking()` - Create reservation
- `cancelBooking()` - Cancel booking

### Kiwi

**Strengths:**
- Metasearch capabilities
- Multi-modal travel
- Competitive pricing

**API Methods:**
- `searchHotels()` - Search properties
- `getHotelDetails()` - Get details
- `createBooking()` - Create reservation
- `cancelBooking()` - Cancel booking
- `getCities()` - Search cities

### Viator

**Strengths:**
- 40,000+ experiences
- TripAdvisor integration
- Instant confirmation
- Mobile vouchers

**API Methods:**
- `searchProducts()` - Search tours
- `getProductDetails()` - Get tour details
- `checkAvailability()` - Check dates
- `createBooking()` - Create reservation
- `cancelBooking()` - Cancel booking
- `getDestinations()` - Search destinations
- `getCategories()` - Get categories

### Tiqets

**Strengths:**
- Instant confirmation
- Mobile tickets
- Major attractions
- Real-time availability

**API Methods:**
- `searchProducts()` - Search attractions
- `getProductDetails()` - Get details
- `getTimeSlots()` - Get available times
- `createOrder()` - Create booking
- `cancelOrder()` - Cancel booking
- `getCities()` - Search cities
- `getCountries()` - Get countries

## Error Handling

```typescript
try {
  const results = await integrationManager.flights.searchFlights({
    origin: 'JFK',
    destination: 'LHR',
    departureDate: '2024-03-15',
    adults: 1,
  })
} catch (error) {
  if (error.message.includes('API error')) {
    // Handle API-specific errors
    console.error('Provider API error:', error)
  } else if (error.message.includes('authentication')) {
    // Handle authentication errors
    console.error('Invalid API credentials')
  } else {
    // Handle other errors
    console.error('Search failed:', error)
  }
}
```

## Best Practices

### 1. Provider Fallback

Implement fallback logic for when a provider fails:

```typescript
async function searchWithFallback(params: SearchParams) {
  const providers = ['duffel', 'amadeus', 'kiwi']
  
  for (const provider of providers) {
    try {
      const results = await integrationManager.flights.searchFlights({
        ...params,
        provider,
      })
      if (results.length > 0) return results
    } catch (error) {
      console.warn(`${provider} failed, trying next provider`)
    }
  }
  
  throw new Error('All providers failed')
}
```

### 2. Caching

Cache frequently requested data:

```typescript
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getCachedSearch(key: string, searchFn: () => Promise<any>) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await searchFn()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

### 3. Rate Limiting

Implement rate limiting to avoid API throttling:

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  async throttle(provider: string, fn: () => Promise<any>) {
    const now = Date.now()
    const providerRequests = this.requests.get(provider) || []
    
    // Remove requests older than 1 second
    const recentRequests = providerRequests.filter(t => now - t < 1000)
    
    if (recentRequests.length >= 10) { // 10 requests per second
      await new Promise(resolve => setTimeout(resolve, 1000))
      return this.throttle(provider, fn)
    }
    
    recentRequests.push(now)
    this.requests.set(provider, recentRequests)
    
    return await fn()
  }
}
```

### 4. Price Comparison

Compare prices across providers:

```typescript
function comparePrices(results: Array<{ provider: string; hotels: any[] }>) {
  const allHotels = results.flatMap(({ provider, hotels }) =>
    hotels.map(hotel => ({ ...hotel, provider }))
  )
  
  // Group by hotel name/location
  const grouped = new Map<string, any[]>()
  allHotels.forEach(hotel => {
    const key = `${hotel.name}-${hotel.location.city}`
    const existing = grouped.get(key) || []
    existing.push(hotel)
    grouped.set(key, existing)
  })
  
  // Find best price for each hotel
  const bestPrices = Array.from(grouped.values()).map(hotels => {
    const sorted = hotels.sort((a, b) => a.price.total - b.price.total)
    return {
      hotel: sorted[0],
      alternatives: sorted.slice(1),
    }
  })
  
  return bestPrices
}
```

## Testing

Use test/sandbox environments during development:

```typescript
const config: IntegrationConfig = {
  duffel: {
    enabled: true,
    apiKey: process.env.DUFFEL_TEST_API_KEY!,
    environment: 'test', // Use test environment
    priority: 1,
  },
  // ... other providers
}
```

## Production Checklist

Before going live:

- [ ] Switch all providers to 'live' environment
- [ ] Update API keys to production keys
- [ ] Test booking flow end-to-end
- [ ] Verify webhook endpoints
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Test cancellation flows
- [ ] Verify refund processing
- [ ] Review provider terms and conditions
- [ ] Set up logging for debugging

## Support Contacts

- **Duffel:** support@duffel.com
- **HotelsTON:** support@hotels-ton.com
- **Agoda:** partner.support@agoda.com
- **Hotelbeds:** support@hotelbeds.com
- **Ratehawk:** support@ratehawk.com
- **Rezlive:** support@rezlive.com
- **Kiwi:** support@kiwi.com
- **Viator:** partner.support@viator.com
- **Tiqets:** support@tiqets.com

## Related Documentation

- [Payments Documentation](./PAYMENTS.md)
- [Booking Flows Documentation](./BOOKING_FLOWS.md)
- [API Documentation](./API.md)

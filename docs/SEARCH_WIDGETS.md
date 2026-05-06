# 🔍 VerTravels Search Widgets

**Status:** ✅ Complete  
**Components:** 4 Search Widgets (Flights, Hotels, Tours, Cars)  
**Stack:** Next.js 14 + React + TypeScript + Tailwind CSS

---

## 📋 Overview

VerTravels search widgets provide a comprehensive booking interface for all travel modules with real-time search, filtering, and results display.

---

## 🎯 Features

### **Unified Search Widget**
- ✅ Tab-based interface for all modules
- ✅ Consistent design across modules
- ✅ Module-specific colors and icons
- ✅ Responsive layout
- ✅ Form validation
- ✅ Loading states

### **Flights Search**
- ✅ Trip type selection (Round/One-way/Multi-city)
- ✅ Origin & destination with swap
- ✅ Departure & return dates
- ✅ Passenger counter (Adults, Children, Infants)
- ✅ Cabin class selection
- ✅ Advanced filters (price, stops, airlines, times)
- ✅ Flight cards with details
- ✅ Sort options

### **Hotels Search**
- ✅ Destination input
- ✅ Check-in & check-out dates
- ✅ Guest counter (Adults, Children, Rooms)
- ✅ Star rating filter
- ✅ Advanced filters (price, rating, amenities)
- ✅ Hotel cards with images
- ✅ Amenities display

### **Tours Search**
- ✅ Destination input
- ✅ Date selection
- ✅ Duration filter
- ✅ Guest counter
- ✅ Category selection
- ✅ Popular categories

### **Cars Search**
- ✅ Pick-up & drop-off locations
- ✅ Same location toggle
- ✅ Pick-up & drop-off dates/times
- ✅ Car type selection
- ✅ Transmission preference
- ✅ Additional options

---

## 📁 File Structure

```
apps/web/
├── components/
│   ├── search/
│   │   ├── search-widget.tsx          # Main tabbed widget
│   │   ├── flights-search.tsx         # Flights search form
│   │   ├── hotels-search.tsx          # Hotels search form
│   │   ├── tours-search.tsx           # Tours search form
│   │   └── cars-search.tsx            # Cars search form
│   ├── flights/
│   │   ├── search-results.tsx         # Flight results
│   │   ├── search-filters.tsx         # Flight filters
│   │   └── flight-card.tsx            # Flight result card
│   ├── hotels/
│   │   ├── search-results.tsx         # Hotel results
│   │   └── search-filters.tsx         # Hotel filters
│   └── [tours, cars]/
│       └── ... (similar structure)
└── app/
    ├── flights/
    │   └── search/
    │       └── page.tsx               # Flights search results page
    ├── hotels/
    │   └── search/
    │       └── page.tsx               # Hotels search results page
    ├── tours/
    │   └── search/
    │       └── page.tsx               # Tours search results page
    └── cars/
        └── search/
            └── page.tsx               # Cars search results page
```

---

## 🚀 Usage

### **Homepage Integration**

```tsx
import { SearchWidget } from '@/components/search/search-widget';

export default function HomePage() {
  return (
    <main>
      <HeroSection>
        <SearchWidget />
      </HeroSection>
      {/* rest of homepage */}
    </main>
  );
}
```

### **Individual Module Search**

Each module has its own search page:

- `/flights/search?origin=JFK&destination=LHR&departure=2024-02-15`
- `/hotels/search?destination=Paris&checkIn=2024-02-15&checkOut=2024-02-18`
- `/tours/search?destination=Rome&date=2024-02-20`
- `/cars/search?pickup=JFK&pickupDate=2024-02-15&dropoff=2024-02-20`

---

## 🎨 Component API

### **SearchWidget**

```tsx
interface SearchWidgetProps {
  className?: string;
}
```

**Usage:**
```tsx
<SearchWidget className="max-w-4xl" />
```

### **FlightsSearch**

```tsx
interface FlightsSearchProps {
  // No props - manages internal state
}
```

**Features:**
- Trip type: Round, One-way, Multi-city
- Origin/Destination with swap button
- Date pickers with min/max validation
- Passenger counter with increment/decrement
- Cabin class dropdown
- Form validation
- Redirects to `/flights/search` with query params

### **HotelsSearch**

```tsx
interface HotelsSearchProps {
  // No props - manages internal state
}
```

**Features:**
- Destination autocomplete ready
- Check-in/Check-out date range
- Guest and room counters
- Star rating filter buttons
- Form validation
- Redirects to `/hotels/search`

### **ToursSearch**

```tsx
interface ToursSearchProps {
  // No props - manages internal state
}
```

**Features:**
- Destination input
- Date picker
- Duration dropdown
- Guest counter
- Category selection
- Popular category tags

### **CarsSearch**

```tsx
interface CarsSearchProps {
  // No props - manages internal state
}
```

**Features:**
- Pick-up/Drop-off locations
- Same location toggle
- Date and time selection
- Car type dropdown
- Transmission preference
- Additional options checkboxes

---

## 🔍 Search Results Pages

### **Flight Results**

**Filters:**
- Price range slider
- Stops (Non-stop, 1 Stop, 2+ Stops)
- Airlines (multi-select)
- Departure time
- Arrival time
- Cabin class

**Flight Card Displays:**
- Airline info with logo
- Flight route with times
- Duration and stops
- Cabin class badge
- Price with booking button
- Free cancellation indicator

**Sorting:**
- Recommended
- Price (Low to High)
- Duration (Shortest)
- Departure Time

### **Hotel Results**

**Filters:**
- Price range slider
- Star rating (2-5 stars)
- Guest rating (3.0+ to 4.5+)
- Amenities (WiFi, Breakfast, Parking, Gym, Pool, Spa, Pet Friendly)
- Property type

**Hotel Card Displays:**
- Hotel image
- Name and star rating
- Guest rating and reviews
- Location and distance
- Amenities icons
- Price per night
- Availability badge

---

## 📊 State Management

### **Search Form State**

Each search component manages its own state:

```tsx
const [formData, setFormData] = useState({
  origin: '',
  destination: '',
  departureDate: undefined,
  returnDate: undefined,
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: 'economy',
});
```

### **Filter State**

Filter components manage filter state:

```tsx
const [filters, setFilters] = useState({
  priceRange: [0, 2000],
  stops: [],
  airlines: [],
  departureTime: '',
  arrivalTime: '',
});
```

---

## 🔄 Data Flow

### **Search Flow**

```
1. User fills search form
2. Validates inputs
3. Constructs query params
4. Redirects to search results page
5. Results page reads query params
6. Calls API with search criteria
7. Displays results
8. User applies filters
9. Results update
10. User selects option
11. Redirects to booking page
```

### **Query Parameters**

**Flights:**
```
?origin=JFK&destination=LHR&departure=2024-02-15&return=2024-02-22&adults=2&children=0&infants=0&cabin=economy&trip=round
```

**Hotels:**
```
?destination=Paris&checkIn=2024-02-15&checkOut=2024-02-18&adults=2&children=0&rooms=1&stars=4
```

**Tours:**
```
?destination=Rome&date=2024-02-20&duration=full&guests=2&category=historical
```

**Cars:**
```
?pickup=JFK&dropoff=JFK&pickupDate=2024-02-15&dropoffDate=2024-02-20&pickupTime=10:00&dropoffTime=10:00&type=suv&transmission=automatic
```

---

## 🎨 Design System

### **Module Colors**

| Module | Color | Hex Code |
|--------|-------|----------|
| Flights | Blue | `#3B82F6` |
| Hotels | Green | `#10B981` |
| Tours | Yellow | `#F59E0B` |
| Cars | Purple | `#8B5CF6` |

### **Responsive Breakpoints**

```tsx
// Mobile First
grid-cols-1          // Mobile
md:grid-cols-2       // Tablet (768px+)
lg:grid-cols-4       // Desktop (1024px+)
```

### **Form Layout**

- **Desktop:** Multi-column grid
- **Mobile:** Single column stack
- **Labels:** Above inputs
- **Buttons:** Full width on mobile

---

## ✅ Validation

### **Required Fields**

**Flights:**
- ✅ Origin
- ✅ Destination
- ✅ Departure date
- Return date (for round trip)

**Hotels:**
- ✅ Destination
- ✅ Check-in date
- ✅ Check-out date

**Tours:**
- ✅ Destination

**Cars:**
- ✅ Pick-up location
- ✅ Pick-up date
- ✅ Drop-off date

### **Validation Rules**

- Dates cannot be in the past
- Return date must be after departure date
- Check-out must be after check-in
- Drop-off must be after pick-up
- At least 1 adult passenger
- At least 1 room for hotels

---

## 🔌 API Integration

### **Search API Endpoints**

```typescript
// Flights Search
GET /api/v1/flights/search?origin=JFK&destination=LHR&departure=2024-02-15

// Hotels Search
GET /api/v1/hotels/search?destination=Paris&checkIn=2024-02-15&checkOut=2024-02-18

// Tours Search
GET /api/v1/tours/search?destination=Rome&date=2024-02-20

// Cars Search
GET /api/v1/cars/search?pickup=JFK&pickupDate=2024-02-15&dropoffDate=2024-02-20
```

### **Mock Data**

Currently using mock data for demonstration:

```typescript
const mockFlights = [ /* ... */ ];
const mockHotels = [ /* ... */ ];
```

**To integrate real API:**

1. Replace mock data with API calls
2. Use SWR or React Query for data fetching
3. Add loading states
4. Handle errors gracefully
5. Implement infinite scroll or pagination

---

## 🧪 Testing

### **Manual Testing Checklist**

- [ ] Fill all required fields
- [ ] Submit with missing fields (should show error)
- [ ] Select past dates (should be disabled)
- [ ] Change trip type (One-way/Round)
- [ ] Adjust passenger counters
- [ ] Apply filters on results page
- [ ] Clear filters
- [ ] Sort results
- [ ] Click on flight/hotel card
- [ ] Responsive design on mobile

### **Test Scenarios**

**Scenario 1: Flight Search**
```
1. Go to homepage
2. Click Flights tab
3. Enter: JFK → LHR
4. Select: Feb 15 - Feb 22, 2024
5. Passengers: 2 Adults
6. Click Search
7. Verify redirect to /flights/search
8. Verify results display
9. Apply price filter
10. Select flight
```

**Scenario 2: Hotel Search**
```
1. Go to homepage
2. Click Hotels tab
3. Enter: Paris
4. Select: Feb 15 - Feb 18, 2024
5. Guests: 2 Adults, 1 Room
6. Click Search
7. Verify results display
8. Filter by 4+ stars
9. View hotel details
```

---

## 📱 Mobile Optimization

### **Touch-Friendly Features**

- ✅ Large tap targets (44px minimum)
- ✅ Swipeable tabs
- ✅ Pull-to-refresh ready
- ✅ Bottom sheet for filters (mobile)
- ✅ Sticky search bar
- ✅ Mobile-optimized date pickers

### **Performance**

- ✅ Lazy load results
- ✅ Infinite scroll ready
- ✅ Image optimization
- ✅ Debounced search
- ✅ Skeleton loaders

---

## 🎯 Best Practices

### **Form Design**

1. **Clear Labels:** Always visible labels
2. **Inline Validation:** Show errors immediately
3. **Help Text:** Provide examples
4. **Autocomplete:** Enable where possible
5. **Default Values:** Pre-fill common options

### **Search Results**

1. **Show Count:** Display number of results
2. **Active Filters:** Show applied filters
3. **Clear All:** Easy filter reset
4. **Sort Options:** Multiple sort criteria
5. **Load More:** Pagination or infinite scroll

### **Performance**

1. **Debounce:** Delay search by 300ms
2. **Cache:** Store recent searches
3. **Prefetch:** Prefetch popular routes
4. **Optimize:** Lazy load images
5. **Skeleton:** Show loading skeletons

---

## 📊 Analytics

### **Track Events**

```typescript
// Search initiated
analytics.track('Search Initiated', {
  module: 'flights',
  origin: 'JFK',
  destination: 'LHR',
  departure: '2024-02-15',
  passengers: 2,
});

// Search results viewed
analytics.track('Search Results Viewed', {
  module: 'flights',
  resultsCount: 45,
  filters: ['non-stop', 'price'],
});

// Flight selected
analytics.track('Flight Selected', {
  flightId: 'FL001',
  price: 650,
  airline: 'American Airlines',
});
```

---

## 🔮 Future Enhancements

### **Planned Features**

- [ ] Autocomplete for destinations
- [ ] Recent searches
- [ ] Popular destinations
- [ ] Price alerts
- [ ] Multi-city flight planner
- [ ] Map view for hotels
- [ ] Compare flights/hotels
- [ ] Save searches
- [ ] Email notifications
- [ ] Social sharing

### **Advanced Filters**

- [ ] Flight: Airline alliance, Aircraft type
- [ ] Hotels: Neighborhood, Landmark proximity
- [ ] Tours: Language, Physical level
- [ ] Cars: Fuel policy, Mileage limit

---

## ✅ Summary

**4 Search Widgets** | **Complete Filtering** | **Responsive Design** | **Ready for API Integration**

The VerTravels search widgets provide a professional, user-friendly booking interface ready for production use with real API integration.

---

*Built with Next.js 14, React, TypeScript, and Tailwind CSS*

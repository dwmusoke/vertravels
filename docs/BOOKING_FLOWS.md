# Booking Flows Documentation

## Overview

VerTravels implements complete booking flows for all travel modules: Flights, Hotels, Tours, Cars, and Visa. Each module follows a consistent booking pattern while accommodating module-specific requirements.

## Booking Flow Architecture

### 1. Search → Results → Details → Booking → Payment → Confirmation

```
User Journey:
1. Search Widget → 2. Search Results → 3. Booking Details Page → 4. Payment → 5. Confirmation
```

## Module Booking Pages

### Flights Booking (`/flights/[id]`)

**File:** `apps/web/app/flights/[id]/page.tsx`

**Features:**
- Flight itinerary display
- Passenger information collection
- Fare breakdown (base fare, taxes, fees)
- Cabin class selection
- Meal preference
- Special assistance requests
- Baggage selection
- Payment integration

**Booking Data:**
```typescript
{
  flight_id: string
  passenger_name: string
  passenger_email: string
  passenger_phone: string
  passenger_type: 'adult' | 'child' | 'infant'
  cabin_class: string
  meal_preference: string
  special_assistance: string
  baggage_allowance: number
  flight_details: object
  itinerary: array
}
```

### Hotels Booking (`/hotels/[id]`)

**File:** `apps/web/app/hotels/[id]/page.tsx`

**Features:**
- Hotel details and amenities
- Room type selection
- Guest count (adults, children)
- Check-in/check-out dates
- Special requests
- Cancellation policy display
- Payment integration

**Booking Data:**
```typescript
{
  hotel_id: string
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  room_type: string
  customer_name: string
  customer_email: string
  special_requests: string
  nights: number
}
```

### Tours Booking (`/tours/[id]`)

**File:** `apps/web/app/tours/[id]/page.tsx`

**Features:**
- Tour highlights and itinerary
- Tour date selection
- Participant count (adults, children, infants)
- Pickup location (if applicable)
- Special requirements
- What's included/excluded
- Payment integration

**Booking Data:**
```typescript
{
  tour_id: string
  tour_date: string
  adults: number
  children: number
  infants: number
  customer_name: string
  customer_email: string
  special_requests: string
  itinerary: object
}
```

### Cars Booking (`/cars/[id]`)

**File:** `apps/web/app/cars/[id]/page.tsx`

**Features:**
- Car specifications and features
- Pickup/drop-off location
- Pickup/drop-off dates and times
- Driver age and license information
- Additional driver option
- GPS/child seat requests
- Fuel policy display
- Payment integration

**Booking Data:**
```typescript
{
  car_id: string
  pickup_date: string
  dropoff_date: string
  pickup_location: string
  dropoff_location: string
  driver_age: number
  driver_license: string
  customer_name: string
  customer_email: string
  special_requests: string
  duration: number (days)
}
```

### Visa Booking (`/visa/[id]`)

**File:** `apps/web/app/visa/[id]/page.tsx`

**Features:**
- Visa requirements display
- Passport information collection
- Travel date
- Applicant details (name, DOB, nationality, occupation)
- Document upload capability
- Processing time display
- Embassy information
- Payment integration

**Booking Data:**
```typescript
{
  visa_id: string
  visa_type: string
  destination: string
  travel_date: string
  applicant_name: string
  applicant_email: string
  passport_number: string
  passport_expiry: string
  nationality: string
  date_of_birth: string
  occupation: string
  processing_time: string
}
```

## Account Bookings Management

**File:** `apps/web/app/account/bookings/page.tsx`

### Features

1. **Booking List View**
   - All bookings across modules
   - Module-specific icons and colors
   - Status badges (Confirmed, Pending, Cancelled, Completed, Refunded)
   - Booking reference numbers
   - Total amount display

2. **Filtering**
   - By module (Flights, Hotels, Tours, Cars, Visa)
   - By status (Confirmed, Pending, Cancelled, Completed, Refunded)
   - By date range
   - Search by booking ref, name, destination

3. **Actions**
   - View booking details
   - Download invoice (PDF)
   - Cancel booking (with confirmation)
   - Email invoice

4. **Summary Stats**
   - Total bookings count
   - Confirmed bookings count
   - Pending bookings count
   - Total amount spent

## Invoice Generation

**File:** `apps/web/app/invoice/[id]/page.tsx`

### Features

1. **Invoice Header**
   - VerTravels branding
   - Invoice number (booking reference)
   - Status badge
   - Company contact information

2. **Customer Information**
   - Customer name
   - Email and phone
   - Booking date
   - Travel date

3. **Module-Specific Details**
   - Flight: Passenger name, itinerary, cabin class
   - Hotel: Hotel name, room type, guests, nights
   - Tour: Tour name, location, participants, duration
   - Car: Car name, pickup/dropoff, driver info
   - Visa: Visa type, destination, applicant details

4. **Payment Information**
   - Payment method
   - Payment status
   - Total amount

5. **Actions**
   - Print invoice
   - Email invoice
   - Download PDF (browser print dialog)

## Admin Booking Management

**File:** `apps/admin/app/bookings/page.tsx`

### Features

1. **Dashboard Stats**
   - Total bookings
   - Confirmed count
   - Pending count
   - Paid count
   - Total revenue

2. **Advanced Filtering**
   - By module
   - By booking status
   - By payment status
   - By date range
   - Search functionality

3. **Management Actions**
   - Update booking status
   - Update payment status
   - Process refunds
   - Send booking confirmation email
   - View booking details
   - Download invoice

4. **Booking Table**
   - Booking reference
   - Module type with icon
   - Customer information
   - Travel date
   - Amount
   - Status badges
   - Payment status
   - Quick actions

## Booking Status Flow

```
Pending → Confirmed → Completed
   ↓
Cancelled

Pending → Confirmed → Refunded
```

### Status Definitions

- **Pending**: Booking created, payment not completed
- **Confirmed**: Payment completed, booking confirmed
- **Completed**: Travel completed successfully
- **Cancelled**: Booking cancelled by user or admin
- **Refunded**: Refund processed

## Payment Integration

All booking flows integrate with the payment system:

1. **Payment Gateway Selection**
   - Flutterwave (Cards, Mobile Money, USSD)
   - Stripe (Credit/Debit Cards)
   - PayPal
   - Bank Transfer
   - Wallet Balance

2. **Payment Flow**
   - Create booking with 'pending' status
   - Redirect to payment page
   - Process payment through selected gateway
   - Update booking status on success
   - Redirect to success/cancel page

3. **Payment Verification**
   - Server-side verification via Edge Functions
   - Webhook support for async payments
   - Automatic status updates

## Database Schema

### Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  module_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Module References
  flight_id UUID REFERENCES flights(id),
  hotel_id UUID REFERENCES hotels(id),
  tour_id UUID REFERENCES tours(id),
  car_id UUID REFERENCES cars(id),
  visa_id UUID REFERENCES visas(id),
  
  -- Customer Information
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  
  -- Module-Specific Data
  passenger_name VARCHAR(255),
  hotel_name VARCHAR(255),
  tour_name VARCHAR(255),
  car_name VARCHAR(255),
  visa_type VARCHAR(100),
  destination VARCHAR(255),
  
  -- Dates
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  travel_date DATE,
  check_in_date DATE,
  check_out_date DATE,
  pickup_date DATE,
  dropoff_date DATE,
  
  -- Counts
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  nights INTEGER,
  duration INTEGER,
  
  -- Payment
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  
  -- Additional Data
  special_requests TEXT,
  cancellation_policy TEXT,
  itinerary JSONB,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Integration

### Third-Party Bookings

For third-party integrations (Amadeus, Travelport, Kiwi, NDC):

1. **Real-time Availability**
   - Search queries to provider APIs
   - Live pricing and availability
   - Instant confirmation

2. **Booking Creation**
   - Create booking in provider system
   - Receive booking confirmation/PNR
   - Store in local database
   - Send confirmation to customer

3. **Webhook Handling**
   - Status updates from providers
   - Schedule changes
   - Cancellations
   - Refunds

## Email Notifications

### Booking Confirmation Email

Sent immediately after successful payment:
- Booking reference
- Module-specific details
- Customer information
- Payment summary
- Important notes/instructions
- Contact information

### Booking Reminder Email

Sent 24-48 hours before travel:
- Booking details
- Check-in information
- Contact numbers
- Important reminders

### Status Update Emails

- Booking confirmed
- Booking cancelled
- Refund processed
- Schedule changes

## Security & Compliance

1. **Data Protection**
   - PCI DSS compliance for payments
   - GDPR compliance for EU customers
   - Secure storage of personal information

2. **Fraud Prevention**
   - Payment verification
   - Address verification (AVS)
   - CVV checks
   - 3D Secure authentication

3. **Audit Trail**
   - All booking changes logged
   - Payment transaction records
   - User action tracking

## Error Handling

### Common Scenarios

1. **Payment Failure**
   - Booking remains 'pending'
   - User can retry payment
   - Automatic cancellation after timeout (24 hours)

2. **Availability Change**
   - Real-time availability check before payment
   - Alternative suggestions if unavailable
   - Full refund if cancelled by provider

3. **Double Booking**
   - Unique booking reference generation
   - Database constraints
   - Transaction locking during booking creation

## Testing

### Test Scenarios

1. **Complete Booking Flow**
   - Search → Select → Book → Pay → Confirm

2. **Payment Scenarios**
   - Successful payment
   - Failed payment
   - Cancelled payment
   - Refund processing

3. **Status Updates**
   - Admin status changes
   - Automatic status transitions
   - Email notifications

4. **Edge Cases**
   - Sold out items
   - Price changes during booking
   - Session timeout
   - Network failures

## Future Enhancements

1. **Multi-city Bookings**
   - Complex flight itineraries
   - Multiple destination tours

2. **Package Deals**
   - Flight + Hotel bundles
   - Tour + Car combinations
   - Dynamic packaging

3. **Loyalty Program**
   - Points earning on bookings
   - Points redemption
   - Tier benefits

4. **Mobile App**
   - Native iOS/Android apps
   - Mobile wallet integration
   - Push notifications

5. **AI Features**
   - Personalized recommendations
   - Price predictions
   - Chatbot assistance

## Related Documentation

- [Payments Documentation](./PAYMENTS.md)
- [Search Widgets Documentation](./SEARCH_WIDGETS.md)
- [Authentication Documentation](./AUTH.md)
- [Database Schema Documentation](../packages/database/README.md)

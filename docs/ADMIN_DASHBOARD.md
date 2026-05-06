# Admin Dashboard Documentation

## Overview

VerTravels Admin Dashboard is a comprehensive management interface for controlling all aspects of the travel booking platform. Built with Next.js 14 and optimized for performance and usability.

## Features

### 📊 Dashboard Analytics

**File:** `apps/admin/app/page.tsx`

**Features:**
- Real-time statistics cards
- Bookings by module breakdown
- Revenue by module breakdown
- Top destinations tracking
- Recent bookings table
- Monthly revenue trends
- Date range filtering (7d, 30d, 90d, 1y)
- Export functionality
- Auto-refresh capability

**Metrics Tracked:**
- Total bookings count
- Total revenue
- Total users
- Active modules
- Bookings per module (Flights, Hotels, Tours, Cars, Visa)
- Revenue per module
- Top 5 destinations
- Recent 10 bookings

### 📅 Booking Management

**File:** `apps/admin/app/bookings/page.tsx`

**Features:**
- Complete booking list with filters
- Search by booking reference, customer, destination
- Filter by module (all 5 modules)
- Filter by booking status
- Filter by payment status
- Date range filtering
- Status update functionality
- Payment status management
- Refund processing
- Email booking confirmation
- Invoice download
- View booking details

**Booking Actions:**
- Update status (Pending → Confirmed → Completed)
- Cancel booking
- Process refund
- Send confirmation email
- Download invoice
- View details

### 👥 User Management

**File:** `apps/admin/app/users/page.tsx`

**Features:**
- User list with search
- Filter by role (user, staff, admin)
- Filter by status (active, suspended, banned)
- User statistics (bookings, total spent)
- Role management
- Status control
- Edit user details
- User profile view

**User Statistics:**
- Total bookings count
- Total amount spent
- Last login date
- Account creation date
- Booking history

**User Actions:**
- Change role (user ↔ staff ↔ admin)
- Change status (active ↔ suspended ↔ banned)
- Edit profile details
- View booking history

### ⚙️ Module Management

**File:** `apps/admin/app/modules/page.tsx`

**Features:**
- Enable/disable travel modules
- Configure third-party API integrations
- Payment gateway management
- API key configuration
- Environment switching (test/live)
- Connection testing

**Configurable Modules:**

**Flights Module:**
- Duffel API configuration
- Environment selection
- Provider toggles (Amadeus, Travelport, Kiwi)

**Hotels Module:**
- HotelsTON API configuration
- Agoda API configuration
- Provider toggles (Hotelbeds, Ratehawk, Rezlive)

**Tours Module:**
- Viator API configuration
- Tiqets API configuration

**Payment Gateways:**
- Stripe (publishable key, secret key, webhook secret)
- Flutterwave (public key, secret key, encryption key)
- PayPal (client ID, client secret, environment)
- Bank Transfer (bank details)

### 🎨 Admin Layout

**File:** `apps/admin/app/layout.tsx`

**Components:**
- Fixed sidebar navigation
- Top header bar
- User profile section
- Notification system
- Responsive design

**Navigation Structure:**
```
Dashboard
Bookings
Users
Modules
  ├─ Flights
  ├─ Hotels
  ├─ Tours
  ├─ Cars
  └─ Visa
Payments
API Keys
Translations
Reviews
Settings
```

## Technical Implementation

### Dashboard Stats Calculation

```typescript
// Fetch bookings with date range
const { data: bookings } = await supabase
  .from('bookings')
  .select(`*, profiles:user_id (full_name, email)`)
  .gte('booking_date', startDate.toISOString())
  .order('booking_date', { ascending: false })

// Calculate revenue
const totalRevenue = bookings
  ?.filter(b => b.payment_status === 'paid')
  .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

// Group by module
const bookingsByModule: Record<string, number> = {}
bookings?.forEach(booking => {
  const module = booking.module_type
  bookingsByModule[module] = (bookingsByModule[module] || 0) + 1
})
```

### User Management

```typescript
// Fetch users with booking stats
const { data: profiles } = await supabase
  .from('profiles')
  .select(`*, auth_users (id, email, role, status)`)

// Calculate user statistics
const { count: bookingCount } = await supabase
  .from('bookings')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', profile.id)

const { data: bookings } = await supabase
  .from('bookings')
  .select('total_amount')
  .eq('user_id', profile.id)
  .eq('payment_status', 'paid')

const totalSpent = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
```

### Module Configuration

```typescript
// Update module configuration
const { error } = await supabase
  .from('modules')
  .update({ 
    enabled: true,
    config: {
      duffel_api_key: 'dk_test_xxx',
      environment: 'test',
      providers: {
        amadeus: true,
        travelport: false,
        kiwi: true
      }
    }
  })
  .eq('id', moduleId)
```

## Security

### Access Control

- Admin role required for all dashboard pages
- Middleware protection on `/admin/*` routes
- Role-based permissions (admin, staff)
- Session validation on every request

### API Key Security

- API keys stored encrypted in database
- Keys masked in UI (password input type)
- Show/hide toggle for key visibility
- Environment separation (test/live)

### Data Protection

- Row Level Security (RLS) policies
- Secure server-side queries
- Input validation
- SQL injection prevention

## Performance

### Optimizations

- Server-side data fetching
- Pagination for large lists (100 items per page)
- Debounced search
- Lazy loading for charts
- Cached statistics (5-minute TTL)

### Real-time Updates

- Manual refresh button
- Auto-refresh option (configurable)
- WebSocket support for live bookings (future)

## Usage Guide

### Getting Started

1. **Login to Admin Dashboard**
   ```
   Navigate to: /admin/login
   Email: admin@vertravels.com
   Password: [your password]
   ```

2. **View Dashboard**
   - See real-time statistics
   - Filter by date range
   - Export data to CSV

3. **Manage Bookings**
   - Navigate to Bookings page
   - Use filters to find specific bookings
   - Update status or process refunds

4. **Configure Modules**
   - Go to Modules page
   - Enable/disable modules
   - Configure API keys
   - Test connections

5. **Manage Users**
   - Navigate to Users page
   - Search for users
   - Update roles and status
   - View user statistics

### Common Tasks

**Process a Refund:**
1. Go to Bookings page
2. Find the booking
3. Click refund button
4. Confirm refund amount
5. Refund processed through payment gateway

**Add New Admin:**
1. Go to Users page
2. Find the user
3. Change role to "Admin"
4. Save changes

**Configure Stripe:**
1. Go to Modules page
2. Find Payment Gateways section
3. Enter publishable key
4. Enter secret key
5. Enter webhook secret
6. Save configuration
7. Test connection

## API Endpoints

### Dashboard Stats
```
GET /api/admin/stats?range=30d
Response: {
  totalBookings: number,
  totalRevenue: number,
  totalUsers: number,
  bookingsByModule: {},
  revenueByModule: {}
}
```

### Update Booking Status
```
POST /api/admin/bookings/[id]/status
Body: { status: 'confirmed' }
```

### Update User Role
```
POST /api/admin/users/[id]/role
Body: { role: 'admin' }
```

### Update Module Config
```
POST /api/admin/modules/[id]/config
Body: { enabled: true, config: {...} }
```

## Troubleshooting

### Dashboard Not Loading
- Check admin role permissions
- Verify database connection
- Check RLS policies

### Cannot Update Booking
- Verify booking exists
- Check payment gateway status
- Review error logs

### API Keys Not Saving
- Verify encryption is working
- Check database permissions
- Ensure config field is JSON type

## Future Enhancements

1. **Advanced Analytics**
   - Revenue forecasting
   - Customer lifetime value
   - Conversion tracking
   - Funnel analysis

2. **Marketing Tools**
   - Email campaigns
   - Promo code management
   - Affiliate tracking
   - A/B testing

3. **Reporting**
   - Custom report builder
   - Scheduled reports
   - PDF export
   - White-label reports

4. **Multi-language Admin**
   - Translate dashboard
   - Multi-currency reports
   - Regional settings

## Support

For issues or questions:
- Email: support@vertravels.com
- Documentation: /docs/ADMIN.md
- API Docs: /api/docs

## Related Documentation

- [Booking Flows](./BOOKING_FLOWS.md)
- [Third-Party Integrations](./INTEGRATIONS.md)
- [Payments](./PAYMENTS.md)
- [Database Schema](../packages/database/README.md)

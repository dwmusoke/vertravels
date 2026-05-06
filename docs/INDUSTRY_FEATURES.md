# Travel Industry Features Documentation

## Professional Features for Travel Agencies & OTAs

VerTravels includes comprehensive travel industry-specific features that are essential for professional travel operations.

---

## 💰 Upselling & Cross-Selling Engine

**File:** `apps/web/components/upsell/upsell-engine.tsx`

### Overview
Intelligent product recommendations during the booking flow to increase average booking value and revenue per customer.

### Features

#### **Flight Upsells**
1. **Seat Upgrades**
   - Extra legroom seats (+$79)
   - Premium economy (+$199)
   - Business class upgrades

2. **Baggage Add-ons**
   - Extra checked bag 23kg (+$60)
   - Heavy bag 32kg (+$100)
   - Sports equipment

3. **Meal Preferences**
   - Premium meal selection (+$35)
   - Special dietary meals
   - Kids meals

4. **Travel Protection**
   - Comprehensive insurance (8% of base price)
   - Basic coverage (4% of base price)
   - Trip cancellation protection

5. **Airport Services**
   - Lounge access (+$45)
   - Priority boarding (+$25)
   - Fast-track security
   - Meet & greet services

6. **In-Flight Amenities**
   - WiFi access (+$19)
   - Premium entertainment (+$12)
   - Amenity kits

7. **Transfers**
   - Private airport transfer (+$89)
   - Shared shuttle
   - Luxury car service

#### **Hotel Upsells**
1. **Room Upgrades**
   - Deluxe room (+$50/night)
   - Suite upgrade (+$150/night)
   - Ocean view rooms
   - Executive floors

2. **Meal Plans**
   - Daily breakfast (+$25/person/night)
   - Half board
   - Full board
   - All-inclusive upgrades

3. **Hotel Services**
   - Early check-in (+$30)
   - Late check-out (+$30)
   - Airport transfers (+$45)
   - Spa credits (+$100)

4. **Protection**
   - Free cancellation (5% of base price)
   - Price protection
   - Date change flexibility

#### **Car Rental Upsells**
1. **Vehicle Upgrades**
   - Higher car category (+$35/day)
   - Luxury vehicles
   - SUV upgrades

2. **Equipment**
   - GPS navigation (+$12/day)
   - Child seats (+$10/day)
   - Additional driver (+$15/day)

3. **Insurance**
   - Collision damage waiver (+$25/day)
   - Personal accident insurance (+$8/day)
   - Roadside assistance

4. **Convenience**
   - Prepaid fuel (+$45)
   - One-way rental
   - Young driver fee waiver

### Implementation

```typescript
import { UpsellEngine } from '@/components/upsell/upsell-engine'

// In booking flow
<UpsellEngine
  bookingType="flight"
  basePrice={1500}
  currency="USD"
  passengerCount={2}
  onAddonsChange={(addons) => {
    console.log('Selected addons:', addons)
  }}
/>
```

### Revenue Impact
- **Average increase per booking:** 15-25%
- **Attachment rates:**
  - Baggage: 45%
  - Seat selection: 60%
  - Insurance: 30%
  - Lounge access: 15%

---

## ✈️ IATA & Non-IATA Booking Tracking

**File:** `apps/admin/app/iata-tracking/page.tsx`

### Overview
Complete management of airline accreditations, BSP (Bank Settlement Plan) settlements, and commission tracking for both IATA and Non-IATA bookings.

### Key Features

#### **IATA Accreditation Management**
1. **Multiple Accreditation Types**
   - IATA (International Air Transport Association)
   - NON_IATA (Independent agencies)
   - CLIA (Cruise Lines International Association)
   - TRUE (Travel Retail Unified)

2. **Accreditation Tracking**
   - IATA code management
   - IATA number tracking
   - BSP code assignment
   - Pseudo city codes (PCC)
   - Expiry date monitoring
   - Renewal alerts

3. **Commission Configuration**
   - Custom commission rates per accreditation
   - Booking fee settings
   - Allowed airlines configuration
   - Monthly sales targets

#### **Booking Tracking**
1. **PNR Management**
   - Airline PNR storage
   - Ticket number tracking
   - E-ticket integration
   - Booking reference mapping

2. **IATA vs Non-IATA Classification**
   - Automatic classification
   - Commission calculation
   - BSP reporting
   - Settlement tracking

3. **Financial Tracking**
   - Commission amounts per booking
   - Base fare breakdown
   - Tax separation
   - Pending settlements
   - Paid commissions

#### **BSP Reporting**
1. **Monthly Reports**
   - Total sales volume
   - Commission earned
   - Booking count by airline
   - Settlement amounts

2. **Airline Reconciliation**
   - Sync with GDS (Amadeus, Sabre, Travelport)
   - Discrepancy detection
   - Credit memo tracking
   - Debit memo management

3. **Compliance**
   - IATA regulatory compliance
   - Financial guarantees
   - Insurance requirements
   - Audit trail maintenance

### Dashboard Metrics

```
┌─────────────────────────────────────────────────┐
│ IATA Booking Management Dashboard               │
├─────────────────────────────────────────────────┤
│ Total Bookings: 1,247                           │
│ ├─ IATA: 856 (69%)                              │
│ └─ Non-IATA: 391 (31%)                          │
│                                                 │
│ Total Commission: $187,450                      │
│ ├─ Pending: $56,235 (30%)                       │
│ └─ Paid: $131,215 (70%)                         │
│                                                 │
│ Monthly Target: $500k                           │
│ Current: $385k (77%)                            │
│                                                 │
│ Active Accreditations: 5                        │
│ └─ Expiring Soon: 1 (30 days)                   │
└─────────────────────────────────────────────────┘
```

### BSP Report Generation

```typescript
// Generate monthly BSP report
const bspReport = {
  agency_code: '12-3 4567 8',
  period: 'January 2024',
  total_sales: 1250000,
  commission_earned: 187500,
  bookings_count: 1247,
  by_airline: {
    'EK': { sales: 350000, commission: 52500 },
    'QR': { sales: 280000, commission: 42000 },
    'BA': { sales: 220000, commission: 33000 },
    // ...
  },
  generated_at: '2024-01-31T23:59:59Z'
}
```

---

## 🤝 Partnership Management System

**File:** `apps/admin/app/partnerships/page.tsx`

### Overview
Comprehensive B2B partnership platform for managing affiliates, sub-agents, corporate clients, and wholesale partners with tiered commission structures.

### Partner Types

#### **1. Affiliates**
- Website owners who refer customers
- Commission: 5-15% per booking
- Payment: Monthly via PayPal/Bank transfer
- Tracking: Unique referral codes/links

#### **2. Sub-Agents**
- Independent travel agents under your agency
- Commission: 8-20% based on volume
- Access: Full booking system
- Support: Dedicated account manager

#### **3. B2B Partners**
- Other travel agencies
- Corporate travel departments
- Commission: 10-25%
- Features: White-label options, API access

#### **4. Corporate Clients**
- Companies booking for employees
- Pricing: Negotiated rates
- Features: Expense reporting, policy enforcement

#### **5. Wholesalers**
- Bulk booking partners
- Commission: 15-30%
- Minimum: Monthly volume commitments

### Commission Tiers

```
┌──────────────────────────────────────────────────────┐
│ Commission Structure                                 │
├────────────┬─────────────┬──────────┬───────────────┤
│ Tier       │ Revenue     │ Base     │ Bonus         │
│            │ Range       │ Rate     │ Rate          │
├────────────┼─────────────┼──────────┼───────────────┤
│ Bronze     │ $0 - $10k   │ 5%       │ -             │
│ Silver     │ $10k - $50k │ 8%       │ +2% bonus     │
│ Gold       │ $50k - $100k│ 12%      │ +3% bonus     │
│ Platinum   │ $100k+      │ 15%      │ +5% bonus     │
└────────────┴─────────────┴──────────┴───────────────┘
```

### Features

#### **Partner Onboarding**
1. **Application Process**
   - Online application form
   - Document verification
   - Agreement signing
   - Account setup

2. **Training**
   - Platform tutorials
   - Product training
   - Sales materials
   - Marketing support

#### **Tracking & Analytics**
1. **Referral Tracking**
   - Unique referral codes
   - Custom landing pages
   - Cookie-based tracking (30-90 days)
   - Multi-device attribution

2. **Performance Dashboard**
   - Real-time bookings
   - Revenue tracking
   - Commission accrual
   - Conversion rates
   - Top destinations

3. **Marketing Tools**
   - Banners and widgets
   - API integration
   - Deep linking
   - Email templates

#### **Commission Management**
1. **Accrual Tracking**
   - Real-time commission calculation
   - Pending period (30 days)
   - Cancellation adjustments
   - Bonus calculations

2. **Payout Processing**
   - Monthly payout runs
   - Multiple payment methods
   - Minimum payout thresholds
   - Tax documentation (1099, W-8BEN)

3. **Reporting**
   - Commission statements
   - Payment history
   - Tax reports
   - Performance analytics

#### **White-Label Options**
1. **Branded Portal**
   - Custom domain
   - Logo and branding
   - Color scheme
   - Email templates

2. **API Access**
   - Full booking API
   - Search widgets
   - Availability checks
   - Real-time pricing

### Partner Dashboard

Each partner gets access to a dedicated dashboard:

```
┌─────────────────────────────────────────────────┐
│ Partner Dashboard - TravelCo Agency             │
├─────────────────────────────────────────────────┤
│ Tier: Gold ★★★★★                                │
│ Next Tier: $15,000 to Platinum                  │
│                                                 │
│ This Month:                                     │
│ ├─ Bookings: 47                                 │
│ ├─ Revenue: $125,450                            │
│ ├─ Commission: $15,054 (12% + 3% bonus)         │
│ └─ Pending Payout: $8,230                       │
│                                                 │
│ Lifetime:                                       │
│ ├─ Total Bookings: 523                          │
│ ├─ Total Revenue: $1,245,000                    │
│ └─ Total Earned: $149,400                       │
│                                                 │
│ Quick Links:                                    │
│ ├─ Generate Referral Link                       │
│ ├─ Download Marketing Materials                 │
│ ├─ Request Payout                               │
│ └─ View Payment History                         │
└─────────────────────────────────────────────────┘
```

### Implementation

```typescript
import { PartnershipManager } from '@/components/partnerships/partnership-manager'

// In admin dashboard
<PartnershipManager />

// Access partner data
const partners = await supabase
  .from('partners')
  .select('*')
  .eq('type', 'affiliate')
  .eq('status', 'active')
```

### Revenue Impact
- **Affiliate channel:** 15-25% of total bookings
- **Sub-agent channel:** 20-30% of total bookings
- **B2B partnerships:** 10-20% of total bookings
- **Average partner ROI:** 400-600%

---

## 📊 Integration with Other Systems

### Booking Flow Integration
```
Search → Select → Booking Details → Upsell Engine → Payment → Confirmation
                                    ↓
                            IATA Tracking
                                    ↓
                            Partner Commission
```

### Admin Dashboard Integration
```
Dashboard
├─ Bookings (with IATA tracking)
├─ Users
├─ Modules
├─ IATA Tracking ← NEW
├─ Partnerships ← NEW
├─ Payments
└─ Settings
```

### Database Schema

```sql
-- IATA Profiles Table
CREATE TABLE iata_profiles (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  iata_code VARCHAR(10) NOT NULL,
  iata_number VARCHAR(20) NOT NULL,
  accreditation_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  issue_date DATE,
  expiry_date DATE,
  bsp_code VARCHAR(20),
  pseudo_city_code VARCHAR(10),
  commission_rate DECIMAL(5,2),
  booking_fee DECIMAL(10,2),
  allowed_airlines TEXT[],
  monthly_target DECIMAL(15,2),
  current_month_sales DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- IATA Tracking Table (for bookings)
CREATE TABLE iata_tracking (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  pnr VARCHAR(10),
  ticket_number VARCHAR(20),
  iata_booking BOOLEAN DEFAULT false,
  iata_profile_id UUID REFERENCES iata_profiles(id),
  airline_code VARCHAR(5),
  commission_amount DECIMAL(10,2),
  base_fare DECIMAL(10,2),
  taxes DECIMAL(10,2),
  issued_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partners Table
CREATE TABLE partners (
  id UUID PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  commission_rate DECIMAL(5,2) DEFAULT 5,
  commission_type VARCHAR(20) DEFAULT 'percentage',
  tier VARCHAR(20) DEFAULT 'bronze',
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  api_key VARCHAR(255) UNIQUE,
  white_label_enabled BOOLEAN DEFAULT false,
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_commission DECIMAL(15,2) DEFAULT 0,
  pending_commission DECIMAL(15,2) DEFAULT 0,
  paid_commission DECIMAL(15,2) DEFAULT 0,
  joined_date DATE DEFAULT NOW(),
  last_booking_date DATE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Partner Payouts Table
CREATE TABLE partner_payouts (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  amount DECIMAL(15,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  processed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Business Benefits

### Upselling Engine
- **Revenue Increase:** +15-25% per booking
- **Customer Satisfaction:** Enhanced travel experience
- **Competitive Advantage:** One-stop shop for all travel needs

### IATA Tracking
- **Compliance:** Meet IATA regulatory requirements
- **Financial Control:** Accurate commission tracking
- **Efficiency:** Automated BSP reporting
- **Cash Flow:** Better settlement management

### Partnership Program
- **Distribution:** Expand reach through partners
- **Revenue:** Low-cost customer acquisition
- **Scale:** Grow without proportional cost increase
- **Network Effect:** Partners bring their own customers

---

## 📞 Support & Training

- **Documentation:** `/docs/INDUSTRY_FEATURES.md`
- **API Reference:** `/api/docs`
- **Training:** Available for enterprise clients
- **Support:** support@vertravels.com

---

*VerTravels - Built by Travel Industry Experts*

# 🌍 VerTravels - Modern Travel Booking Platform

**VerTravels** is a next-generation travel booking platform built with modern technologies, designed to replace and enhance PHPTRAVELS with better performance, security, and developer experience.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl (12 languages)

### Backend
- **Database:** PostgreSQL (Supabase)
- **API:** Supabase Edge Functions (Deno)
- **Auth:** Supabase Auth + Custom tables
- **Real-time:** Supabase Realtime
- **RLS:** Row Level Security

### Infrastructure
- **Hosting:** Vercel (Global CDN)
- **Email:** SendGrid
- **Payments:** Stripe, Flutterwave, PayPal
- **Analytics:** Google Analytics 4 + Custom
- **Monitoring:** Sentry

---

## 📦 Monorepo Structure

```
VerTravels/
├── apps/
│   ├── web/              # Customer-facing storefront
│   ├── admin/            # Admin dashboard
│   └── api/              # Supabase Edge Functions
├── packages/
│   ├── database/         # Migrations, seeds, types
│   ├── ui/               # Shared UI components
│   └── integrations/     # Third-party APIs
└── docs/                 # Documentation
```

---

## 🎯 Features

### Travel Modules
- ✈️ **Flights** - NDC, Amadeus, Travelport, Kiwi integration
- 🏨 **Hotels** - Hotelbeds, direct booking
- 🎯 **Tours** - Tour packages and activities
- 🚗 **Cars** - Car rentals worldwide
- 🛂 **Visa** - Visa application processing
- 📝 **Blogs** - Travel content management

### Payment Gateways
- 💳 **Stripe** - Credit/debit cards
- 🌍 **Flutterwave** - Global + African markets
- 🅿️ **PayPal** - International payments
- 🏦 **Bank Transfer** - Direct bank payments
- 💰 **Wallet** - Internal wallet system

### Admin Dashboard
- 📊 Real-time analytics
- 👥 User management
- 📅 Booking management
- 💰 Payment gateway configuration
- 🔑 API key management
- 📝 Content management
- 🌐 Multi-language support
- 💱 Currency management

### Developer Features
- 🔐 Row Level Security (RLS)
- 📚 Auto-generated API docs (OpenAPI)
- 🧪 Comprehensive test suite
- 📖 TypeScript types
- 🔄 Real-time updates
- ⚡ Edge caching

---

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- Supabase account
- Vercel account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vertravels.git
cd vertravels

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# - Supabase URL and keys
# - Payment gateway credentials
# - Third-party API keys

# Setup database
pnpm db:migrate
pnpm db:seed
pnpm db:generate-types

# Start development servers
pnpm dev
```

### Access Applications

- **Web App:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **API Docs:** http://localhost:3000/api/docs

---

## 🗄️ Database Setup

### Supabase Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings → API
3. Add them to `.env.local`
4. Run migrations:

```bash
pnpm db:migrate
```

### Available Migrations

```
0001_initial-schema.sql      - Core tables
0002_auth-tables.sql         - Authentication
0003_modules-flights.sql     - Flights module
0004_modules-hotels.sql      - Hotels module
0005_modules-tours.sql       - Tours module
0006_modules-cars.sql        - Cars module
0007_modules-visa.sql        - Visa module
0008_payment-gateways.sql    - Payment setup
0009_blog-content.sql        - Blog system
0010_seed-data.sql           - Initial data
```

---

## 💳 Payment Gateway Setup

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Add to `.env.local`
4. Setup webhook endpoint

### Flutterwave
1. Create account at [flutterwave.com](https://flutterwave.com)
2. Get API keys from Dashboard → API Keys & Encryption
3. Add to `.env.local`
4. Setup webhook for payment notifications

### PayPal
1. Create account at [developer.paypal.com](https://developer.paypal.com)
2. Create app to get Client ID and Secret
3. Add to `.env.local`
4. Configure webhook

---

## 🔌 Third-Party Integrations

### NDC (New Distribution Capability)
- Airline distribution standard
- Real-time flight inventory
- Direct airline connectivity

### Amadeus
- Flight search and booking
- Hotel search
- Point of interest data

### Travelport
- Universal API access
- Multi-GDS content
- Hotel and car content

### Kiwi
- Flight search
- Virtual interlining
- Booking.com integration

---

## 🌐 Multi-Language Support

VerTravels supports 12 languages out of the box:

- 🇺🇸 English (Default)
- 🇸🇦 Arabic (RTL)
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇨🇳 Chinese
- 🇯🇵 Japanese
- 🇷🇺 Russian
- 🇹🇷 Turkish
- 🇳🇱 Dutch

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Unit tests only
pnpm test:unit

# E2E tests only
pnpm test:e2e

# Test with coverage
pnpm test -- --coverage
```

---

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Third-Party Integrations](docs/THIRD-PARTY-INTEGRATIONS.md)

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Make sure all environment variables are set in Vercel:
- Project Settings → Environment Variables
- Add all variables from `.env.example`

---

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ JWT authentication with short expiry
- ✅ Rate limiting on all API endpoints
- ✅ Input validation with Zod schemas
- ✅ HTTPS only
- ✅ CORS configuration
- ✅ CSRF protection
- ✅ XSS prevention

---

## 📊 Monitoring

### Analytics
- Google Analytics 4
- Custom dashboard in admin
- Conversion tracking
- Event tracking

### Error Monitoring
- Sentry integration
- Real-time error alerts
- Performance monitoring
- User context

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer:** VerTravels Team
- **Based on:** PHPTRAVELS architecture
- **Enhanced with:** Modern stack and best practices

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/vertravels/issues)
- **Email:** support@vertravels.com

---

## 🙏 Acknowledgments

- PHPTRAVELS for the original architecture inspiration
- Vercel for the amazing deployment platform
- Supabase for the backend infrastructure
- All open-source contributors

---

**Built with ❤️ for the travel industry**

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  Search,
  Menu,
  X,
  User,
  LogIn,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Phone,
  Mail,
  Calendar,
  Map,
  Compass,
  Palmtree,
  Camera,
  Wallet,
  Percent,
  Badge,
  Building2,
  Gift,
  Zap,
  Heart,
} from "lucide-react";

const featuredFlights = [
  {
    id: 1,
    airline: "Emirates",
    logo: "✈️",
    from: "EBB",
    to: "DXB",
    route: "Entebbe → Dubai",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    price: 450,
    originalPrice: 650,
    stops: "Non-stop",
    duration: "5h 30m",
    tag: "Best Seller",
  },
  {
    id: 2,
    airline: "Kenya Airways",
    logo: "🇰🇪",
    from: "EBB",
    to: "NBO",
    route: "Entebbe → Nairobi",
    image:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab45?w=800&q=80",
    price: 180,
    originalPrice: 250,
    stops: "Non-stop",
    duration: "1h 15m",
    tag: "Popular",
  },
  {
    id: 3,
    airline: "British Airways",
    logo: "🇬🇧",
    from: "EBB",
    to: "LHR",
    route: "Entebbe → London",
    image:
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80",
    price: 680,
    originalPrice: 890,
    stops: "1 stop",
    duration: "11h 20m",
    tag: "Top Rated",
  },
  {
    id: 4,
    airline: "Ethiopian",
    logo: "🇪🇹",
    from: "EBB",
    to: "ADD",
    route: "Entebbe → Addis Ababa",
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
    price: 220,
    originalPrice: 320,
    stops: "Non-stop",
    duration: "2h 45m",
    tag: null,
  },
];

const featuredHotels = [
  {
    id: 1,
    name: "Serena Hotel Kampala",
    location: "Kampala",
    image:
      "https://images.unsplash.com/photo-1562983078-daa1dac6dc90?w=800&q=80",
    rating: 4.8,
    reviews: 1250,
    price: 180,
    originalPrice: 220,
    amenities: ["Wifi", "Pool", "Spa"],
    tag: "Top Pick",
  },
  {
    id: 2,
    name: "Lake Victoria Resort",
    location: "Entebbe",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    rating: 4.6,
    reviews: 890,
    price: 150,
    originalPrice: 200,
    amenities: ["Wifi", "Beach", "Restaurant"],
    tag: "Beach",
  },
  {
    id: 3,
    name: "Wild Rift Lodge",
    location: "Murchison Falls",
    image:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?w=800&q=80",
    rating: 4.9,
    reviews: 560,
    price: 250,
    originalPrice: 320,
    amenities: ["Wifi", "Safari", "Pool"],
    tag: "Safari",
  },
  {
    id: 4,
    name: "Jinja Nile Resort",
    location: "Jinja",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f6678cb2cc0?w=800&q=80",
    rating: 4.7,
    reviews: 720,
    price: 120,
    originalPrice: 160,
    amenities: ["Wifi", "Pool", "Adventure"],
    tag: "Adventure",
  },
];

const featuredTours = [
  {
    id: 1,
    name: "Gorilla Trekking Adventure",
    location: "Bwindi Forest",
    image:
      "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
    duration: "2 Days",
    price: 890,
    rating: 4.9,
    reviews: 328,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Murchison Falls Safari",
    location: "Murchison Falls",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    duration: "3 Days",
    price: 1250,
    rating: 4.8,
    reviews: 256,
    tag: "Popular",
  },
  {
    id: 3,
    name: "Source of Nile Tour",
    location: "Jinja",
    image:
      "https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=800&q=80",
    duration: "1 Day",
    price: 150,
    rating: 4.7,
    reviews: 189,
    tag: "Top Rated",
  },
  {
    id: 4,
    name: "Kampala City Tour",
    location: "Kampala",
    image:
      "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=800&q=80",
    duration: "Half Day",
    price: 80,
    rating: 4.5,
    reviews: 145,
    tag: null,
  },
];

const popularDestinations = [
  {
    id: 1,
    name: "Dubai",
    country: "UAE",
    emoji: "🏙️",
    flights: 45,
    hotels: 280,
    from: "$450",
  },
  {
    id: 2,
    name: "Nairobi",
    country: "Kenya",
    emoji: "🏙️",
    flights: 38,
    hotels: 156,
    from: "$180",
  },
  {
    id: 3,
    name: "London",
    country: "UK",
    emoji: "🇬🇧",
    flights: 25,
    hotels: 450,
    from: "$680",
  },
  {
    id: 4,
    name: "Kampala",
    country: "Uganda",
    emoji: "🏙️",
    flights: 15,
    hotels: 85,
    from: "$50",
  },
  {
    id: 5,
    name: "Zanzibar",
    country: "Tanzania",
    emoji: "🏖️",
    flights: 22,
    hotels: 120,
    from: "$350",
  },
  {
    id: 6,
    name: "Kigali",
    country: "Rwanda",
    emoji: "🏙️",
    flights: 18,
    hotels: 65,
    from: "$200",
  },
];

const whyChooseUs = [
  { icon: Shield, title: "Secure Booking", desc: "100% secure payments" },
  { icon: Wallet, title: "Best Prices", desc: "Price match guarantee" },
  { icon: Phone, title: "24/7 Support", desc: "We're here to help" },
  { icon: Star, title: "Trusted Reviews", desc: "Real customer reviews" },
];

const airlines = [
  "Emirates",
  "Kenya Airways",
  "British Airways",
  "Ethiopian",
  "South African",
  "RwandAir",
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-sky-600" />
              <span className="text-xl font-bold text-gray-900">
                VerTravels
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/flights"
                className="text-gray-600 hover:text-sky-600 font-medium transition"
              >
                Flights
              </Link>
              <Link
                href="/hotels"
                className="text-gray-600 hover:text-emerald-600 font-medium transition"
              >
                Hotels
              </Link>
              <Link
                href="/tours"
                className="text-gray-600 hover:text-amber-600 font-medium transition"
              >
                Tours
              </Link>
              <Link
                href="/cars"
                className="text-gray-600 hover:text-purple-600 font-medium transition"
              >
                Cars
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link href="/flights" className="block py-2 text-gray-600">
                Flights
              </Link>
              <Link href="/hotels" className="block py-2 text-gray-600">
                Hotels
              </Link>
              <Link href="/tours" className="block py-2 text-gray-600">
                Tours
              </Link>
              <Link href="/cars" className="block py-2 text-gray-600">
                Cars
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 py-2 text-gray-600"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/register"
                className="block py-2 text-sky-600 font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-9xl">✈️</div>
          <div className="absolute top-20 right-20 text-8xl">🏨</div>
          <div className="absolute bottom-10 left-1/4 text-9xl">🌍</div>
          <div className="absolute bottom-20 right-1/3 text-8xl">🦁</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next
              <br />
              <span className="text-sky-400">Adventure</span>
            </h1>
            <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
              Flights • Hotels • Tours • Car Rentals — All in one place. Best
              prices guaranteed with 24/7 Support!
            </p>
          </div>

          {/* Search Widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-5xl mx-auto">
            {/* Module Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                {
                  name: "Flights",
                  icon: Plane,
                  color: "sky",
                  href: "/flights",
                },
                {
                  name: "Hotels",
                  icon: Hotel,
                  color: "emerald",
                  href: "/hotels",
                },
                { name: "Tours", icon: MapPin, color: "amber", href: "/tours" },
                { name: "Cars", icon: Car, color: "purple", href: "/cars" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-100 hover:bg-${item.color}-100 hover:text-${item.color}-600 transition font-semibold min-w-[120px]`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  From
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or Airport"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Destination"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Travelers
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option>1 Traveler</option>
                    <option>2 Travelers</option>
                    <option>3 Travelers</option>
                    <option>4+ Travelers</option>
                  </select>
                </div>
              </div>
            </div>
            <Link
              href="/flights/search"
              className="mt-4 w-full bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition"
            >
              <Search className="w-5 h-5" />
              Search Now
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm">Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm">4.8/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Strip */}
      <section className="bg-gradient-to-r from-sky-600 to-teal-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-white font-bold mb-4 text-center">
            Popular Destinations
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {popularDestinations.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                href={`/flights/search?from=EBB&to=${dest.name}`}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
              >
                <span>{dest.emoji}</span>
                <span className="font-medium">{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Flight Deals */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Flight Deals
              </h2>
              <p className="text-gray-500">Save big on popular routes</p>
            </div>
            <Link
              href="/flights"
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              View All Flights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredFlights.map((flight) => (
              <Link
                key={flight.id}
                href="/flights/search"
                className="bg-white rounded-xl border hover:border-sky-300 hover:shadow-xl transition overflow-hidden group"
              >
                <div className="bg-sky-50 p-4 flex items-center justify-between">
                  <span className="text-3xl">{flight.logo}</span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{flight.airline}</p>
                    <p className="font-bold">{flight.route}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    {flight.duration} • {flight.stops}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500 line-through">
                        ${flight.originalPrice}
                      </p>
                      <p className="text-2xl font-bold text-sky-600">
                        ${flight.price}
                      </p>
                    </div>
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -
                      {Math.round(
                        (1 - flight.price / flight.originalPrice) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Hotels
              </h2>
              <p className="text-gray-500">Handpicked properties for you</p>
            </div>
            <Link
              href="/hotels"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All Hotels <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredHotels.map((hotel) => (
              <Link
                key={hotel.id}
                href="/hotels/search"
                className="bg-white rounded-xl border hover:border-emerald-300 hover:shadow-xl transition overflow-hidden group"
              >
                <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center relative">
                  <span className="text-6xl">{hotel.image}</span>
                  {hotel.tag && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      {hotel.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(hotel.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500">
                      ({hotel.reviews})
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500 line-through">
                        ${hotel.originalPrice}
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${hotel.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Tours & Safaris
              </h2>
              <p className="text-gray-500">Unforgettable experiences await</p>
            </div>
            <Link
              href="/tours"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              View All Tours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTours.map((tour) => (
              <Link
                key={tour.id}
                href="/tours/search"
                className="bg-white rounded-xl border hover:border-amber-300 hover:shadow-xl transition overflow-hidden group"
              >
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center relative">
                  <span className="text-6xl">{tour.image}</span>
                  {tour.tag && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      {tour.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({tour.reviews} reviews)
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition">
                    {tour.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {tour.duration}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-amber-600">
                        ${tour.price}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose VerTravels
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Most Searched Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/flights/search?from=EBB&to=${dest.name}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-xl transition group"
              >
                <span className="text-4xl block mb-2">{dest.emoji}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-sky-600">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-500">{dest.country}</p>
                <p className="text-sm text-sky-600 font-bold mt-2">
                  From {dest.from}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Airlines */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-4">
            We partner with 50+ airlines worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {airlines.map((airline) => (
              <div key={airline} className="text-xl font-bold text-gray-400">
                {airline}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-sky-600 to-teal-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get 10% Off Your First Booking!
          </h2>
          <p className="text-white/90 text-lg mb-6">
            Sign up today and receive an exclusive discount on your first
            booking.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-sky-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
            <Link
              href="/flights"
              className="bg-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/30 transition"
            >
              Browse Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <p>About Us</p>
                <p>Careers</p>
                <p>Blog</p>
                <p>Press</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <div className="space-y-2 text-sm">
                <p>Help Center</p>
                <p>Contact Us</p>
                <p>Cancellation Policy</p>
                <p>Safety</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Services</h3>
              <div className="space-y-2 text-sm">
                <Link href="/flights">Flights</Link>
                <Link href="/hotels">Hotels</Link>
                <Link href="/tours">Tours</Link>
                <Link href="/cars">Cars</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +256 123 456789
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@vertravels.com
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Kampala, Uganda
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 VerTravels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

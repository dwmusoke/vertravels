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
  CheckCircle,
  TrendingUp,
  Users,
  Globe,
  ChevronRight,
} from "lucide-react";
import { HotelCarousel } from "@/components/hotels/hotel-carousel";

const featuredFlights = [
  {
    id: 1,
    airline: "Emirates",
    code: "EK",
    from: "EBB",
    to: "DXB",
    route: "Entebbe \u2192 Dubai",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    price: 450,
    originalPrice: 650,
    stops: "Non-stop",
    duration: "5h 30m",
    tag: "Best Seller",
  },
  {
    id: 2,
    airline: "Kenya Airways",
    code: "KQ",
    from: "EBB",
    to: "NBO",
    route: "Entebbe \u2192 Nairobi",
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab45?w=800&q=80",
    price: 180,
    originalPrice: 250,
    stops: "Non-stop",
    duration: "1h 15m",
    tag: "Popular",
  },
  {
    id: 3,
    airline: "British Airways",
    code: "BA",
    from: "EBB",
    to: "LHR",
    route: "Entebbe \u2192 London",
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80",
    price: 680,
    originalPrice: 890,
    stops: "1 stop",
    duration: "11h 20m",
    tag: "Top Rated",
  },
  {
    id: 4,
    airline: "Ethiopian Airlines",
    code: "ET",
    from: "EBB",
    to: "ADD",
    route: "Entebbe \u2192 Addis Ababa",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1562983078-daa1dac6dc90?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1571003123894-1f6678cb2cc0?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=800&q=80",
    duration: "Half Day",
    price: 80,
    rating: 4.5,
    reviews: 145,
    tag: null,
  },
];

const popularDestinations = [
  { id: 1, name: "Dubai", country: "UAE", emoji: "\ud83c\udfd9\ufe0f", image: "https://images.unsplash.com/photo-1512453979798-5ea904ac22ac?w=800&q=80", flights: 45, hotels: 280, from: "$450" },
  { id: 2, name: "Nairobi", country: "Kenya", emoji: "\ud83e\udd81", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80", flights: 38, hotels: 156, from: "$180" },
  { id: 3, name: "London", country: "UK", emoji: "\ud83c\uddec\ud83c\udde7", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", flights: 25, hotels: 450, from: "$680" },
  { id: 4, name: "Kampala", country: "Uganda", emoji: "\ud83c\udfd9\ufe0f", image: "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=800&q=80", flights: 15, hotels: 85, from: "$50" },
  { id: 5, name: "Zanzibar", country: "Tanzania", emoji: "\ud83c\udfd6\ufe0f", image: "https://images.unsplash.com/photo-1586861616093-24a1b84dc6e5?w=800&q=80", flights: 22, hotels: 120, from: "$350" },
  { id: 6, name: "Kigali", country: "Rwanda", emoji: "\ud83c\udf31", image: "https://images.unsplash.com/photo-1586861616093-24a1b84dc6e5?w=800&q=80", flights: 18, hotels: 65, from: "$200" },
];

const whyChooseUs = [
  { icon: Shield, title: "Secure Booking", desc: "100% secure payments with SSL encryption" },
  { icon: Wallet, title: "Best Price Guarantee", desc: "We match any price within 24 hours" },
  { icon: Phone, title: "24/7 Support", desc: "Dedicated support team always ready" },
  { icon: Star, title: "4.8/5 Rating", desc: "Trusted by thousands of travelers" },
];

const airlineLogos: Record<string, string> = {
  emirates: "EK",
  "kenya airways": "KQ",
  "british airways": "BA",
  ethiopian: "ET",
  "south african": "SA",
  rwandair: "WB",
};

const modules = [
  { id: "flights", label: "Flights", icon: Plane, color: "blue" },
  { id: "hotels", label: "Hotels", icon: Building2, color: "emerald" },
  { id: "tours", label: "Tours", icon: MapPin, color: "orange" },
  { id: "cars", label: "Cars", icon: Car, color: "violet" },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("flights");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                VerTravels
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {modules.map((m) => (
                <Link
                  key={m.id}
                  href={`/${m.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm hover:shadow-md"
              >
                Register
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-1">
            {modules.map((m) => (
              <Link key={m.id} href={`/${m.id}`} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
                <m.icon className="w-4 h-4" />
                {m.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link href="/register" className="flex items-center gap-3 px-3 py-2.5 text-blue-600 font-medium hover:bg-blue-50 rounded-lg text-sm">
              <User className="w-4 h-4" /> Register
            </Link>
          </div>
        )}
      </header>

      {/* Hero + Search */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/85 to-indigo-900/90" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Trusted by 10,000+ travelers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Your Journey
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                Starts Here
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
              Flights &bull; Hotels &bull; Tours &bull; Car Rentals &mdash; All in one place. Best prices guaranteed.
            </p>
          </div>

          {/* Search Widget */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Module Tabs */}
              <div className="flex border-b border-gray-100">
                {modules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveModule(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition relative ${
                        activeModule === m.id
                          ? `text-blue-600`
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {m.label}
                      {activeModule === m.id && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From / To</label>
                    <div className="flex gap-0">
                      <div className="flex-1 relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="City or Airport" className="w-full px-3 py-3 pl-10 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                      </div>
                      <div className="flex items-center px-2 text-gray-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Destination" className="w-full px-3 py-3 pl-10 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" className="w-full px-3 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Travelers</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select className="w-full px-3 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none bg-white">
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
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
                >
                  <Search className="w-5 h-5" />
                  Search Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-gray-100 -mt-4 relative z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-16 py-5">
            {[
              { icon: Globe, label: "50+ Airlines", sub: "Worldwide coverage" },
              { icon: Building2, label: "10,000+ Hotels", sub: "Global inventory" },
              { icon: Users, label: "10K+ Travelers", sub: "Trusted by many" },
              { icon: Shield, label: "Secure", sub: "SSL encrypted" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Strip */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {popularDestinations.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                href={`/flights/search?from=EBB&to=${dest.name}`}
                className="bg-white/15 hover:bg-white/25 text-white px-5 py-2 rounded-full flex items-center gap-2 transition text-sm font-medium backdrop-blur-sm"
              >
                <span>{dest.emoji}</span>
                <span>{dest.name}</span>
                <span className="text-white/60 text-xs">from {dest.from}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Flight Deals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Best Deals</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Featured Flight Deals</h2>
              <p className="text-gray-500 mt-1">Save big on popular routes from Uganda</p>
            </div>
            <Link href="/flights" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredFlights.map((flight) => (
              <Link
                key={flight.id}
                href="/flights/search"
                className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 flex items-center justify-between">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                    {flight.code ? (
                      <img
                        src={`https://content.airhex.com/airline-logos/${flight.code}_square.png`}
                        alt={flight.airline}
                        className="w-12 h-12 object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">{flight.airline}</p>
                    <p className="font-bold text-gray-900">{flight.route}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{flight.duration} &bull; {flight.stops}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-400 line-through">${flight.originalPrice}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">from</span>
                        <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                      </div>
                    </div>
                    {flight.tag && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                        {flight.tag}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Stay</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">Featured Hotels</h2>
              <p className="text-slate-500 mt-1">Handpicked properties for your comfort</p>
            </div>
            <Link href="/hotels" className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <HotelCarousel hotels={featuredHotels} />
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Experience</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Featured Tours & Safaris</h2>
              <p className="text-gray-500 mt-1">Unforgettable experiences across East Africa</p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTours.map((tour) => (
              <Link
                key={tour.id}
                href="/tours/search"
                className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {tour.tag && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                      {tour.tag}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {tour.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{tour.rating}</span>
                    <span className="text-xs text-gray-400">({tour.reviews} reviews)</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition mb-1">{tour.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tour.location}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-orange-600">${tour.price}</p>
                    <p className="text-xs text-gray-400">/ person</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Why Choose VerTravels</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            We make travel booking simple, secure, and affordable
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition border border-gray-100 hover:border-blue-200">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Popular Destinations</h2>
          <p className="text-gray-500 text-center mb-10">Most searched destinations from Uganda</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/flights/search?from=EBB&to=${dest.name}`}
                className="group relative rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-44">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm">
                    {dest.emoji}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                    <p className="text-white/70 text-sm">{dest.country}</p>
                    <p className="text-blue-300 font-bold text-sm mt-1">From {dest.from}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Airlines */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Trusted Partner Airlines</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {Object.entries(airlineLogos).map(([name, code]) => (
              <div key={name} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:border-blue-200 group-hover:shadow-sm transition">
                  <img
                    src={`https://content.airhex.com/airline-logos/${code}_square.png`}
                    alt={name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium capitalize">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Get 10% Off Your First Booking!</h2>
          <p className="text-blue-100/80 text-lg mb-8 max-w-2xl mx-auto">
            Sign up today and receive an exclusive discount on your next adventure. No hidden fees, best prices guaranteed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              href="/flights"
              className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition border border-white/20"
            >
              Browse Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">VerTravels</span>
              </div>
              <p className="text-sm leading-relaxed">Your trusted travel partner for flights, hotels, tours, and car rentals across East Africa and beyond.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <div className="space-y-2.5 text-sm">
                <Link href="/flights" className="block hover:text-white transition">Flights</Link>
                <Link href="/hotels" className="block hover:text-white transition">Hotels</Link>
                <Link href="/tours" className="block hover:text-white transition">Tours</Link>
                <Link href="/cars" className="block hover:text-white transition">Cars</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <div className="space-y-2.5 text-sm">
                <p className="hover:text-white transition cursor-pointer">Help Center</p>
                <p className="hover:text-white transition cursor-pointer">Contact Us</p>
                <p className="hover:text-white transition cursor-pointer">Cancellation Policy</p>
                <p className="hover:text-white transition cursor-pointer">Safety</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> +256 123 456789</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> info@vertravels.com</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Kampala, Uganda</p>
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

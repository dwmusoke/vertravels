"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SearchResults } from "@/components/hotels/search-results";
import { SearchFilters } from "@/components/hotels/search-filters";
import { Building2, ArrowLeft, Home, Plane, MapPin, Car } from "lucide-react";

export default function HotelsSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">VerTravels</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/flights" className="text-gray-600 hover:text-sky-600">
              Flights
            </Link>
            <Link href="/hotels" className="text-emerald-600 font-medium">
              Hotels
            </Link>
            <Link href="/tours" className="text-gray-600 hover:text-amber-600">
              Tours
            </Link>
            <Link href="/cars" className="text-gray-600 hover:text-purple-600">
              Cars
            </Link>
          </nav>
          <Link href="/login" className="text-gray-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-sky-700 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
            alt="Hotel background"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80";
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Hotel Search Results
          </h1>
          <p className="text-white/80 text-lg">
            Find the perfect accommodation for your stay
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center gap-6">
          <Link
            href="/flights"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
          >
            <Plane className="w-4 h-4" /> Book Flights
          </Link>
          <Link
            href="/hotels"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Building2 className="w-4 h-4" /> Find Hotels
          </Link>
          <Link
            href="/tours"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <MapPin className="w-4 h-4" /> Tours & Safaris
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Car className="w-4 h-4" /> Rent a Car
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters />
            </Suspense>
          </aside>

          <main className="lg:col-span-3 space-y-4">
            <Suspense fallback={<div>Loading hotels...</div>}>
              <SearchResults />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

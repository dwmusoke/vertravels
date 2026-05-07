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
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                className="text-gray-600 hover:text-sky-600 font-medium transition"
              >
                Hotels
              </Link>
              <Link
                href="/tours"
                className="text-gray-600 hover:text-sky-600 font-medium transition"
              >
                Tours
              </Link>
              <Link
                href="/cars"
                className="text-gray-600 hover:text-sky-600 font-medium transition"
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
              <Link
                href="/flights"
                className="block py-2 text-gray-600 hover:text-sky-600"
              >
                Flights
              </Link>
              <Link
                href="/hotels"
                className="block py-2 text-gray-600 hover:text-sky-600"
              >
                Hotels
              </Link>
              <Link
                href="/tours"
                className="block py-2 text-gray-600 hover:text-sky-600"
              >
                Tours
              </Link>
              <Link
                href="/cars"
                className="block py-2 text-gray-600 hover:text-sky-600"
              >
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-600 via-sky-700 to-teal-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
            Book flights, hotels, tours, and cars all in one place. Best prices
            guaranteed.
          </p>

          {/* Quick Search Widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-5xl mx-auto">
            {/* Module Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { name: "Flights", icon: Plane, href: "/flights/search" },
                { name: "Hotels", icon: Hotel, href: "/hotels/search" },
                { name: "Tours", icon: MapPin, href: "/tours/search" },
                { name: "Cars", icon: Car, href: "/cars/search" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-sky-100 hover:text-sky-600 transition text-sm font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  FROM
                </label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  TO
                </label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  DATE
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  TRAVELERS
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm">
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3 Travelers</option>
                  <option>4+ Travelers</option>
                </select>
              </div>
            </div>
            <button className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition">
              <Search className="w-5 h-5" />
              Search Now
            </button>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What would you like to book?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/flights"
              className="bg-white border-2 border-gray-100 hover:border-sky-500 rounded-xl p-4 transition-all hover:shadow-lg group text-center"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-sky-500 transition mx-auto">
                <Plane className="w-6 h-6 text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Flights</h3>
              <p className="text-xs text-gray-500 mt-1">400+ airlines</p>
            </Link>
            <Link
              href="/hotels"
              className="bg-white border-2 border-gray-100 hover:border-emerald-500 rounded-xl p-4 transition-all hover:shadow-lg group text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition mx-auto">
                <Hotel className="w-6 h-6 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hotels</h3>
              <p className="text-xs text-gray-500 mt-1">2M+ properties</p>
            </Link>
            <Link
              href="/tours"
              className="bg-white border-2 border-gray-100 hover:border-amber-500 rounded-xl p-4 transition-all hover:shadow-lg group text-center"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-500 transition mx-auto">
                <MapPin className="w-6 h-6 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Tours</h3>
              <p className="text-xs text-gray-500 mt-1">50K+ activities</p>
            </Link>
            <Link
              href="/cars"
              className="bg-white border-2 border-gray-100 hover:border-violet-500 rounded-xl p-4 transition-all hover:shadow-lg group text-center"
            >
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-violet-500 transition mx-auto">
                <Car className="w-6 h-6 text-violet-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cars</h3>
              <p className="text-xs text-gray-500 mt-1">Best prices</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/flights/search"
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-900">
                Search Flights
              </p>
            </Link>
            <Link
              href="/hotels/search"
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-900">Find Hotels</p>
            </Link>
            <Link
              href="/tours/search"
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-900">
                Discover Tours
              </p>
            </Link>
            <Link
              href="/cars/search"
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-900">Rent a Car</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 VerTravels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

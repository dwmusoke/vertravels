"use client";

import Link from "next/link";
import { Plane, Hotel, MapPin, Car, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                VerTravels
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/flights"
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                Flights
              </Link>
              <Link
                href="/hotels"
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                Hotels
              </Link>
              <Link
                href="/tours"
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                Tours
              </Link>
              <Link
                href="/cars"
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                Cars
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-600 via-sky-700 to-teal-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Book flights, hotels, tours, and cars all in one place. Best prices
            guaranteed.
          </p>

          {/* Quick Search */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  FROM
                </label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  TO
                </label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  DATE
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  TRAVELERS
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3 Travelers</option>
                  <option>4+ Travelers</option>
                </select>
              </div>
            </div>
            <button className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition">
              <Search className="w-5 h-5" />
              Search Flights
            </button>
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What would you like to book?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/flights"
              className="bg-white border-2 border-gray-100 hover:border-sky-500 rounded-2xl p-6 transition-all hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500 transition">
                <Plane className="w-7 h-7 text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Flights
              </h3>
              <p className="text-gray-500">400+ airlines worldwide</p>
            </Link>
            <Link
              href="/hotels"
              className="bg-white border-2 border-gray-100 hover:border-emerald-500 rounded-2xl p-6 transition-all hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition">
                <Hotel className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hotels
              </h3>
              <p className="text-gray-500">2M+ properties worldwide</p>
            </Link>
            <Link
              href="/tours"
              className="bg-white border-2 border-gray-100 hover:border-amber-500 rounded-2xl p-6 transition-all hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 transition">
                <MapPin className="w-7 h-7 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tours
              </h3>
              <p className="text-gray-500">50K+ activities worldwide</p>
            </Link>
            <Link
              href="/cars"
              className="bg-white border-2 border-gray-100 hover:border-violet-500 rounded-2xl p-6 transition-all hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500 transition">
                <Car className="w-7 h-7 text-violet-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cars</h3>
              <p className="text-gray-500">Best rental prices</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car as CarIcon,
  Calendar,
  Users,
  Search,
  MapPin,
  Plane,
  Building2,
  Map,
  Home,
  Gauge,
  Star,
  Briefcase,
} from "lucide-react";

export default function CarsPage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: "",
    pickup: "",
    dropoff: "",
    driverAge: "25+",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    router.push(`/cars/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <CarIcon className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">VerTravels</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link
              href="/flights"
              className="text-gray-600 hover:text-sky-600 flex items-center gap-1"
            >
              <Plane className="w-4 h-4" /> Flights
            </Link>
            <Link
              href="/hotels"
              className="text-gray-600 hover:text-emerald-600 flex items-center gap-1"
            >
              <Building2 className="w-4 h-4" /> Hotels
            </Link>
            <Link
              href="/tours"
              className="text-gray-600 hover:text-amber-600 flex items-center gap-1"
            >
              <Map className="w-4 h-4" /> Tours
            </Link>
            <Link
              href="/cars"
              className="text-gray-600 hover:text-purple-600 font-medium"
            >
              Cars
            </Link>
          </nav>
          <Link href="/login" className="text-gray-600 hover:text-purple-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🚗</div>
          <div className="absolute top-20 right-20 text-8xl">🚙</div>
          <div className="absolute bottom-10 left-1/4 text-9xl">🛻</div>
          <div className="absolute bottom-20 right-1/3 text-8xl">🚐</div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Rent a Car
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Explore at your own pace. Choose from our wide selection of vehicles
            for your perfect trip!
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center gap-6">
          <Link
            href="/flights"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
          >
            <Plane className="w-5 h-5" /> Book Flights
          </Link>
          <Link
            href="/hotels"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Building2 className="w-5 h-5" /> Find Hotels
          </Link>
          <Link
            href="/tours"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <Map className="w-5 h-5" /> Tours & Safaris
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <CarIcon className="w-5 h-5" /> Rent a Car
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pick-up Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or Airport"
                    value={searchData.location}
                    onChange={(e) =>
                      setSearchData({ ...searchData, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Pick-up Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.pickup}
                    onChange={(e) =>
                      setSearchData({ ...searchData, pickup: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Drop-off Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.dropoff}
                    onChange={(e) =>
                      setSearchData({ ...searchData, dropoff: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Driver's Age
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchData.driverAge}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        driverAge: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="21">21-24 (Young Driver)</option>
                    <option value="25">25+</option>
                    <option value="70">70+ (Senior)</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                >
                  <Search className="w-5 h-5" />
                  Search Cars
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Car Categories */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Car Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/cars/search?type=compact"
            className="bg-white p-6 rounded-xl border hover:border-purple-300 hover:shadow-lg transition text-center"
          >
            <span className="text-4xl block mb-2">🚗</span>
            <h3 className="font-bold">Economy</h3>
            <p className="text-sm text-gray-500">From $25/day</p>
          </Link>
          <Link
            href="/cars/search?type=sedan"
            className="bg-white p-6 rounded-xl border hover:border-purple-300 hover:shadow-lg transition text-center"
          >
            <span className="text-4xl block mb-2">🚘</span>
            <h3 className="font-bold">Sedan</h3>
            <p className="text-sm text-gray-500">From $35/day</p>
          </Link>
          <Link
            href="/cars/search?type=suv"
            className="bg-white p-6 rounded-xl border hover:border-purple-300 hover:shadow-lg transition text-center"
          >
            <span className="text-4xl block mb-2">🚙</span>
            <h3 className="font-bold">SUV</h3>
            <p className="text-sm text-gray-500">From $55/day</p>
          </Link>
          <Link
            href="/cars/search?type=luxury"
            className="bg-white p-6 rounded-xl border hover:border-purple-300 hover:shadow-lg transition text-center"
          >
            <span className="text-4xl block mb-2">🏎️</span>
            <h3 className="font-bold">Luxury</h3>
            <p className="text-sm text-gray-500">From $120/day</p>
          </Link>
        </div>
      </div>

      {/* Popular Pick-up Locations */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Pick-up Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/cars/search?location=entebbe"
              className="bg-purple-50 p-4 rounded-xl flex items-center gap-3 hover:bg-purple-100 transition"
            >
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 fill-purple-500 text-purple-500" />{" "}
                  Entebbe Airport
                </h3>
                <p className="text-sm text-gray-500">24/7 Pick-up</p>
              </div>
            </Link>
            <Link
              href="/cars/search?location=kampala"
              className="bg-purple-50 p-4 rounded-xl flex items-center gap-3 hover:bg-purple-100 transition"
            >
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 fill-purple-500 text-purple-500" />{" "}
                  Kampala City
                </h3>
                <p className="text-sm text-gray-500">Downtown</p>
              </div>
            </Link>
            <Link
              href="/cars/search?location=jinja"
              className="bg-purple-50 p-4 rounded-xl flex items-center gap-3 hover:bg-purple-100 transition"
            >
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 fill-purple-500 text-purple-500" />{" "}
                  Jinja
                </h3>
                <p className="text-sm text-gray-500">Town Center</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

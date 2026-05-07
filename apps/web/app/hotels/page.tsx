"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Calendar,
  Users,
  Search,
  MapPin,
  Plane,
  Car,
  Map,
  Home,
  Star,
  Wifi,
  Coffee,
  Car as CarIcon,
  Dumbbell,
  Waves,
} from "lucide-react";

export default function HotelsPage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    rooms: "1",
    guests: "2",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    router.push(`/hotels/search?${params.toString()}`);
  };

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
            <Link
              href="/flights"
              className="text-gray-600 hover:text-sky-600 flex items-center gap-1"
            >
              <Plane className="w-4 h-4" /> Flights
            </Link>
            <Link
              href="/hotels"
              className="text-gray-600 hover:text-emerald-600 font-medium"
            >
              Hotels
            </Link>
            <Link
              href="/tours"
              className="text-gray-600 hover:text-amber-600 flex items-center gap-1"
            >
              <Map className="w-4 h-4" /> Tours
            </Link>
            <Link
              href="/cars"
              className="text-gray-600 hover:text-purple-600 flex items-center gap-1"
            >
              <CarIcon className="w-4 h-4" /> Cars
            </Link>
          </nav>
          <Link href="/login" className="text-gray-600 hover:text-emerald-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-sky-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🏨</div>
          <div className="absolute top-20 right-20 text-8xl">🛎️</div>
          <div className="absolute bottom-10 left-1/4 text-9xl">🛏️</div>
          <div className="absolute bottom-20 right-1/3 text-8xl">🧳</div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Find Your Perfect Hotel
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            From luxury resorts to budget stays. Book accommodation that fits
            your style and budget!
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
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, Hotel, or Landmark"
                    value={searchData.destination}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        destination: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.checkin}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkin: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.checkout}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkout: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Rooms
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchData.rooms}
                    onChange={(e) =>
                      setSearchData({ ...searchData, rooms: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Room" : "Rooms"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Guests per Room
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchData.guests}
                    onChange={(e) =>
                      setSearchData({ ...searchData, guests: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                >
                  <Search className="w-5 h-5" />
                  Search Hotels
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/hotels/search?destination=Kampala"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-600 flex items-center justify-center">
              <span className="text-7xl">🏙️</span>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />{" "}
                  Kampala
                </h3>
                <p className="text-white/80">45 hotels</p>
              </div>
            </div>
          </Link>
          <Link
            href="/hotels/search?destination=Entebbe"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-800 to-blue-600 flex items-center justify-center">
              <span className="text-7xl">✈️</span>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />{" "}
                  Entebbe
                </h3>
                <p className="text-white/80">28 hotels</p>
              </div>
            </div>
          </Link>
          <Link
            href="/hotels/search?destination=Jinja"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-orange-600 flex items-center justify-center">
              <span className="text-7xl">🌊</span>
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />{" "}
                  Jinja
                </h3>
                <p className="text-white/80">18 hotels</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/hotels/search?amenity=wifi"
              className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition"
            >
              <Wifi className="w-8 h-8 text-emerald-600" />
              <span className="font-medium">Free WiFi</span>
            </Link>
            <Link
              href="/hotels/search?amenity=breakfast"
              className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition"
            >
              <Coffee className="w-8 h-8 text-emerald-600" />
              <span className="font-medium">Breakfast</span>
            </Link>
            <Link
              href="/hotels/search?amenity=pool"
              className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition"
            >
              <Waves className="w-8 h-8 text-emerald-600" />
              <span className="font-medium">Pool</span>
            </Link>
            <Link
              href="/hotels/search?amenity=gym"
              className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 hover:bg-emerald-50 transition"
            >
              <Dumbbell className="w-8 h-8 text-emerald-600" />
              <span className="font-medium">Gym</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

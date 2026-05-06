"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hotel, Calendar, Users, Search, MapPin, Star } from "lucide-react";

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
    params.set("module", "hotels");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-sky-600">
            VerTravels
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/flights" className="text-gray-600 hover:text-sky-600">
              Flights
            </Link>
            <Link href="/tours" className="text-gray-600 hover:text-sky-600">
              Tours
            </Link>
            <Link href="/cars" className="text-gray-600 hover:text-sky-600">
              Cars
            </Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-b from-emerald-100 to-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Find Your Perfect Hotel
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6">
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
                        setSearchData({
                          ...searchData,
                          checkin: e.target.value,
                        })
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
                        setSearchData({
                          ...searchData,
                          checkout: e.target.value,
                        })
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
                    <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Search className="w-5 h-5" />
                    Search Hotels
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

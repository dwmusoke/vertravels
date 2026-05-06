"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Calendar, User, Search, MapPin } from "lucide-react";

export default function CarsPage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "10:00",
    dropoffDate: "",
    dropoffTime: "10:00",
    driverAge: "25+",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    params.set("module", "cars");
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
            <Link href="/hotels" className="text-gray-600 hover:text-sky-600">
              Hotels
            </Link>
            <Link href="/tours" className="text-gray-600 hover:text-sky-600">
              Tours
            </Link>
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-b from-violet-100 to-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Rent a Car</h1>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City or Airport"
                      value={searchData.pickupLocation}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          pickupLocation: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
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
                      value={searchData.pickupDate}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          pickupDate: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Time
                  </label>
                  <select
                    value={searchData.pickupTime}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        pickupTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  >
                    {Array.from(
                      { length: 24 },
                      (_, i) => `${i.toString().padStart(2, "0")}:00`,
                    ).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Driver's Age
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={searchData.driverAge}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          driverAge: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="21">21-24 (Young Driver)</option>
                      <option value="25">25+</option>
                      <option value="70">70+ (Senior)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="sameDropoff" className="rounded" />
                <label htmlFor="sameDropoff" className="text-sm text-gray-600">
                  Return to same location
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
              >
                <Search className="w-5 h-5" />
                Search Cars
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

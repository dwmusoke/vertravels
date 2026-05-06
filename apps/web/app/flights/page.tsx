"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function FlightsPage() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    travelers: "1",
    class: "economy",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    params.set("module", "flights");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-sky-600">
            VerTravels
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/hotels" className="text-gray-600 hover:text-sky-600">
              Hotels
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

      {/* Search Form */}
      <div className="bg-gradient-to-b from-sky-100 to-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Flights
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Trip Type */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTripType("roundtrip")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  tripType === "roundtrip"
                    ? "bg-sky-100 text-sky-600"
                    : "text-gray-600"
                }`}
              >
                Round Trip
              </button>
              <button
                onClick={() => setTripType("oneway")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  tripType === "oneway"
                    ? "bg-sky-100 text-sky-600"
                    : "text-gray-600"
                }`}
              >
                One Way
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    From
                  </label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City or Airport"
                      value={searchData.from}
                      onChange={(e) =>
                        setSearchData({ ...searchData, from: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Destination"
                      value={searchData.to}
                      onChange={(e) =>
                        setSearchData({ ...searchData, to: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Depart
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.departDate}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          departDate: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>
                {tripType === "roundtrip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Return
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={searchData.returnDate}
                        onChange={(e) =>
                          setSearchData({
                            ...searchData,
                            returnDate: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={searchData.travelers}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          travelers: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Adult" : "Adults"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Class
                  </label>
                  <select
                    value={searchData.class}
                    onChange={(e) =>
                      setSearchData({ ...searchData, class: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Search className="w-5 h-5" />
                    Search Flights
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

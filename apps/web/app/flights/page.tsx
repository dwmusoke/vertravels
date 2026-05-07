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
  Hotel,
  Car,
  Map,
  Home,
} from "lucide-react";

export default function FlightsPage() {
  const router = useRouter();
  const [tripType, setTripType] = useState<
    "roundtrip" | "oneway" | "multicity"
  >("roundtrip");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    travelers: "1",
    class: "economy",
  });
  const [multiCity, setMultiCity] = useState([
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("from", searchData.from);
    params.set("to", searchData.to);
    params.set("depart", searchData.departDate);
    params.set("return", searchData.returnDate || "");
    params.set("pax", searchData.travelers);
    router.push(`/flights/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-sky-600" />
            <span className="text-xl font-bold text-gray-900">VerTravels</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link
              href="/flights"
              className="text-gray-600 hover:text-sky-600 font-medium"
            >
              Flights
            </Link>
            <Link
              href="/hotels"
              className="text-gray-600 hover:text-emerald-600 flex items-center gap-1"
            >
              <Hotel className="w-4 h-4" /> Hotels
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
              <Car className="w-4 h-4" /> Cars
            </Link>
          </nav>
          <Link href="/login" className="text-gray-600 hover:text-sky-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Compare prices across hundreds of airlines and booking sites. We
            help you find the best deals!
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
            <Hotel className="w-5 h-5" /> Find Hotels
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
            <Car className="w-5 h-5" /> Rent a Car
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
          {/* Trip Type */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
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
              type="button"
              onClick={() => setTripType("oneway")}
              className={`px-4 py-2 rounded-lg font-medium ${
                tripType === "oneway"
                  ? "bg-sky-100 text-sky-600"
                  : "text-gray-600"
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType("multicity")}
              className={`px-4 py-2 rounded-lg font-medium ${
                tripType === "multicity"
                  ? "bg-sky-100 text-sky-600"
                  : "text-gray-600"
              }`}
            >
              Multi-City
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
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-700 hover:to-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                >
                  <Search className="w-5 h-5" />
                  Search Flights
                </button>
              </div>
            </div>
          </form>

          {/* Multi-City Form */}
          {tripType === "multicity" && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">
                  Multi-City Itinerary
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setMultiCity([...multiCity, { from: "", to: "", date: "" }])
                  }
                  className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                >
                  + Add Flight
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {multiCity.map((flight, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        From
                      </label>
                      <input
                        type="text"
                        placeholder="Origin"
                        value={flight.from}
                        onChange={(e) => {
                          const updated = [...multiCity];
                          updated[idx].from = e.target.value;
                          setMultiCity(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        To
                      </label>
                      <input
                        type="text"
                        placeholder="Destination"
                        value={flight.to}
                        onChange={(e) => {
                          const updated = [...multiCity];
                          updated[idx].to = e.target.value;
                          setMultiCity(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={flight.date}
                        onChange={(e) => {
                          const updated = [...multiCity];
                          updated[idx].date = e.target.value;
                          setMultiCity(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      {multiCity.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMultiCity(multiCity.filter((_, i) => i !== idx))
                          }
                          className="w-full px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Travelers
                  </label>
                  <select
                    value={searchData.travelers}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        travelers: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set("type", "multicity");
                      params.set("flights", JSON.stringify(multiCity));
                      params.set("pax", searchData.travelers);
                      router.push(`/flights/search?${params.toString()}`);
                    }}
                    className="w-full bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-700 text-white py-3 rounded-lg font-bold"
                  >
                    Search Multi-City
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Routes */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Popular Routes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/flights/search?from=EBB&to=NBO"
            className="bg-white p-4 rounded-xl border hover:border-sky-300 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Entebbe → Nairobi</p>
                <p className="text-sm text-gray-500">From $250</p>
              </div>
            </div>
          </Link>
          <Link
            href="/flights/search?from=EBB&to=DXB"
            className="bg-white p-4 rounded-xl border hover:border-sky-300 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Entebbe → Dubai</p>
                <p className="text-sm text-gray-500">From $450</p>
              </div>
            </div>
          </Link>
          <Link
            href="/flights/search?from=EBB&to=LHR"
            className="bg-white p-4 rounded-xl border hover:border-sky-300 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium">Entebbe → London</p>
                <p className="text-sm text-gray-500">From $650</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

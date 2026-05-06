"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  Search,
  Users,
  Calendar,
} from "lucide-react";

type Module = "flights" | "hotels" | "tours" | "cars";

const moduleConfig = {
  flights: {
    icon: Plane,
    color: "sky",
    placeholderFrom: "From (City or Airport)",
    placeholderTo: "To (City or Airport)",
    searchFields: ["departure", "return", "travelers"],
  },
  hotels: {
    icon: Hotel,
    color: "emerald",
    placeholderFrom: "City or Destination",
    placeholderTo: "Check-in Date",
    searchFields: ["checkin", "checkout", "rooms"],
  },
  tours: {
    icon: MapPin,
    color: "amber",
    placeholderFrom: "Where to?",
    placeholderTo: "Tour Type",
    searchFields: ["date", "duration", "guests"],
  },
  cars: {
    icon: Car,
    color: "violet",
    placeholderFrom: "Pick-up Location",
    placeholderTo: "Drop-off Location",
    searchFields: ["pickup", "dropoff", "driver"],
  },
};

export default function HomePage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<Module>("flights");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    travelers: "1",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("from", searchData.from);
    params.set("to", searchData.to);
    params.set("depart", searchData.departDate);
    params.set("return", searchData.returnDate);
    params.set("pax", searchData.travelers);
    router.push(`/search?${params.toString()}`);
  };

  const activeConfig = moduleConfig[activeModule];
  const ColorIcon = activeConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                VerTravels
              </span>
            </Link>
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
              <Link
                href="/visa"
                className="text-gray-600 hover:text-sky-600 font-medium transition"
              >
                Visa
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-sky-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-600 via-sky-700 to-teal-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Book flights, hotels, tours, and cars all in one place. Best prices
            guaranteed.
          </p>

          {/* Search Widget - PHP Travels Style */}
          <div className="bg-white rounded-2xl shadow-2xl p-1 max-w-5xl mx-auto">
            {/* Module Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
              {(["flights", "hotels", "tours", "cars"] as Module[]).map(
                (module) => {
                  const config = moduleConfig[module];
                  const Icon = config.icon;
                  const isActive = activeModule === module;
                  return (
                    <button
                      key={module}
                      onClick={() => setActiveModule(module)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition ${
                        isActive
                          ? `bg-white text-${config.color}-600 shadow-sm`
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="capitalize">{module}</span>
                    </button>
                  );
                },
              )}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    FROM
                  </label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={activeConfig.placeholderFrom}
                      value={searchData.from}
                      onChange={(e) =>
                        setSearchData({ ...searchData, from: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    TO
                  </label>
                  <div className="relative">
                    <ColorIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={activeConfig.placeholderTo}
                      value={searchData.to}
                      onChange={(e) =>
                        setSearchData({ ...searchData, to: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {activeModule === "flights"
                      ? "DEPART"
                      : activeModule === "hotels"
                        ? "CHECK-IN"
                        : activeModule === "tours"
                          ? "DATE"
                          : "PICK-UP"}
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    TRAVELERS
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Traveler" : "Travelers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Search className="w-5 h-5" />
                Search{" "}
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
              </button>
            </form>
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

      {/* Tailwind Test */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-2">
              Tailwind CSS is Working!
            </h3>
            <p>If you see this styled box, Tailwind is properly configured.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/flights" className="hover:text-white">
                    Flights
                  </Link>
                </li>
                <li>
                  <Link href="/hotels" className="hover:text-white">
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link href="/tours" className="hover:text-white">
                    Tours
                  </Link>
                </li>
                <li>
                  <Link href="/cars" className="hover:text-white">
                    Cars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">VerTravels</h4>
              <p className="text-sm">
                Modern travel booking platform for flights, hotels, tours, and
                more.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2026 VerTravels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

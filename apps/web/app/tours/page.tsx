"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Map,
  Calendar,
  Users,
  Search,
  MapPin,
  Compass,
  Palmtree,
  Camera,
  Mountain,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Home,
} from "lucide-react";

const tourCategories = [
  {
    id: "safari",
    name: "Safari Adventures",
    description: "Experience the wild!",
    icon: "🦁",
    color: "from-amber-600 to-yellow-500",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  },
  {
    id: "cultural",
    name: "Cultural Tours",
    description: "Explore local heritage",
    icon: "🏛️",
    color: "from-indigo-600 to-purple-500",
    image:
      "https://images.unsplash.com/photo-1523906834658-6e4ef728dcba?w=800&q=80",
  },
  {
    id: "adventure",
    name: "Adventure Tours",
    description: "Get your adrenaline rushing",
    icon: "🧗",
    color: "from-emerald-600 to-teal-500",
    image:
      "https://images.unsplash.com/photo-1527637493608-7163c71f5e84?w=800&q=80",
  },
  {
    id: "beach",
    name: "Beach & Island",
    description: "Relax and unwind",
    icon: "🏖️",
    color: "from-sky-600 to-blue-500",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
];

const featuredTours = [
  {
    id: 1,
    name: "Gorilla Trekking Adventure",
    location: "Bwindi Impenetrable Forest",
    duration: "2 Days",
    price: 890,
    rating: 4.9,
    reviews: 328,
    image:
      "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Savanna Safari Lodge",
    location: "Murchison Falls",
    duration: "3 Days",
    price: 1250,
    rating: 4.8,
    reviews: 256,
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Kampala City Experience",
    location: "Kampala",
    duration: "1 Day",
    price: 150,
    rating: 4.7,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=800&q=80",
    tag: "Top Rated",
  },
  {
    id: 4,
    name: "Ssemakula River Cruise",
    location: "Lake Victoria",
    duration: "Half Day",
    price: 120,
    rating: 4.6,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=800&q=80",
    tag: null,
  },
];

export default function ToursPage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    guests: "2",
    type: "all",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    router.push(`/tours/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Map className="w-8 h-8 text-amber-600" />
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
              <Hotel className="w-4 h-4" /> Hotels
            </Link>
            <Link
              href="/tours"
              className="text-gray-600 hover:text-amber-600 font-medium"
            >
              Tours
            </Link>
            <Link
              href="/cars"
              className="text-gray-600 hover:text-purple-600 flex items-center gap-1"
            >
              <Car className="w-4 h-4" /> Cars
            </Link>
          </nav>
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Amazing Tours
            <br />
            <span className="text-amber-200">& Safaris</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl">
            From thrilling gorilla trekking to relaxing sunset cruises.
            Experience the adventure of a lifetime in Uganda & East Africa!
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={searchData.destination}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          destination: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.date}
                      onChange={(e) =>
                        setSearchData({ ...searchData, date: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={searchData.guests}
                      onChange={(e) =>
                        setSearchData({ ...searchData, guests: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                <Search className="w-5 h-5" />
                Search Tours
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Links to Other Sections */}
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

      {/* Tour Categories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tourCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/tours/search?type=${cat.id}`}
              className={`group bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300`}
            >
              <span className="text-5xl mb-4 block">{cat.icon}</span>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-white/80">{cat.description}</p>
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Tours */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Tours & Safaris
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/search?tour=${tour.id}`}
                className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                  />
                  {tour.tag && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {tour.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {tour.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {tour.location}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {tour.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" /> {tour.reviews} reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">
                        ${tour.price}
                      </span>
                      <span className="text-gray-500 text-sm">/person</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/tours/search?destination=kampala"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1557142046-c704a3aec804?w=600&q=80"
              alt="Kampala"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold">Kampala City</h3>
                <p className="text-white/80">15 tours available</p>
              </div>
            </div>
          </Link>
          <Link
            href="/tours/search?destination=entebbe"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
              alt="Entebbe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold">Entebbe</h3>
                <p className="text-white/80">8 tours available</p>
              </div>
            </div>
          </Link>
          <Link
            href="/tours/search?destination=jinja"
            className="relative h-48 rounded-2xl overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=600&q=80"
              alt="Jinja"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold">Jinja (Source of Nile)</h3>
                <p className="text-white/80">12 tours available</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Your Adventure?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Book now and get 10% off your first tour!
          </p>
          <Link
            href="/tours/search"
            className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Start Searching <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

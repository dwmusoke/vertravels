"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  Search,
  Star,
  MapPin as Location,
  Calendar,
  User,
} from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const module = searchParams.get("module") || "flights";

  useEffect(() => {
    // Simulate search - in production, this would query Supabase/API
    setTimeout(() => {
      setResults([
        {
          id: "1",
          title: `${to} - ${module === "flights" ? "Flight" : module === "hotels" ? "Hotel" : "Tour"}`,
          subtitle: "Multiple Airlines",
          price: 499,
          rating: 4.5,
          image: null,
        },
        {
          id: "2",
          title: `${to} Premium Experience`,
          subtitle: "Best Partners",
          price: 799,
          rating: 4.8,
          image: null,
        },
        {
          id: "3",
          title: `${to} Budget Option`,
          subtitle: "Economy Class",
          price: 299,
          rating: 4.2,
          image: null,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [from, to, module]);

  const getIcon = () => {
    switch (module) {
      case "flights":
        return Plane;
      case "hotels":
        return Hotel;
      case "tours":
        return MapPin;
      case "cars":
        return Car;
      default:
        return Plane;
    }
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/" className="text-xl font-bold text-sky-600">
            VerTravels
          </Link>
        </div>
      </header>

      {/* Search Results */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {loading ? "Searching..." : `${results.length} results for ${to}`}
          </h1>
          <p className="text-gray-600">
            {from} → {to}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h2>
            <p className="text-gray-600">Try different search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.title}
                        </h3>
                        <p className="text-gray-600">{result.subtitle}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {result.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-600">
                          ${result.price}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                        <button className="mt-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

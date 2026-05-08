"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { FlightCard } from "./flight-card";
import { Skeleton } from "@/components/ui";
import {
  ArrowUpDown,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Plane,
  Filter,
  SearchX,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockFlights = [
  {
    id: "FL001", airline: "American Airlines", airlineCode: "AA", flightNumber: "AA123",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T08:00:00", arrival: "2024-02-15T20:00:00",
    duration: "7h 00m", stops: 0, price: 650, currency: "USD", cabinClass: "economy", available: true,
  },
  {
    id: "FL002", airline: "British Airways", airlineCode: "BA", flightNumber: "BA456",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T14:00:00", arrival: "2024-02-16T02:00:00",
    duration: "7h 00m", stops: 0, price: 720, currency: "USD", cabinClass: "economy", available: true,
  },
  {
    id: "FL003", airline: "Delta Air Lines", airlineCode: "DL", flightNumber: "DL789",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T18:00:00", arrival: "2024-02-16T10:00:00",
    duration: "11h 00m", stops: 1, stopover: "ATL", price: 580, currency: "USD", cabinClass: "economy", available: true,
  },
  {
    id: "FL004", airline: "Emirates", airlineCode: "EK", flightNumber: "EK201",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T22:00:00", arrival: "2024-02-16T14:00:00",
    duration: "11h 00m", stops: 1, stopover: "DXB", price: 890, currency: "USD", cabinClass: "business", available: true,
  },
  {
    id: "FL005", airline: "United Airlines", airlineCode: "UA", flightNumber: "UA841",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T07:30:00", arrival: "2024-02-15T19:45:00",
    duration: "7h 15m", stops: 0, price: 695, currency: "USD", cabinClass: "economy", available: true,
  },
  {
    id: "FL006", airline: "Qatar Airways", airlineCode: "QR", flightNumber: "QR702",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T11:00:00", arrival: "2024-02-16T04:00:00",
    duration: "12h 00m", stops: 1, stopover: "DOH", price: 780, currency: "USD", cabinClass: "premium", available: true,
  },
  {
    id: "FL007", airline: "Virgin Atlantic", airlineCode: "VS", flightNumber: "VS138",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T21:00:00", arrival: "2024-02-16T09:00:00",
    duration: "7h 00m", stops: 0, price: 610, currency: "USD", cabinClass: "economy", available: true,
  },
  {
    id: "FL008", airline: "Lufthansa", airlineCode: "LH", flightNumber: "LH401",
    origin: "JFK", destination: "LHR", departure: "2024-02-15T16:00:00", arrival: "2024-02-16T09:30:00",
    duration: "10h 30m", stops: 1, stopover: "FRA", price: 540, currency: "USD", cabinClass: "economy", available: true,
  },
];

type SortOption = "recommended" | "price-low" | "price-high" | "duration" | "departure";

interface SearchResultsProps {
  onOpenFilters?: () => void;
}

export function SearchResults({ onOpenFilters }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || searchParams.get("origin") || "JFK";
  const to = searchParams.get("to") || searchParams.get("destination") || "LHR";
  const depart = searchParams.get("depart") || searchParams.get("departure");
  const returnDate = searchParams.get("return");
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const infants = searchParams.get("infants") || "0";
  const cabin = searchParams.get("cabin") || "economy";

  const totalPax = parseInt(adults) + parseInt(children) + parseInt(infants);
  const paxText = [
    `${adults} Adult${parseInt(adults) > 1 ? "s" : ""}`,
    parseInt(children) > 0 && `${children} Child${parseInt(children) > 1 ? "ren" : ""}`,
    parseInt(infants) > 0 && `${infants} Infant${parseInt(infants) > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(", ");

  const sortedFlights = useMemo(() => {
    const flights = [...mockFlights];
    switch (sortBy) {
      case "price-low":
        return flights.sort((a, b) => a.price - b.price);
      case "price-high":
        return flights.sort((a, b) => b.price - a.price);
      case "duration":
        return flights.sort((a, b) => {
          const getMinutes = (d: string) => {
            const parts = d.match(/(\d+)h\s*(\d+)?m?/);
            if (!parts) return 0;
            return parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
          };
          return getMinutes(a.duration) - getMinutes(b.duration);
        });
      case "departure":
        return flights.sort(
          (a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime()
        );
      default:
        return flights;
    }
  }, [sortBy]);

  const handleSelect = useCallback(
    (flight: any) => {
      sessionStorage.setItem("selectedFlight", JSON.stringify(flight));
      const params = new URLSearchParams({
        from: from || "",
        to: to || "",
        depart: depart || "",
        return: returnDate || "",
        adults,
        children,
        infants,
        cabin,
      });
      router.push(`/flights/checkout?${params.toString()}`);
    },
    [from, to, depart, returnDate, adults, children, infants, cabin, router]
  );

  const handleDetails = useCallback(
    (flight: any) => {
      sessionStorage.setItem("selectedFlight", JSON.stringify(flight));
      const params = new URLSearchParams({
        from: from || "",
        to: to || "",
        depart: depart || "",
        return: returnDate || "",
        adults,
        children,
        infants,
        cabin,
      });
      router.push(`/flights/checkout?${params.toString()}`);
    },
    [from, to, depart, returnDate, adults, children, infants, cabin, router]
  );

  const sortOptions: { value: SortOption; label: string; icon: any }[] = [
    { value: "recommended", label: "Recommended", icon: Star },
    { value: "price-low", label: "Price (Low to High)", icon: DollarSign },
    { value: "price-high", label: "Price (High to Low)", icon: TrendingUp },
    { value: "duration", label: "Duration (Shortest)", icon: Clock },
    { value: "departure", label: "Departure Time", icon: ArrowUpDown },
  ];

  const getDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">
                {from?.toUpperCase()} <span className="text-slate-300 mx-1">→</span> {to?.toUpperCase()}
              </h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {sortedFlights.length} flights
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {getDateDisplay(depart)}
              {returnDate && ` — ${getDateDisplay(returnDate)}`}
              <span className="mx-1.5">•</span>
              {paxText}
              <span className="mx-1.5">•</span>
              <span className="capitalize">{cabin}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFilters}
              className="lg:hidden flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
              >
                {(() => {
                  const active = sortOptions.find((o) => o.value === sortBy);
                  const Icon = active?.icon;
                  return (
                    <>
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {active?.label}
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </>
                  );
                })()}
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1.5 overflow-hidden">
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl shimmer-bg" />
                  <div>
                    <div className="h-4 w-36 shimmer-bg rounded" />
                    <div className="h-3 w-20 shimmer-bg rounded mt-1.5" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 shimmer-bg rounded-lg" />
                  <div className="flex-1 h-12 shimmer-bg rounded-lg" />
                  <div className="h-16 w-20 shimmer-bg rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedFlights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No flights found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your filters or search criteria to find available flights.
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => setSortBy("recommended")}
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedFlights.map((flight, i) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={handleSelect}
                onDetails={handleDetails}
                index={i}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-6 pb-4"
      >
        <Button
          variant="outline"
          className="min-w-[240px] rounded-xl border-slate-200 hover:border-blue-300 text-slate-600 h-11"
        >
          Load More Flights
        </Button>
      </motion.div>
    </div>
  );
}

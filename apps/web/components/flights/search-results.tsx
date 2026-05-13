"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { FlightCard } from "./flight-card";
import { FlightDetailsModal } from "./flight-details-modal";
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

const airlines = [
  { airline: "American Airlines", code: "AA" },
  { airline: "British Airways", code: "BA" },
  { airline: "Delta Air Lines", code: "DL" },
  { airline: "Emirates", code: "EK" },
  { airline: "United Airlines", code: "UA" },
  { airline: "Qatar Airways", code: "QR" },
  { airline: "Virgin Atlantic", code: "VS" },
  { airline: "Lufthansa", code: "LH" },
];

const stopoverCities: Record<string, string[]> = {
  "ATL": ["ATL"], "DXB": ["DXB"], "DOH": ["DOH"], "FRA": ["FRA"],
  "IST": ["IST"], "AMS": ["AMS"], "CDG": ["CDG"], "ADD": ["ADD"],
};

function generateMockFlights(origin: string, destination: string, date: string, isReturn: boolean) {
  const prefix = isReturn ? "RF" : "FL";
  const times = [
    { dep: "08:00", arr: "20:00", dur: "7h 00m", stops: 0, price: 650 },
    { dep: "14:00", arr: "02:00", dur: "7h 00m", stops: 0, price: 720 },
    { dep: "18:00", arr: "10:00", dur: "11h 00m", stops: 1, price: 580 },
    { dep: "22:00", arr: "14:00", dur: "11h 00m", stops: 1, price: 890 },
    { dep: "07:30", arr: "19:45", dur: "7h 15m", stops: 0, price: 695 },
    { dep: "11:00", arr: "04:00", dur: "12h 00m", stops: 1, price: 780 },
    { dep: "21:00", arr: "09:00", dur: "7h 00m", stops: 0, price: 610 },
    { dep: "16:00", arr: "09:30", dur: "10h 30m", stops: 1, price: 540 },
  ];
  const startDate = date.split("T")[0] || date;
  return times.map((t, i) => {
    const al = airlines[i % airlines.length];
    const stopoverKeys = Object.keys(stopoverCities);
    return {
      id: `${prefix}${String(i + 1).padStart(3, "0")}`,
      airline: al.airline,
      airlineCode: al.code,
      flightNumber: `${al.code}${100 + i * 10}`,
      origin,
      destination,
      departure: `${startDate}T${t.dep}:00`,
      arrival: t.stops ? `${startDate}T${t.arr}:00` : `${startDate}T${t.arr}:00`,
      duration: t.dur,
      stops: t.stops,
      ...(t.stops > 0 ? { stopover: stopoverKeys[i % stopoverKeys.length] } : {}),
      price: t.price,
      currency: "USD",
      cabinClass: i === 3 ? "business" : i === 5 ? "premium" : "economy",
      available: true,
    };
  });
}

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
  const [detailFlight, setDetailFlight] = useState<any>(null);
  const [activeLeg, setActiveLeg] = useState<"outbound" | "return">("outbound");

  const from = searchParams.get("from") || searchParams.get("origin") || "JFK";
  const to = searchParams.get("to") || searchParams.get("destination") || "LHR";
  const depart = searchParams.get("depart") || searchParams.get("departure") || "2024-02-15T00:00:00";
  const returnDate = searchParams.get("return") || searchParams.get("returnDate") || "2024-02-20T00:00:00";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const infants = searchParams.get("infants") || "0";
  const cabin = searchParams.get("cabin") || "economy";

  const paxText = [
    `${adults} Adult${parseInt(adults) > 1 ? "s" : ""}`,
    ...(parseInt(children) > 0 ? [`${children} Child${parseInt(children) > 1 ? "ren" : ""}`] : []),
    ...(parseInt(infants) > 0 ? [`${infants} Infant${parseInt(infants) > 1 ? "s" : ""}`] : []),
  ].join(", ");

  const activeFlights = useMemo(() => {
    const origin = activeLeg === "outbound" ? from : to;
    const dest = activeLeg === "outbound" ? to : from;
    const date = activeLeg === "outbound" ? depart : returnDate;
    if (!origin || !dest || !date) return [];
    return generateMockFlights(origin.toUpperCase(), dest.toUpperCase(), date, activeLeg === "return");
  }, [from, to, depart, returnDate, activeLeg]);

  const sortedFlights = useMemo(() => {
    const flights = [...activeFlights];
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
  }, [activeFlights, sortBy]);

  const handleSelect = useCallback(
    (flight: any) => {
      const legKey = activeLeg === "outbound" ? "selectedFlight" : "selectedReturnFlight";
      sessionStorage.setItem(legKey, JSON.stringify({ ...flight, leg: activeLeg }));
      const params = new URLSearchParams({
        from: from || "",
        to: to || "",
        depart: depart || "",
        return: returnDate || "",
        adults,
        children,
        infants,
        cabin,
        leg: activeLeg,
      });
      router.push(`/flights/checkout?${params.toString()}`);
    },
    [from, to, depart, returnDate, adults, children, infants, cabin, activeLeg, router]
  );

  const handleDetails = useCallback((flight: any) => {
    setDetailFlight(flight);
  }, []);

  const sortOptions: { value: SortOption; label: string; icon: any }[] = [
    { value: "recommended", label: "Recommended", icon: Star },
    { value: "price-low", label: "Price (Low to High)", icon: DollarSign },
    { value: "price-high", label: "Price (High to Low)", icon: TrendingUp },
    { value: "duration", label: "Duration (Shortest)", icon: Clock },
    { value: "departure", label: "Departure Time", icon: ArrowUpDown },
  ];

  const getDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
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
              {returnDate && returnDate !== "2024-02-20T00:00:00" ? (
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveLeg("outbound")}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                      activeLeg === "outbound"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {from?.toUpperCase()} → {to?.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setActiveLeg("return")}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                      activeLeg === "return"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {to?.toUpperCase()} → {from?.toUpperCase()}
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-bold text-slate-900">
                  {from?.toUpperCase()} <span className="text-slate-300 mx-1">→</span> {to?.toUpperCase()}
                </h2>
              )}
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {sortedFlights.length} flights
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {activeLeg === "outbound"
                ? getDateDisplay(depart)
                : getDateDisplay(returnDate)}
              {(returnDate && returnDate !== "2024-02-20T00:00:00") && (
                <span className="text-xs text-slate-400 ml-1.5">
                  ({activeLeg === "outbound" ? "Departure" : "Return"})
                </span>
              )}
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

      <FlightDetailsModal
        flight={detailFlight}
        onClose={() => setDetailFlight(null)}
        onSelect={handleSelect}
      />
    </div>
  );
}

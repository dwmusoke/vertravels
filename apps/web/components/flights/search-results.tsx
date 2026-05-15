"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "recommended" | "price-low" | "price-high" | "duration" | "departure";

interface SearchResultsProps {
  onOpenFilters?: () => void;
  from: string;
  to: string;
  depart: string;
  returnDate: string;
  adults: string;
  children: string;
  infants: string;
  cabin: string;
}

export function SearchResults({
  onOpenFilters,
  from: propFrom,
  to: propTo,
  depart: propDepart,
  returnDate: propReturnDate,
  adults: propAdults,
  children: propChildren,
  infants: propInfants,
  cabin: propCabin,
}: SearchResultsProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [detailFlight, setDetailFlight] = useState<any>(null);

  const from = propFrom || "JFK";
  const to = propTo || "LHR";
  const depart = propDepart || "";
  const returnDate = propReturnDate || "";
  const adults = propAdults || "1";
  const children = propChildren || "0";
  const infants = propInfants || "0";
  const cabin = propCabin || "economy";

  const paxText = [
    `${adults} Adult${parseInt(adults) > 1 ? "s" : ""}`,
    ...(parseInt(children) > 0 ? [`${children} Child${parseInt(children) > 1 ? "ren" : ""}`] : []),
    ...(parseInt(infants) > 0 ? [`${infants} Infant${parseInt(infants) > 1 ? "s" : ""}`] : []),
  ].join(", ");

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/providers/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: from.toUpperCase(),
            destination: to.toUpperCase(),
            departDate: depart.split("T")[0],
            returnDate: returnDate ? returnDate.split("T")[0] : undefined,
            passengers: parseInt(adults) + parseInt(children) + parseInt(infants),
            cabinClass: cabin,
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch flights");
        const json = await res.json();
        setFlights(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (from && to && depart) fetchFlights();
    else setLoading(false);
  }, [from, to, depart, returnDate, adults, children, infants, cabin]);

  const isRoundTrip = !!(returnDate && returnDate !== "2024-02-20T00:00:00");

  const outboundFlights = useMemo(() => {
    return flights.filter((f) => f.origin === from.toUpperCase() && f.destination === to.toUpperCase());
  }, [flights, from, to]);

  const returnFlights = useMemo(() => {
    if (!isRoundTrip) return [];
    return flights.filter((f) => f.origin === to.toUpperCase() && f.destination === from.toUpperCase());
  }, [flights, from, to, isRoundTrip]);

  const sortFlights = (list: any[]) => {
    const f = [...list];
    switch (sortBy) {
      case "price-low":
        return f.sort((a, b) => a.price - b.price);
      case "price-high":
        return f.sort((a, b) => b.price - a.price);
      case "duration":
        return f.sort((a, b) => {
          const getMinutes = (d: string) => {
            const parts = d.match(/(\d+)h\s*(\d+)?m?/);
            if (!parts) return 0;
            return parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
          };
          return getMinutes(a.duration) - getMinutes(b.duration);
        });
      case "departure":
        return f.sort(
          (a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime()
        );
      default:
        return f;
    }
  };

  const sortedOutbound = useMemo(() => sortFlights(outboundFlights), [outboundFlights, sortBy]);
  const sortedReturn = useMemo(() => sortFlights(returnFlights), [returnFlights, sortBy]);

  const handleSelect = useCallback(
    (flight: any, leg: "outbound" | "return") => {
      const legKey = leg === "outbound" ? "selectedFlight" : "selectedReturnFlight";
      sessionStorage.setItem(legKey, JSON.stringify({ ...flight, leg }));

      const params = new URLSearchParams({
        from: from || "",
        to: to || "",
        depart: depart || "",
        return: returnDate || "",
        adults,
        children,
        infants,
        cabin,
        leg,
      });
      router.push(`/flights/checkout?${params.toString()}`);
    },
    [from, to, depart, returnDate, adults, children, infants, cabin, router]
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

  const flightCards = (flightsList: any[], leg: "outbound" | "return") =>
    flightsList.map((flight, i) => (
      <FlightCard
        key={flight.id}
        flight={flight}
        onSelect={(f: any) => handleSelect(f, leg)}
        onDetails={handleDetails}
        index={i}
      />
    ));

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
                {flights.length} flights
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {getDateDisplay(depart)}
              {isRoundTrip && returnDate && (
                <> <span className="text-slate-300 mx-1">–</span> {getDateDisplay(returnDate)}</>
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
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-red-200 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Search failed</h3>
            <p className="text-sm text-red-500 max-w-sm mx-auto">{error}</p>
          </motion.div>
        ) : flights.length === 0 ? (
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {from?.toUpperCase()} → {to?.toUpperCase()} <span className="text-xs text-slate-400 font-normal">Departure</span>
                </h3>
                <span className="text-xs text-slate-400">{getDateDisplay(depart)}</span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {sortedOutbound.length} flights
                </span>
              </div>
              <div className="space-y-3">
                {sortedOutbound.length > 0 ? flightCards(sortedOutbound, "outbound") : (
                  <p className="text-sm text-slate-400 py-4 text-center">No outbound flights found</p>
                )}
              </div>
            </div>
            {isRoundTrip && (
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-emerald-600 transform rotate-180" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {to?.toUpperCase()} → {from?.toUpperCase()} <span className="text-xs text-slate-400 font-normal">Return</span>
                  </h3>
                  <span className="text-xs text-slate-400">{getDateDisplay(returnDate)}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {sortedReturn.length} flights
                  </span>
                </div>
                <div className="space-y-3">
                  {sortedReturn.length > 0 ? flightCards(sortedReturn, "return") : (
                    <p className="text-sm text-slate-400 py-4 text-center">No return flights found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      <FlightDetailsModal
        flight={detailFlight}
        onClose={() => setDetailFlight(null)}
        onSelect={(f: any) => handleSelect(f, "outbound")}
      />
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchResults } from "@/components/flights/search-results";
import { SearchFilters } from "@/components/flights/search-filters";
import { MobileFiltersDrawer } from "@/components/flights/mobile-filters-drawer";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  ChevronDown,
  Search,
  ArrowRightLeft,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";

function SearchPageContent() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || searchParams.get("origin") || "JFK";
  const to = searchParams.get("to") || searchParams.get("destination") || "LHR";
  const depart = searchParams.get("depart") || searchParams.get("departure") || "";
  const returnDate = searchParams.get("return") || searchParams.get("returnDate") || "";
  const adults = searchParams.get("adults") || "1";
  const cabin = searchParams.get("cabin") || "economy";

  const getDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Sticky Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-sm">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">VerTravels</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/flights"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50"
            >
              Flights
            </Link>
            <Link
              href="/hotels"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hotels
            </Link>
            <Link
              href="/tours"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Tours
            </Link>
            <Link
              href="/cars"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cars
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              USD
              <ChevronDown className="w-3 h-3" />
            </button>
            <Link
              href="/login"
              className="h-9 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Compact Search Modification Bar */}
      <div className="sticky top-[72px] z-40 bg-[#F5F7FB] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 p-3 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 flex-1 min-w-[140px]">
                <Plane className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-900">{from?.toUpperCase()}</span>
              </div>
              <button className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 hover:bg-blue-100 transition-colors">
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              </button>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 flex-1 min-w-[140px]">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-900">{to?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 min-w-[120px]">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">{getDateDisplay(depart) || "Select date"}</span>
              </div>
              {returnDate && (
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 min-w-[120px]">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">{getDateDisplay(returnDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 min-w-[100px]">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">{adults} Adult{parseInt(adults) > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 rounded-xl px-3 py-2">
                <span className="text-sm font-medium text-slate-700 capitalize">{cabin}</span>
              </div>
            </div>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-10 px-6 shadow-sm flex-shrink-0">
              <Search className="w-4 h-4 mr-1.5" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-[160px] space-y-4">
              <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
                <SearchFilters />
              </Suspense>
            </div>
          </aside>

          <main className="flex-1 min-w-0 space-y-4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                      <div className="h-5 w-48 bg-slate-200 rounded mb-4" />
                      <div className="h-16 bg-slate-100 rounded-lg" />
                    </div>
                  ))}
                </div>
              }
            >
              <SearchResults onOpenFilters={() => setMobileFiltersOpen(true)} />
            </Suspense>
          </main>
        </div>
      </div>

      <MobileFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
}

export default function FlightsSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Plane className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-slate-500 text-sm">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

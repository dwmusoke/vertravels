"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { HotelCard } from "./hotel-card";
import { Skeleton } from "@/components/ui";
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Building2,
  Filter,
  SearchX,
  ChevronDown,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockHotels = [
  {
    id: "HTL001",
    name: "Grand Hôtel du Louvre",
    stars: 5,
    rating: 4.8,
    reviews: 1250,
    location: "1st Arrondissement, Paris",
    distance: "0.3 km from center",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ],
    price: 250,
    originalPrice: 320,
    currency: "USD",
    amenities: ["wifi", "breakfast", "parking", "gym", "pool", "spa"],
    tag: "Top Pick",
    available: true,
    roomType: "Deluxe Room",
    beds: "1 King Bed",
    cancellation: "Free cancellation",
    bookedToday: 18,
    roomsLeft: 3,
  },
  {
    id: "HTL002",
    name: "Hôtel Le Marais Charmant",
    stars: 4,
    rating: 4.5,
    reviews: 890,
    location: "Le Marais, Paris",
    distance: "1.2 km from center",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    price: 180,
    originalPrice: 220,
    currency: "USD",
    amenities: ["wifi", "breakfast", "gym"],
    tag: "Best Value",
    available: true,
    roomType: "Superior Room",
    beds: "1 Queen Bed",
    cancellation: "Free cancellation",
    bookedToday: 24,
    roomsLeft: 5,
  },
  {
    id: "HTL003",
    name: "Paris Boutique Hôtel Saint Germain",
    stars: 4,
    rating: 4.6,
    reviews: 650,
    location: "Latin Quarter, Paris",
    distance: "0.8 km from center",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    price: 200,
    currency: "USD",
    amenities: ["wifi", "breakfast", "parking", "pool"],
    tag: "Trending",
    available: true,
    roomType: "Junior Suite",
    beds: "1 King Bed",
    cancellation: "Free cancellation",
    bookedToday: 12,
    roomsLeft: 2,
  },
  {
    id: "HTL004",
    name: "Sofitel Paris Arc de Triomphe",
    stars: 5,
    rating: 4.7,
    reviews: 2100,
    location: "8th Arrondissement, Paris",
    distance: "0.5 km from center",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    price: 380,
    originalPrice: 450,
    currency: "USD",
    amenities: ["wifi", "breakfast", "gym", "spa", "pool", "restaurant"],
    tag: null,
    available: true,
    roomType: "Luxury Room",
    beds: "1 King Bed",
    cancellation: "Free cancellation",
    bookedToday: 8,
    roomsLeft: 1,
  },
  {
    id: "HTL005",
    name: "Citadines Saint-Germain-des-Prés",
    stars: 3,
    rating: 4.2,
    reviews: 430,
    location: "Saint-Germain, Paris",
    distance: "1.5 km from center",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f6678cb2cc0?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ],
    price: 120,
    currency: "USD",
    amenities: ["wifi", "breakfast"],
    tag: "Budget Friendly",
    available: true,
    roomType: "Studio",
    beds: "1 Double Bed",
    bookedToday: 32,
    roomsLeft: 8,
  },
  {
    id: "HTL006",
    name: "Resort & Spa Paris Marne-la-Vallée",
    stars: 4,
    rating: 4.4,
    reviews: 780,
    location: "Marne-la-Vallée, Paris",
    distance: "3.2 km from center",
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    price: 155,
    originalPrice: 190,
    currency: "USD",
    amenities: ["wifi", "pool", "spa", "restaurant", "shuttle"],
    tag: null,
    available: true,
    roomType: "Standard Room",
    beds: "2 Twin Beds",
    cancellation: "Free cancellation",
    bookedToday: 15,
    roomsLeft: 4,
  },
];

type SortOption = "recommended" | "price-low" | "price-high" | "rating" | "stars";

interface SearchResultsProps {
  onOpenFilters?: () => void;
}

export function SearchResults({ onOpenFilters }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const destination =
    searchParams.get("destination") || "Paris";
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const rooms = searchParams.get("rooms") || "1";
  const guests = searchParams.get("guests") || "2";

  const nights = useMemo(() => {
    if (checkin && checkout) {
      const d1 = new Date(checkin);
      const d2 = new Date(checkout);
      return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
    }
    return 3;
  }, [checkin, checkout]);

  const sortedHotels = useMemo(() => {
    const hotels = [...mockHotels];
    switch (sortBy) {
      case "price-low":
        return hotels.sort((a, b) => a.price - b.price);
      case "price-high":
        return hotels.sort((a, b) => b.price - a.price);
      case "rating":
        return hotels.sort((a, b) => b.rating - a.rating);
      case "stars":
        return hotels.sort((a, b) => b.stars - a.stars);
      default:
        return hotels;
    }
  }, [sortBy]);

  const handleSelect = useCallback(
    (hotel: any) => {
      sessionStorage.setItem(
        "selectedHotel",
        JSON.stringify({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          checkin: checkin || new Date().toISOString().split("T")[0],
          checkout:
            checkout ||
            new Date(Date.now() + nights * 86400000).toISOString().split("T")[0],
          rooms: parseInt(rooms),
          guests: parseInt(guests),
          pricePerNight: hotel.price,
          totalPrice: hotel.price * nights,
          currency: hotel.currency,
        })
      );
      router.push(
        `/hotels/checkout?destination=${destination}&checkin=${checkin || ""}&checkout=${checkout || ""}&rooms=${rooms}&guests=${guests}`
      );
    },
    [checkin, checkout, destination, rooms, guests, nights, router]
  );

  const handleDetails = useCallback(
    (hotel: any) => {
      sessionStorage.setItem(
        "selectedHotel",
        JSON.stringify({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          checkin: checkin || new Date().toISOString().split("T")[0],
          checkout:
            checkout ||
            new Date(Date.now() + nights * 86400000).toISOString().split("T")[0],
          rooms: parseInt(rooms),
          guests: parseInt(guests),
          pricePerNight: hotel.price,
          totalPrice: hotel.price * nights,
          currency: hotel.currency,
        })
      );
      router.push(
        `/hotels/checkout?destination=${destination}&checkin=${checkin || ""}&checkout=${checkout || ""}&rooms=${rooms}&guests=${guests}`
      );
    },
    [checkin, checkout, destination, rooms, guests, nights, router]
  );

  const sortOptions: { value: SortOption; label: string; icon: any }[] = [
    { value: "recommended", label: "Recommended", icon: Star },
    { value: "price-low", label: "Price (Low to High)", icon: DollarSign },
    { value: "price-high", label: "Price (High to Low)", icon: TrendingUp },
    { value: "rating", label: "Guest Rating", icon: Star },
    { value: "stars", label: "Star Rating", icon: Building2 },
  ];

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5.5 h-5.5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">
                  {destination}
                </h2>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {sortedHotels.length} properties
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {nights} nights
                <span className="mx-1.5">•</span>
                {guests} guests
                <span className="mx-1.5">•</span>
                {rooms} room{parseInt(rooms) > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex bg-slate-100 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={onOpenFilters}
              className="lg:hidden flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
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
                      <span className="hidden sm:inline">{active?.label}</span>
                      <span className="sm:hidden">Sort</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </>
                  );
                })()}
              </button>
              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortDropdown(false)}
                  />
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
                              ? "bg-emerald-50 text-emerald-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-emerald-600" : "text-slate-400"
                            }`}
                          />
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

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-48 shimmer-bg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 shimmer-bg rounded" />
                  <div className="h-3 w-1/2 shimmer-bg rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 shimmer-bg rounded" />
                    <div className="h-6 w-16 shimmer-bg rounded" />
                  </div>
                  <div className="h-6 w-1/3 shimmer-bg rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedHotels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No properties found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your filters or search criteria to find available
              hotels.
            </p>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setSortBy("recommended")}
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {sortedHotels.map((hotel, i) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                view="grid"
                onSelect={handleSelect}
                onDetails={handleDetails}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {sortedHotels.map((hotel, i) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                view="list"
                onSelect={handleSelect}
                onDetails={handleDetails}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-6 pb-4"
      >
        <Button
          variant="outline"
          className="min-w-[240px] rounded-xl border-slate-200 hover:border-emerald-300 text-slate-600 h-11"
        >
          Load More Properties
        </Button>
      </motion.div>
    </div>
  );
}

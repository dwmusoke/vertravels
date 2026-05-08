"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Star,
  MapPin,
  Heart,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Bus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  images: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  amenities: string[];
  tag?: string | null;
  available: boolean;
  beds?: string;
  roomType?: string;
  cancellation?: string;
  bookedToday?: number;
  roomsLeft?: number;
}

interface HotelCardProps {
  hotel: Hotel;
  view?: "grid" | "list";
  onSelect?: (hotel: Hotel) => void;
  onDetails?: (hotel: Hotel) => void;
  index?: number;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const amenityConfig: Record<string, { icon: any; label: string }> = {
  wifi: { icon: Wifi, label: "Free WiFi" },
  breakfast: { icon: Coffee, label: "Breakfast" },
  parking: { icon: Car, label: "Parking" },
  gym: { icon: Dumbbell, label: "Gym" },
  pool: { icon: Waves, label: "Pool" },
  spa: { icon: Sparkles, label: "Spa" },
  restaurant: { icon: UtensilsCrossed, label: "Restaurant" },
  shuttle: { icon: Bus, label: "Shuttle" },
};

export function HotelCard({
  hotel,
  view = "grid",
  onSelect,
  onDetails,
  index = 0,
  onFavorite,
  isFavorite,
}: HotelCardProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const [imgHover, setImgHover] = useState(false);
  const [faved, setFaved] = useState(isFavorite || false);

  const handleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFaved(!faved);
    onFavorite?.(hotel.id);
  }, [faved, hotel.id, onFavorite]);

  const gallery = hotel.images.length > 1;
  const discount = hotel.originalPrice
    ? Math.round((1 - hotel.price / hotel.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden ${
        view === "list" ? "flex flex-col md:flex-row" : ""
      }`}
    >
      {/* Image Section */}
      <div
        className={`relative overflow-hidden ${
          view === "list" ? "md:w-[280px] md:min-h-[240px] h-56" : "h-52"
        } flex-shrink-0`}
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        <img
          src={hotel.images[currentImg] || hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Gradient overlay for text readability on top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent h-1/2" />

        {/* Favorite Button */}
        <button
          onClick={handleFav}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-all ${
              faved ? "fill-red-500 text-red-500" : "text-slate-600"
            }`}
            strokeWidth={2}
          />
        </button>

        {/* Tag Badge */}
        {hotel.tag && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm z-10 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {hotel.tag}
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            -{discount}%
          </span>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg z-10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{hotel.rating}</span>
          <span className="text-[10px] text-white/70">
            ({hotel.reviews.toLocaleString()})
          </span>
        </div>

        {/* Gallery Arrows */}
        {gallery && imgHover && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImg((p) => (p === 0 ? hotel.images.length - 1 : p - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-sm z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-700" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImg((p) => (p === hotel.images.length - 1 ? 0 : p + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-sm z-10"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {gallery && (
          <div className="absolute bottom-3 right-3 flex gap-1 z-10">
            {hotel.images.slice(0, 4).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImg ? "bg-white w-3" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`flex flex-col flex-1 ${view === "list" ? "md:flex-row" : ""}`}>
        <div className={`p-4 ${view === "list" ? "md:flex-1 md:pr-3" : ""}`}>
          {/* Star Rating + Name */}
          <div className="flex items-center gap-1.5 mb-1">
            {Array.from({ length: hotel.stars }, (_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="text-[11px] text-slate-400 ml-0.5">
              {hotel.stars} Star
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-tight mb-0.5">
            {hotel.name}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {hotel.location}
            <span className="text-slate-300 mx-1">•</span>
            <span className="text-emerald-600">{hotel.distance}</span>
          </p>

          {/* Room Info */}
          {(hotel.roomType || hotel.beds) && (
            <p className="text-xs text-slate-500 mt-1.5">
              {hotel.roomType && <span className="font-medium text-slate-700">{hotel.roomType}</span>}
              {hotel.beds && <span>{hotel.roomType ? " • " : ""}{hotel.beds}</span>}
            </p>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 5).map((a) => {
              const am = amenityConfig[a];
              if (!am) return null;
              const Icon = am.icon;
              return (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 px-2 py-1 rounded-lg border border-slate-100"
                >
                  <Icon className="w-3 h-3 text-emerald-500" />
                  {am.label}
                </span>
              );
            })}
            {hotel.amenities.length > 5 && (
              <span className="text-[11px] text-slate-400 px-2 py-1">
                +{hotel.amenities.length - 5}
              </span>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {hotel.cancellation && (
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {hotel.cancellation}
              </span>
            )}
            {hotel.bookedToday && hotel.bookedToday > 10 && (
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Booked {hotel.bookedToday} times today
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div
          className={`${
            view === "list"
              ? "md:w-[200px] md:border-l md:border-slate-100 md:p-4 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center border-t border-slate-100 px-4 py-3"
              : "border-t border-slate-100 px-4 py-3 flex items-center justify-between"
          }`}
        >
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
              {view === "list" ? "Total" : "Per night"}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-emerald-600">
                {hotel.currency === "USD" ? "$" : hotel.currency}
                {hotel.price.toLocaleString()}
              </span>
              {hotel.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {hotel.currency === "USD" ? "$" : hotel.currency}
                  {hotel.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              + taxes & fees
            </p>
          </div>

          <div className="flex gap-2">
            {view === "grid" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDetails?.(hotel)}
                className="rounded-lg border-slate-200 hover:border-emerald-300 text-slate-600 text-xs h-9 px-3"
              >
                Details
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onSelect?.(hotel)}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs h-9 px-4 shadow-sm"
            >
              {view === "list" ? "Book Now" : "Book"}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedHotel {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  amenities: string[];
  tag: string | null;
}

interface HotelCarouselProps {
  hotels: FeaturedHotel[];
}

export function HotelCarousel({ hotels }: HotelCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg flex items-center justify-center hover:bg-white transition-all hidden lg:flex"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg flex items-center justify-center hover:bg-white transition-all hidden lg:flex"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hotels.map((hotel, i) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="min-w-[300px] md:min-w-[320px] snap-start"
          >
            <Link
              href="/hotels/search"
              className="block group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {hotel.tag && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {hotel.tag}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-white/70">
                    ({hotel.reviews})
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {hotel.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mt-2.5">
                  {hotel.amenities.slice(0, 3).map((a, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <p className="text-xl font-bold text-emerald-600">
                    ${hotel.price}
                  </p>
                  <p className="text-xs text-slate-400 line-through">
                    ${hotel.originalPrice}
                  </p>
                  <p className="text-[10px] text-slate-400">/night</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

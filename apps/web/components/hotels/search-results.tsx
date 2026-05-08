"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Hotel, Star, MapPin, Wifi, Coffee, Car, Dumbbell, Wind,
  ArrowRight, Sparkles, CheckCircle, Users, Calendar,
} from "lucide-react";

const mockHotels = [
  {
    id: "HTL001",
    name: "Grand Hotel Paris",
    stars: 5,
    rating: 4.8,
    reviews: 1250,
    location: "1st Arrondissement, Paris",
    distance: "0.5 km from center",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 250,
    currency: "USD",
    amenities: ["wifi", "breakfast", "parking", "gym"],
    available: true,
    tag: "Top Pick",
  },
  {
    id: "HTL002",
    name: "Hotel Le Marais",
    stars: 4,
    rating: 4.5,
    reviews: 890,
    location: "Le Marais, Paris",
    distance: "1.2 km from center",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    price: 180,
    currency: "USD",
    amenities: ["wifi", "breakfast"],
    available: true,
    tag: null,
  },
  {
    id: "HTL003",
    name: "Paris Boutique Hotel",
    stars: 4,
    rating: 4.6,
    reviews: 650,
    location: "Latin Quarter, Paris",
    distance: "0.8 km from center",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 200,
    currency: "USD",
    amenities: ["wifi", "gym", "breakfast"],
    available: true,
    tag: "Best Value",
  },
];

const amenityIcons: Record<string, { icon: any; label: string }> = {
  wifi: { icon: Wifi, label: "Free WiFi" },
  breakfast: { icon: Coffee, label: "Breakfast" },
  parking: { icon: Car, label: "Parking" },
  gym: { icon: Dumbbell, label: "Gym" },
  pool: { icon: Wind, label: "Pool" },
};

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams.get("destination");

  const handleSelect = (hotel: any) => {
    sessionStorage.setItem(
      "selectedHotel",
      JSON.stringify({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        checkin: searchParams.get("checkin") || new Date().toISOString().split("T")[0],
        checkout: searchParams.get("checkout") || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rooms: parseInt(searchParams.get("rooms") || "1"),
        guests: parseInt(searchParams.get("guests") || "2"),
        pricePerNight: hotel.price,
        totalPrice: hotel.price * 3,
        currency: hotel.currency,
      }),
    );
    router.push(
      `/hotels/checkout?destination=${destination}&checkin=${searchParams.get("checkin") || ""}&checkout=${searchParams.get("checkout") || ""}&rooms=${searchParams.get("rooms") || 1}&guests=${searchParams.get("guests") || 2}`,
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
              <Hotel className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{destination || "Hotels"}</h2>
              <p className="text-sm text-gray-500">3 nights &bull; 2 guests</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">{mockHotels.length}</p>
            <p className="text-sm text-gray-500">properties found</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5">
        {mockHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Image */}
                <div className="md:col-span-4 relative h-56 md:h-full min-h-[200px] overflow-hidden group">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                  {hotel.tag && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {hotel.tag}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.distance}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {/* Use a unique key without index */}
                            {Array.from({ length: hotel.stars }, (_, i) => (
                              <Star key={`${hotel.id}-star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{hotel.stars} Star</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                        <span>{hotel.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({hotel.reviews.toLocaleString()} reviews)</span>
                      <span className="text-xs text-emerald-600 flex items-center gap-0.5 ml-auto">
                        <CheckCircle className="w-3 h-3" /> Available
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {hotel.amenities.map((a) => {
                        const am = amenityIcons[a];
                        if (!am) return null;
                        const Icon = am.icon;
                        return (
                          <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-100">
                            <Icon className="w-3.5 h-3.5 text-emerald-500" />
                            {am.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Price & Booking */}
                <div className="md:col-span-3 p-6 bg-gray-50/50 border-l border-gray-100 flex flex-col justify-between">
                  <div className="text-right mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Starting from</p>
                    <p className="text-3xl font-bold text-emerald-600">${hotel.price}</p>
                    <p className="text-xs text-gray-400">per night</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>3 nights: <strong className="text-gray-700">${hotel.price * 3}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                      <Users className="w-3 h-3" />
                      <span>2 guests, 1 room</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelect(hotel)}
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2.5"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <p className="text-xs text-center text-gray-400 mt-2">Free cancellation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

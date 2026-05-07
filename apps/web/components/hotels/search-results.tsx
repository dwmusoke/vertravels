"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui";
import { Hotel, Star, MapPin, Wifi, Coffee, Car, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";

const mockHotels = [
  {
    id: "HTL001",
    name: "Grand Hotel Paris",
    stars: 5,
    rating: 4.8,
    reviews: 1250,
    location: "1st Arrondissement, Paris",
    distance: "0.5 km from center",
    image: "/hotels/hotel1.jpg",
    price: 250,
    currency: "USD",
    amenities: ["wifi", "breakfast", "parking", "gym"],
    available: true,
  },
  {
    id: "HTL002",
    name: "Hotel Le Marais",
    stars: 4,
    rating: 4.5,
    reviews: 890,
    location: "Le Marais, Paris",
    distance: "1.2 km from center",
    image: "/hotels/hotel2.jpg",
    price: 180,
    currency: "USD",
    amenities: ["wifi", "breakfast"],
    available: true,
  },
  {
    id: "HTL003",
    name: "Paris Boutique Hotel",
    stars: 4,
    rating: 4.6,
    reviews: 650,
    location: "Latin Quarter, Paris",
    distance: "0.8 km from center",
    image: "/hotels/hotel3.jpg",
    price: 200,
    currency: "USD",
    amenities: ["wifi", "gym", "breakfast"],
    available: true,
  },
];

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
        checkin:
          searchParams.get("checkin") || new Date().toISOString().split("T")[0],
        checkout:
          searchParams.get("checkout") ||
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
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
    <div className="space-y-4">
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{destination}</h2>
            <p className="text-sm text-muted-foreground">3 nights • 2 guests</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockHotels.length}</p>
            <p className="text-sm text-muted-foreground">properties found</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image */}
                <div className="h-48 md:h-full bg-muted rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Hotel className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(hotel.stars)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-500 text-yellow-500"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {hotel.rating} ({hotel.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <Badge variant="success">Available</Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.location}</span>
                      <span>•</span>
                      <span>{hotel.distance}</span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {hotel.amenities.includes("wifi") && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Wifi className="h-4 w-4" />
                          <span>WiFi</span>
                        </div>
                      )}
                      {hotel.amenities.includes("breakfast") && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Coffee className="h-4 w-4" />
                          <span>Breakfast</span>
                        </div>
                      )}
                      {hotel.amenities.includes("parking") && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Car className="h-4 w-4" />
                          <span>Parking</span>
                        </div>
                      )}
                      {hotel.amenities.includes("gym") && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Dumbbell className="h-4 w-4" />
                          <span>Gym</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        ${hotel.price}
                      </p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                    <Button onClick={() => handleSelect(hotel)}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Map, Clock, Star, Calendar, Users, ArrowRight } from "lucide-react";

const mockTours = [
  {
    id: "TR001",
    name: "Paris City Highlights",
    location: "Paris, France",
    duration: "Full Day",
    price: 150,
    currency: "USD",
    rating: 4.8,
    reviews: 520,
    available: true,
  },
  {
    id: "TR002",
    name: "Eiffel Tower & Louvre",
    location: "Paris, France",
    duration: "Half Day",
    price: 89,
    currency: "USD",
    rating: 4.6,
    reviews: 380,
    available: true,
  },
  {
    id: "TR003",
    name: "Versailles Palace Day Trip",
    location: "Versailles, France",
    duration: "Full Day",
    price: 199,
    currency: "USD",
    rating: 4.9,
    reviews: 650,
    available: true,
  },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams.get("destination");

  const handleSelect = (tour: any) => {
    sessionStorage.setItem(
      "selectedTour",
      JSON.stringify({
        id: tour.id,
        name: tour.name,
        location: tour.location,
        duration: tour.duration,
        date:
          searchParams.get("date") || new Date().toISOString().split("T")[0],
        guests: parseInt(searchParams.get("guests") || "1"),
        price: tour.price,
        currency: tour.currency,
      }),
    );
    router.push(
      `/tours/checkout?destination=${destination}&date=${searchParams.get("date") || ""}&guests=${searchParams.get("guests") || 1}`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {destination || "All Tours"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchParams.get("date") || "Flexible date"} •{" "}
              {searchParams.get("guests") || 1} guest(s)
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockTours.length}</p>
            <p className="text-sm text-muted-foreground">tours found</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockTours.map((tour) => (
          <Card key={tour.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-48 md:h-full bg-amber-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Map className="h-16 w-16 text-amber-600" />
                  </div>
                </div>

                <div className="md:col-span-2 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{tour.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm">{tour.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({tour.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <Badge variant="success">Available</Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <Map className="h-4 w-4" />
                      <span>{tour.location}</span>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Small group</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        ${tour.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per person
                      </p>
                    </div>
                    <Button onClick={() => handleSelect(tour)}>
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1" />
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

export default function ToursSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-yellow-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Tour Search Results</h1>
          <p className="mt-2 opacity-90">
            Discover amazing experiences and activities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <p className="text-sm text-muted-foreground">
                Tour filters coming soon...
              </p>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <Suspense fallback={<div>Loading tours...</div>}>
              <SearchResults />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

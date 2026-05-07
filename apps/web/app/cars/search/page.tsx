"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Car as CarIcon, Users, Fuel, Star, ArrowRight } from "lucide-react";

const mockCars = [
  {
    id: "CAR001",
    name: "Toyota Corolla",
    type: "Compact",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 45,
    currency: "USD",
    available: true,
  },
  {
    id: "CAR002",
    name: "Honda CR-V",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 75,
    currency: "USD",
    available: true,
  },
  {
    id: "CAR003",
    name: "Tesla Model 3",
    type: "Electric",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    pricePerDay: 120,
    currency: "USD",
    available: true,
  },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const location = searchParams.get("location");

  const handleSelect = (car: any) => {
    sessionStorage.setItem(
      "selectedCar",
      JSON.stringify({
        id: car.id,
        name: car.name,
        type: car.type,
        location: location || "Airport",
        pickupDate:
          searchParams.get("pickup") || new Date().toISOString().split("T")[0],
        dropoffDate:
          searchParams.get("dropoff") ||
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        pricePerDay: car.pricePerDay,
        totalPrice: car.pricePerDay * 3,
        currency: car.currency,
      }),
    );
    router.push(
      `/cars/checkout?location=${location}&pickup=${searchParams.get("pickup") || ""}&dropoff=${searchParams.get("dropoff") || ""}`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {location || "All Locations"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchParams.get("pickup") || "Flexible"} to{" "}
              {searchParams.get("dropoff") || "Flexible"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockCars.length}</p>
            <p className="text-sm text-muted-foreground">cars available</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockCars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-48 md:h-full bg-blue-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <CarIcon className="h-16 w-16 text-blue-600" />
                  </div>
                </div>

                <div className="md:col-span-2 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{car.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {car.type}
                        </p>
                      </div>
                      <Badge variant="success">Available</Badge>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{car.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CarIcon className="h-4 w-4" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Fuel className="h-4 w-4" />
                        <span>{car.fuel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        ${car.pricePerDay}
                      </p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                    <Button onClick={() => handleSelect(car)}>
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

export default function CarsSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Car Rental Search Results</h1>
          <p className="mt-2 opacity-90">
            Find the perfect vehicle for your journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <p className="text-sm text-muted-foreground">
                Car rental filters coming soon...
              </p>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <Suspense fallback={<div>Loading cars...</div>}>
              <SearchResults />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

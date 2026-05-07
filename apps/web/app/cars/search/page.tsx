"use client";

import Link from "next/link";
import {
  Car as CarIcon,
  ArrowLeft,
  Home,
  Plane,
  Hotel,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Clock, MapPin as PinIcon, ArrowRight, Users } from "lucide-react";

const mockCars = [
  {
    id: "CAR001",
    name: "Toyota Corolla",
    type: "Compact",
    seats: 5,
    price: 45,
    image: "🚗",
    tag: "Popular",
  },
  {
    id: "CAR002",
    name: "Honda CR-V",
    type: "SUV",
    seats: 5,
    price: 75,
    image: "🚙",
    tag: null,
  },
  {
    id: "CAR003",
    name: "Tesla Model 3",
    type: "Electric",
    seats: 5,
    price: 120,
    image: "⚡",
    tag: "Top Rated",
  },
  {
    id: "CAR004",
    name: "Toyota Prado",
    type: "4x4",
    seats: 7,
    price: 95,
    image: "🚙",
    tag: "Best Seller",
  },
];

export default function CarsSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <CarIcon className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">VerTravels</span>
          </Link>
          <Link href="/login" className="text-gray-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-700 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-8xl">🚗</div>
          <div className="absolute top-10 right-20 text-7xl">🚙</div>
          <div className="absolute bottom-4 left-1/3 text-8xl">🛻</div>
          <div className="absolute bottom-10 right-1/4 text-7xl">🚐</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cars
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Car Rental Results
          </h1>
          <p className="text-white/80 text-lg">
            Find the perfect vehicle for your journey
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center gap-6">
          <Link
            href="/flights"
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
          >
            <Plane className="w-4 h-4" /> Flights
          </Link>
          <Link
            href="/hotels"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Hotel className="w-4 h-4" /> Hotels
          </Link>
          <Link
            href="/tours"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <MapPin className="w-4 h-4" /> Tours
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <CarIcon className="w-4 h-4" /> Cars
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {mockCars.map((car) => (
            <Card
              key={car.id}
              className="overflow-hidden hover:shadow-xl transition"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 h-40 md:h-auto bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center">
                    <span className="text-7xl">{car.image}</span>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-purple-100 text-purple-700 mb-2">
                          {car.type}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900">
                          {car.name}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" /> {car.seats} seats
                        </p>
                      </div>
                      {car.tag && (
                        <Badge className="bg-purple-500 text-white">
                          {car.tag}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t">
                      <div>
                        <p className="text-3xl font-bold text-purple-600">
                          ${car.price}
                        </p>
                        <p className="text-xs text-gray-500">per day</p>
                      </div>
                      <Link href={`/cars/checkout?car=${car.id}`}>
                        <Button>
                          Book Now <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

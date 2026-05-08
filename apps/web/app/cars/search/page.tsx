"use client";

import Link from "next/link";
import {
  Car as CarIcon,
  ArrowLeft,
  Home,
  Plane,
  Hotel,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Fuel,
  Snowflake,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";

const mockCars = [
  {
    id: "CAR001",
    name: "Toyota Corolla",
    type: "Compact",
    seats: 5,
    price: 45,
    image: "https://images.unsplash.com/photo-1590362891991-f7204c847022?w=800&q=80",
    tag: "Popular",
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: "CAR002",
    name: "Honda CR-V",
    type: "SUV",
    seats: 5,
    price: 75,
    image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80",
    tag: null,
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: "CAR003",
    name: "Tesla Model 3",
    type: "Electric",
    seats: 5,
    price: 120,
    image: "https://images.unsplash.com/photo-1560958089-b8a192988883?w=800&q=80",
    tag: "Top Rated",
    fuel: "Electric",
    transmission: "Automatic",
  },
  {
    id: "CAR004",
    name: "Toyota Land Cruiser Prado",
    type: "4x4",
    seats: 7,
    price: 95,
    image: "https://images.unsplash.com/photo-1594502184392-28b3d22a6d43?w=800&q=80",
    tag: null,
    fuel: "Diesel",
    transmission: "Automatic",
  },
];

export default function CarsSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VerTravels</span>
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-8xl">🚗</div>
          <div className="absolute top-10 right-20 text-7xl">🚙</div>
          <div className="absolute bottom-4 left-1/3 text-8xl">🛻</div>
          <div className="absolute bottom-10 right-1/4 text-7xl">🚐</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link href="/cars" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Cars
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Car Rentals</h1>
          <p className="text-white/80 text-lg">Find the perfect vehicle for your journey</p>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-6 text-sm">
          <Link href="/flights" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"><Plane className="w-4 h-4" /> Flights</Link>
          <Link href="/hotels" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"><Hotel className="w-4 h-4" /> Hotels</Link>
          <Link href="/tours" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"><MapPin className="w-4 h-4" /> Tours</Link>
          <Link href="/cars" className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"><CarIcon className="w-4 h-4" /> Cars</Link>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"><Home className="w-4 h-4" /> Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-5">
          {mockCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-xl transition-all rounded-2xl border border-gray-100">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-12 gap-0">
                  <div className="md:col-span-4 relative h-52 md:h-full min-h-[200px] overflow-hidden group">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                    {car.tag && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {car.tag}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-lg">
                          <CarIcon className="w-3 h-3" />
                          {car.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Users className="w-3.5 h-3.5 text-violet-500" />
                        {car.seats} seats
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Fuel className="w-3.5 h-3.5 text-violet-500" />
                        {car.fuel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Settings className="w-3.5 h-3.5 text-violet-500" />
                        {car.transmission}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Shield className="w-3.5 h-3.5 text-green-500" />
                        Free cancellation
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-6 bg-gray-50/50 border-l border-gray-100 flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Starting from</p>
                      <p className="text-3xl font-bold text-violet-600">${car.price}</p>
                      <p className="text-xs text-gray-400">per day</p>
                    </div>
                    <Link href={`/cars/checkout?car=${car.id}`}>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-2.5">
                        Book Now <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
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

"use client";

import Link from "next/link";
import {
  Map as MapIcon,
  ArrowLeft,
  Home,
  Plane,
  Hotel,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Clock, Star, MapPin, ArrowRight } from "lucide-react";

const mockTours = [
  {
    id: "TR001",
    name: "Gorilla Trekking Adventure",
    location: "Bwindi Forest",
    duration: "2 Days",
    price: 890,
    rating: 4.9,
    reviews: 328,
    image: "🦍",
    tag: "Best Seller",
  },
  {
    id: "TR002",
    name: "Murchison Falls Safari",
    location: "Murchison Falls",
    duration: "3 Days",
    price: 1250,
    rating: 4.8,
    reviews: 256,
    image: "🦁",
    tag: "Popular",
  },
  {
    id: "TR003",
    name: "Source of Nile Tour",
    location: "Jinja",
    duration: "1 Day",
    price: 150,
    rating: 4.7,
    reviews: 189,
    image: "⛵",
    tag: "Top Rated",
  },
  {
    id: "TR004",
    name: "Kampala City Tour",
    location: "Kampala",
    duration: "Half Day",
    price: 80,
    rating: 4.5,
    reviews: 145,
    image: "🏙️",
    tag: null,
  },
];

export default function ToursSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <MapIcon className="w-8 h-8 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">VerTravels</span>
          </Link>
          <Link href="/login" className="text-gray-600">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-700 via-orange-600 to-rose-700 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-8xl">🦁</div>
          <div className="absolute top-10 right-20 text-7xl">🐘</div>
          <div className="absolute bottom-4 left-1/3 text-8xl">🦍</div>
          <div className="absolute bottom-10 right-1/4 text-7xl">🦓</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tours
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Tour Search Results
          </h1>
          <p className="text-white/80 text-lg">
            Discover amazing experiences and activities
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
            <MapIcon className="w-4 h-4" /> Tours
          </Link>
          <Link
            href="/cars"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Car className="w-4 h-4" /> Cars
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
          {mockTours.map((tour) => (
            <Card
              key={tour.id}
              className="overflow-hidden hover:shadow-xl transition"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 h-40 md:h-auto bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center">
                    <span className="text-7xl">{tour.image}</span>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {tour.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({tour.reviews} reviews)
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {tour.name}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" /> {tour.location}
                        </p>
                      </div>
                      {tour.tag && (
                        <Badge className="bg-amber-500 text-white">
                          {tour.tag}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {tour.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t">
                      <div>
                        <p className="text-3xl font-bold text-amber-600">
                          ${tour.price}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <Link href={`/tours/checkout?tour=${tour.id}`}>
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

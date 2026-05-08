"use client";

import Link from "next/link";
import {
  Map as MapIcon,
  ArrowLeft,
  Home,
  Plane,
  Hotel,
  Car,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";

const mockTours = [
  {
    id: "TR001",
    name: "Bwindi Gorilla Trekking",
    location: "Bwindi Forest",
    duration: "2 Days",
    price: 890,
    rating: 4.9,
    reviews: 328,
    image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1568379697888-3c5a06e8602f?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1557142046-c704a3aec804?w=800&q=80",
    tag: null,
  },
];

export default function ToursSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-600 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <MapIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VerTravels</span>
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 via-orange-600/85 to-rose-700/90" />
        </div>
        <div className="absolute top-10 -left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-5 -right-16 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link href="/tours" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Tours
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Tours & Safaris</h1>
          <p className="text-white/80 text-lg">Discover amazing experiences across East Africa</p>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-6 text-sm">
          <Link href="/flights" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"><Plane className="w-4 h-4" /> Flights</Link>
          <Link href="/hotels" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"><Hotel className="w-4 h-4" /> Hotels</Link>
          <Link href="/tours" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"><MapIcon className="w-4 h-4" /> Tours</Link>
          <Link href="/cars" className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"><Car className="w-4 h-4" /> Cars</Link>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"><Home className="w-4 h-4" /> Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-5">
          {mockTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-all rounded-2xl border border-gray-100">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-12 gap-0">
                  <div className="md:col-span-4 relative h-52 md:h-full min-h-[200px] overflow-hidden group">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                    {tour.tag && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {tour.tag}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tour.duration}
                    </div>
                  </div>

                  <div className="md:col-span-5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{tour.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">({tour.reviews.toLocaleString()} reviews)</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{tour.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {tour.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> {tour.duration}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Shield className="w-3.5 h-3.5 text-green-500" /> Free cancellation
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-6 bg-gray-50/50 border-l border-gray-100 flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Starting from</p>
                      <p className="text-3xl font-bold text-amber-600">${tour.price}</p>
                      <p className="text-xs text-gray-400">per person</p>
                    </div>
                    <Link href={`/tours/checkout?tour=${tour.id}`}>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2.5">
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

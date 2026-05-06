import { Button } from "@/components/ui";
import { Plane, Hotel, MapPin, Car } from "lucide-react";
import React from "react";

export function HeroSection({ children }: { children?: React.ReactNode }) {
  return (
    <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Book flights, hotels, tours, and cars all in one place. Best prices
          guaranteed.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white hover:bg-white/20 transition">
            <Plane className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold">Flights</h3>
            <p className="text-sm text-blue-100 mt-1">400+ Airlines</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white hover:bg-white/20 transition">
            <Hotel className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold">Hotels</h3>
            <p className="text-sm text-blue-100 mt-1">2M+ Properties</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white hover:bg-white/20 transition">
            <MapPin className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold">Tours</h3>
            <p className="text-sm text-blue-100 mt-1">50K+ Activities</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white hover:bg-white/20 transition">
            <Car className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold">Cars</h3>
            <p className="text-sm text-blue-100 mt-1">Worldwide Coverage</p>
          </div>
        </div>

        <div className="mt-8">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Start Exploring
          </Button>
        </div>
      </div>
    </section>
  );
}

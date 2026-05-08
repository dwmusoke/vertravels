"use client";

import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plane, Clock, Zap, Shield, ArrowRight, Star, MapPin, Users, Luggage } from "lucide-react";
import { format } from "date-fns";

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  stopover?: string;
  price: number;
  currency: string;
  cabinClass: string;
  available: boolean;
}

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  onDetails?: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect, onDetails }: FlightCardProps) {
  const departureTime = new Date(flight.departure);
  const arrivalTime = new Date(flight.arrival);

  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-100 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm">
                {flight.airlineCode ? (
                  <img
                    src={`https://content.airhex.com/airline-logos/${flight.airlineCode}_square.png`}
                    alt={flight.airline}
                    className="h-10 w-10 object-contain p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDI4NGM3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIgMTJoMjAiLz48cGF0aCBkPSJNMjAgMTJ2LTZhMiAyIDAgMCAwLTItMmgtNmwtMi0yaC00YTIgMiAwIDAgMC0yIDJ2NmgtMnY2aDJ2NmEyIDIgMCAwIDAgMiAyaDRsMi0yaDZhMiAyIDAgMCAwIDItMnYtNnoiLz48L3N2Zz4=';
                    }}
                  />
                ) : (
                  <Plane className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{flight.airline}</p>
                <p className="text-xs text-gray-400">{flight.flightNumber}</p>
              </div>
            </div>
            <Badge
              variant={flight.cabinClass === "business" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {flight.cabinClass === "economy" && "Economy"}
              {flight.cabinClass === "premium" && "Premium"}
              {flight.cabinClass === "business" && "Business"}
              {flight.cabinClass === "first" && "First"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 py-4">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-900">{flight.origin}</p>
              <p className="text-sm text-gray-500">{format(departureTime, "h:mm a")}</p>
              <p className="text-xs text-gray-400">{format(departureTime, "MMM dd")}</p>
            </div>

            <div className="flex-1 px-2">
              <div className="relative">
                <div className="border-t-2 border-dashed border-gray-300" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-1">
                {flight.duration}
                {flight.stops === 0
                  ? " \u2022 Non-stop"
                  : ` \u2022 ${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                {flight.stopover && ` (${flight.stopover})`}
              </p>
            </div>

            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-900">{flight.destination}</p>
              <p className="text-sm text-gray-500">{format(arrivalTime, "h:mm a")}</p>
              <p className="text-xs text-gray-400">{format(arrivalTime, "MMM dd")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-400">from</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-blue-600">${flight.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">/person</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDetails?.(flight)}
                className="rounded-xl border-gray-200 hover:border-blue-300"
              >
                <Zap className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button
                size="sm"
                onClick={() => onSelect?.(flight)}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                Select
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-5 py-2.5 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Free cancellation</span>
          <span className="flex items-center gap-1"><Luggage className="w-3 h-3" /> Baggage included</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3" /> 4.2 rating</span>
        </div>
      </CardContent>
    </Card>
  );
}

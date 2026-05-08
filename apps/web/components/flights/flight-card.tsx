"use client";

import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { FlightTimeline } from "./flight-timeline";
import {
  Luggage,
  Armchair,
  Wifi,
  ArrowRight,
  Star,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
  index?: number;
}

export function FlightCard({ flight, onSelect, onDetails, index = 0 }: FlightCardProps) {
  const departureTime = new Date(flight.departure);
  const arrivalTime = new Date(flight.arrival);
  const isRefundable = flight.cabinClass !== "economy";
  const isBusinessOrFirst = flight.cabinClass === "business" || flight.cabinClass === "first";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
    >
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm flex-shrink-0">
              {flight.airlineCode ? (
                <img
                  src={`https://img.airlinesdata.com/airline/${flight.airlineCode}.png`}
                  alt={flight.airline}
                  className="h-9 w-9 object-contain p-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = '1';
                      target.src = `https://content.airhex.com/airline-logos/${flight.airlineCode}_square.png`;
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                />
              ) : null}
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{flight.airline}</p>
              <p className="text-xs text-slate-400">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRefundable && (
              <Badge variant="success" className="text-[10px] px-2 py-0.5 font-medium">
                Refundable
              </Badge>
            )}
            <Badge
              variant={isBusinessOrFirst ? "default" : "secondary"}
              className="text-[10px] px-2 py-0.5 font-medium capitalize"
            >
              {flight.cabinClass}
            </Badge>
          </div>
        </div>

        <FlightTimeline
          departureTime={format(departureTime, "h:mm a")}
          departureCode={flight.origin}
          departureDate={format(departureTime, "MMM dd")}
          arrivalTime={format(arrivalTime, "h:mm a")}
          arrivalCode={flight.destination}
          arrivalDate={format(arrivalTime, "MMM dd")}
          duration={flight.duration}
          stops={flight.stops}
          stopover={flight.stopover}
        />

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Luggage className="w-3.5 h-3.5 text-slate-400" />
            <span>Baggage incl.</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Armchair className="w-3.5 h-3.5 text-slate-400" />
            <span>Seat selection</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <span>Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span>Free cancellation</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-600">4.2</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl">
        <div>
          <p className="text-xs text-slate-400 font-medium">from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600">
              {flight.currency === "USD" ? "$" : flight.currency}{flight.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/person</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDetails?.(flight)}
            className="rounded-xl border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 text-xs h-9 px-4"
          >
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => onSelect?.(flight)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-xs h-9 px-5 shadow-sm"
          >
            Select
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

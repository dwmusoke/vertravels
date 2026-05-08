"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { AirlineLogo } from "./airline-logo";
import {
  X,
  Plane,
  Clock,
  Luggage,
  Armchair,
  Wifi,
  Shield,
  Star,
  Calendar,
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Timer,
  AlertCircle,
  UtensilsCrossed,
  Film,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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

interface FlightDetailsModalProps {
  flight: Flight | null;
  onClose: () => void;
  onSelect: (flight: Flight) => void;
}

export function FlightDetailsModal({ flight, onClose, onSelect }: FlightDetailsModalProps) {
  useEffect(() => {
    if (flight) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [flight]);

  if (!flight) return null;

  const departureTime = new Date(flight.departure);
  const arrivalTime = new Date(flight.arrival);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden border border-blue-100">
                <AirlineLogo code={flight.airlineCode} name={flight.airline} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{flight.airline}</p>
                <p className="text-xs text-slate-400">{flight.flightNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Route */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-slate-900">{format(departureTime, "h:mm a")}</p>
                  <p className="text-sm font-semibold text-blue-600">{flight.origin}</p>
                  <p className="text-xs text-slate-400">{format(departureTime, "EEE, MMM dd")}</p>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">{flight.duration}</p>
                  <div className="relative w-full flex items-center">
                    <div className="absolute left-0 right-0 h-px bg-slate-300" style={{
                      background: 'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 4px, transparent 4px, transparent 8px)'
                    }} />
                    <div className="relative z-10 mx-auto bg-white border-2 border-blue-500 rounded-full p-1">
                      <Plane className="w-3.5 h-3.5 text-blue-600 rotate-90" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">
                    {flight.stops === 0 ? (
                      <span className="text-emerald-600 font-semibold">Non-stop</span>
                    ) : (
                      <span>{flight.stops} stop{flight.stops > 1 ? "s" : ""}{flight.stopover ? ` • ${flight.stopover}` : ""}</span>
                    )}
                  </p>
                </div>

                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-slate-900">{format(arrivalTime, "h:mm a")}</p>
                  <p className="text-sm font-semibold text-blue-600">{flight.destination}</p>
                  <p className="text-xs text-slate-400">{format(arrivalTime, "EEE, MMM dd")}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-blue-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Depart: {format(departureTime, "MMM dd")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Arrive: {format(arrivalTime, "MMM dd")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Timer className="w-3.5 h-3.5 text-blue-400" />
                  <span>{flight.duration}</span>
                </div>
              </div>
            </div>

            {/* Cabin & Fare Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Cabin</p>
                <Badge variant={flight.cabinClass === "business" || flight.cabinClass === "first" ? "default" : "secondary"} className="mt-1 capitalize text-xs">
                  {flight.cabinClass}
                </Badge>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Baggage</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">2 × 23kg</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Cabin Bag</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">1 × 7kg</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Seat</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">Adv. seat</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Flight Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { icon: Wifi, label: "In-flight WiFi" },
                  { icon: UtensilsCrossed, label: "Meals included" },
                  { icon: Film, label: "Entertainment" },
                  { icon: Armchair, label: "Seat selection" },
                  { icon: Luggage, label: "Baggage incl." },
                  { icon: Shield, label: "Free cancellation" },
                  { icon: Clock, label: "On-time 92%" },
                  { icon: Star, label: "4.2 rating" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                      <Icon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fare Rules */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Fare Rules</h4>
              <div className="space-y-2">
                {[
                  { label: "Changes", value: "Permitted with fee", color: "text-amber-600" },
                  { label: "Cancellation", value: "Non-refundable", color: "text-rose-600" },
                  { label: "Baggage", value: "2 pieces included", color: "text-emerald-600" },
                  { label: "Seat selection", value: "Charges apply", color: "text-slate-600" },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{rule.label}</span>
                    <span className={`text-sm font-medium ${rule.color}`}>{rule.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total for 1 passenger</p>
                  <p className="text-3xl font-bold mt-0.5">
                    {flight.currency === "USD" ? "$" : flight.currency}{flight.price.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">Includes taxes & fees</p>
                </div>
                <Button
                  onClick={() => { onSelect(flight); onClose(); }}
                  className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl px-6 h-11 font-semibold shadow-sm"
                >
                  Select
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

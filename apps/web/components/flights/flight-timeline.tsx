"use client";

import { Plane } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlightTimelineProps {
  departureTime: string;
  departureCode: string;
  departureDate: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalDate: string;
  duration: string;
  stops: number;
  stopover?: string;
}

export function FlightTimeline({
  departureTime,
  departureCode,
  departureDate,
  arrivalTime,
  arrivalCode,
  arrivalDate,
  duration,
  stops,
  stopover,
}: FlightTimelineProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="text-center min-w-[80px]">
        <p className="text-lg font-bold text-slate-900">{departureTime}</p>
        <p className="text-sm font-semibold text-blue-600">{departureCode}</p>
        <p className="text-xs text-slate-400">{departureDate}</p>
      </div>

      <div className="flex-1 flex flex-col items-center px-2">
        <p className="text-xs font-medium text-slate-500 mb-1.5">{duration}</p>
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 right-0 h-px bg-slate-200">
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 4px, transparent 4px, transparent 8px)'
            }} />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative z-10 mx-auto bg-white border-2 border-blue-500 rounded-full p-1"
          >
            <Plane className="w-4 h-4 text-blue-600 rotate-90" />
          </motion.div>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-1.5">
          {stops === 0 ? (
            <span className="text-emerald-600 font-semibold">Non-stop</span>
          ) : (
            <span>{stops} stop{stops > 1 ? "s" : ""}{stopover ? ` • ${stopover}` : ""}</span>
          )}
        </p>
      </div>

      <div className="text-center min-w-[80px]">
        <p className="text-lg font-bold text-slate-900">{arrivalTime}</p>
        <p className="text-sm font-semibold text-blue-600">{arrivalCode}</p>
        <p className="text-xs text-slate-400">{arrivalDate}</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Slider } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { Button } from "@/components/ui";
import { Switch } from "@/components/ui";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui";
import {
  Plane,
  Clock,
  DollarSign,
  RotateCcw,
  Luggage,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersState {
  priceRange: number[];
  stops: string[];
  airlines: string[];
  departureTime: string;
  arrivalTime: string;
  refundable: boolean;
  maxDuration: number;
}

const stopOptions = [
  { value: "nonstop", label: "Non-stop", count: 12 },
  { value: "1stop", label: "1 Stop", count: 8 },
  { value: "2plus", label: "2+ Stops", count: 4 },
];

const airlineOptions = [
  { code: "AA", name: "American Airlines", count: 6 },
  { code: "DL", name: "Delta Air Lines", count: 4 },
  { code: "UA", name: "United Airlines", count: 5 },
  { code: "BA", name: "British Airways", count: 3 },
  { code: "EK", name: "Emirates", count: 2 },
  { code: "QR", name: "Qatar Airways", count: 3 },
  { code: "LH", name: "Lufthansa", count: 4 },
  { code: "AF", name: "Air France", count: 2 },
];

const timeSlots = [
  { value: "morning", label: "Morning", icon: Sunrise, range: "6AM - 12PM" },
  { value: "afternoon", label: "Afternoon", icon: Sun, range: "12PM - 6PM" },
  { value: "evening", label: "Evening", icon: Sunset, range: "6PM - 12AM" },
  { value: "night", label: "Night", icon: Moon, range: "12AM - 6AM" },
];

export function SearchFilters() {
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 2000],
    stops: [],
    airlines: [],
    departureTime: "",
    arrivalTime: "",
    refundable: false,
    maxDuration: 24,
  });

  const clearAll = () => {
    setFilters({
      priceRange: [0, 2000],
      stops: [],
      airlines: [],
      departureTime: "",
      arrivalTime: "",
      refundable: false,
      maxDuration: 24,
    });
  };

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.departureTime !== "" ||
    filters.arrivalTime !== "" ||
    filters.refundable ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000 ||
    filters.maxDuration < 24;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["stops", "price", "airlines"]} className="space-y-3">

        <AccordionItem value="stops" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Stops</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-2.5 pt-2">
              {stopOptions.map((stop) => (
                <label
                  key={stop.value}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={filters.stops.includes(stop.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, stops: [...filters.stops, stop.value] });
                        } else {
                          setFilters({ ...filters, stops: filters.stops.filter(s => s !== stop.value) });
                        }
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{stop.label}</span>
                  </div>
                  <span className="text-xs text-slate-400">{stop.count}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Price Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="pt-2 space-y-4">
              <Slider
                value={filters.priceRange}
                min={0}
                max={2000}
                step={50}
                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                className="[&_[role=slider]]:border-blue-600 [&_[role=slider]]:bg-white"
              />
              <div className="flex items-center justify-between">
                <div className="bg-slate-50 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-slate-400 font-medium">Min</p>
                  <p className="text-sm font-semibold text-slate-900">${filters.priceRange[0]}</p>
                </div>
                <span className="text-slate-300 text-sm">—</span>
                <div className="bg-slate-50 rounded-lg px-3 py-1.5 text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Max</p>
                  <p className="text-sm font-semibold text-slate-900">${filters.priceRange[1]}+</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="airlines" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Airlines</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4 max-h-56 overflow-y-auto">
            <div className="space-y-2.5 pt-2">
              {airlineOptions.map((airline) => (
                <label
                  key={airline.code}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={filters.airlines.includes(airline.code)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, airlines: [...filters.airlines, airline.code] });
                        } else {
                          setFilters({ ...filters, airlines: filters.airlines.filter(a => a !== airline.code) });
                        }
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={`https://img.airlinesdata.com/airline/${airline.code}.png`}
                        alt={airline.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{airline.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{airline.count}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="departure" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Departure Time</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-2 pt-2">
              {timeSlots.map((slot) => {
                const Icon = slot.icon;
                const isActive = filters.departureTime === slot.value;
                return (
                  <button
                    key={slot.value}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        departureTime: isActive ? "" : slot.value,
                      })
                    }
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
                      isActive
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <div className="text-left">
                      <p className={cn("text-sm font-medium", isActive && "text-blue-700")}>{slot.label}</p>
                      <p className="text-[10px] text-slate-400">{slot.range}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="arrival" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Arrival Time</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-2 pt-2">
              {timeSlots.map((slot) => {
                const Icon = slot.icon;
                const isActive = filters.arrivalTime === slot.value;
                return (
                  <button
                    key={slot.value}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        arrivalTime: isActive ? "" : slot.value,
                      })
                    }
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
                      isActive
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-500"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <div className="text-left">
                      <p className={cn("text-sm font-medium", isActive && "text-blue-700")}>{slot.label}</p>
                      <p className="text-[10px] text-slate-400">{slot.range}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="refundability" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Refundability</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm text-slate-700">Refundable fares only</span>
                </div>
                <Switch
                  checked={filters.refundable}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, refundable: checked })
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
              </label>
              <p className="text-xs text-slate-400 mt-1.5 ml-0.5">
                Fully refundable ticket options
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-900">Max Duration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="pt-2 space-y-4">
              <Slider
                value={[filters.maxDuration]}
                min={1}
                max={24}
                step={1}
                onValueChange={([val]) => setFilters({ ...filters, maxDuration: val })}
                className="[&_[role=slider]]:border-blue-600 [&_[role=slider]]:bg-white"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">1h</span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {filters.maxDuration}h
                </span>
                <span className="text-slate-500">24h</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 shadow-sm">
        <Filter className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
}

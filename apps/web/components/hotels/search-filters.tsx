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
  Star,
  DollarSign,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  X,
} from "lucide-react";

interface FiltersState {
  priceRange: number[];
  stars: string[];
  rating: number;
  amenities: string[];
  propertyType: string[];
  refundable: boolean;
}

const amenityOptions = [
  { id: "wifi", label: "Free WiFi", icon: Wifi },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "parking", label: "Parking", icon: Car },
  { id: "gym", label: "Fitness Center", icon: Dumbbell },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "spa", label: "Spa", icon: Sparkles },
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
];

const propertyTypes = [
  "Hotel", "Resort", "Villa", "Apartment", "Guest House", "Lodge",
];

const ratingOptions = [
  { value: 4.5, label: "Excellent", sub: "4.5+" },
  { value: 4.0, label: "Very Good", sub: "4.0+" },
  { value: 3.5, label: "Good", sub: "3.5+" },
  { value: 3.0, label: "Fair", sub: "3.0+" },
];

export function SearchFilters() {
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 500],
    stars: [],
    rating: 0,
    amenities: [],
    propertyType: [],
    refundable: false,
  });

  const clearAll = () => {
    setFilters({
      priceRange: [0, 500],
      stars: [],
      rating: 0,
      amenities: [],
      propertyType: [],
      refundable: false,
    });
  };

  const hasActiveFilters =
    filters.stars.length > 0 ||
    filters.amenities.length > 0 ||
    filters.propertyType.length > 0 ||
    filters.rating > 0 ||
    filters.refundable ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500;

  const toggleStar = (star: string) => {
    setFilters((prev) => ({
      ...prev,
      stars: prev.stars.includes(star)
        ? prev.stars.filter((s) => s !== star)
        : [...prev.stars, star],
    }));
  };

  const toggleAmenity = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const toggleProperty = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const AmenityCheckbox = ({
    icon: Icon,
    label,
    checked,
    onChange,
  }: {
    icon: any;
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
      />
      <Icon
        className={`w-3.5 h-3.5 ${checked ? "text-emerald-600" : "text-slate-400"}`}
      />
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["price", "stars", "amenities"]}
        className="space-y-3"
      >
        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Price Range
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="pt-2 space-y-4">
              <Slider
                value={filters.priceRange}
                min={0}
                max={500}
                step={10}
                onValueChange={(value) =>
                  setFilters({ ...filters, priceRange: value })
                }
                className="[&_[role=slider]]:border-emerald-600 [&_[role=slider]]:bg-white"
              />
              <div className="flex items-center justify-between">
                <div className="bg-slate-50 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-slate-400 font-medium">Min</p>
                  <p className="text-sm font-semibold text-slate-900">
                    ${filters.priceRange[0]}
                  </p>
                </div>
                <span className="text-slate-300 text-sm">—</span>
                <div className="bg-slate-50 rounded-lg px-3 py-1.5 text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Max</p>
                  <p className="text-sm font-semibold text-slate-900">
                    ${filters.priceRange[1]}+
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Star Rating */}
        <AccordionItem value="stars" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Star Rating
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-2.5 pt-2">
              {[5, 4, 3, 2].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.stars.includes(stars.toString())}
                    onCheckedChange={() => toggleStar(stars.toString())}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <div className="flex gap-0.5">
                    {Array.from({ length: stars }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          filters.stars.includes(stars.toString())
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{stars} Star</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Guest Rating */}
        <AccordionItem value="rating" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Guest Rating
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-1.5 pt-2">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      rating: filters.rating === opt.value ? 0 : opt.value,
                    })
                  }
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                    filters.rating === opt.value
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      filters.rating === opt.value
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      filters.rating === opt.value
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Property Type */}
        <AccordionItem value="property" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Property Type
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-2.5 pt-2">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={() => toggleProperty(type)}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Amenities */}
        <AccordionItem value="amenities" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Amenities
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="space-y-1.5 pt-2">
              {amenityOptions.map((am) => (
                <AmenityCheckbox
                  key={am.id}
                  icon={am.icon}
                  label={am.label}
                  checked={filters.amenities.includes(am.id)}
                  onChange={() => toggleAmenity(am.id)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Free Cancellation */}
        <AccordionItem value="cancellation" className="border-none">
          <AccordionTrigger className="bg-white rounded-xl border border-slate-200 px-4 py-3 hover:no-underline data-[state=open]:rounded-b-none transition-all">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">
                Cancellation
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white border border-t-0 border-slate-200 rounded-b-xl px-4 pb-4">
            <div className="pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-700">
                  Free cancellation
                </span>
                <Switch
                  checked={filters.refundable}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, refundable: checked })
                  }
                  className="data-[state=checked]:bg-emerald-600"
                />
              </label>
              <p className="text-xs text-slate-400 mt-1.5">
                Cancel up to 24 hours before check-in
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 h-11 shadow-sm">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
}

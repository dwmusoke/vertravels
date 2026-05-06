"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vertravels/ui";
import { Input } from "@vertravels/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@vertravels/ui";
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ArrowLeftRight,
} from "lucide-react";

export function FlightsSearch() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"round" | "one-way" | "multi">(
    "round",
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabinClass: "economy",
  });

  const handleSwapLocations = () => {
    setFormData({
      ...formData,
      origin: formData.destination,
      destination: formData.origin,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.origin || !formData.destination || !formData.departureDate) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Simulate search - in production, this would call the API
    console.log("Searching flights:", formData);

    // Redirect to search results page
    const params = new URLSearchParams({
      origin: formData.origin,
      destination: formData.destination,
      departure: formData.departureDate?.toISOString() || "",
      return: formData.returnDate?.toISOString() || "",
      adults: formData.passengers.adults.toString(),
      children: formData.passengers.children.toString(),
      infants: formData.passengers.infants.toString(),
      cabin: formData.cabinClass,
      trip: tripType,
    });

    setLoading(false);
    router.push(`/flights/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Trip Type Selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={tripType === "round"}
            onChange={() => setTripType("round")}
            className="text-primary focus:ring-primary"
          />
          <span>Round Trip</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={tripType === "one-way"}
            onChange={() => setTripType("one-way")}
            className="text-primary focus:ring-primary"
          />
          <span>One Way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={tripType === "multi"}
            onChange={() => setTripType("multi")}
            className="text-primary focus:ring-primary"
          />
          <span>Multi-City</span>
        </label>
      </div>

      {/* Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From"
          placeholder="City or Airport"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          icon={<MapPin className="h-4 w-4" />}
          required
        />

        <div className="relative">
          <Input
            label="To"
            placeholder="City or Airport"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            icon={<MapPin className="h-4 w-4" />}
            required
          />
          <button
            type="button"
            onClick={handleSwapLocations}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full p-1 hover:bg-accent"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Departure</label>
          <Input
            type="date"
            value={
              formData.departureDate
                ? formData.departureDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                departureDate: e.target.value
                  ? new Date(e.target.value)
                  : undefined,
              })
            }
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {tripType === "round" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Return</label>
            <Input
              type="date"
              value={
                formData.returnDate
                  ? formData.returnDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnDate: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
              min={
                formData.departureDate
                  ? formData.departureDate.toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
            />
          </div>
        )}
      </div>

      {/* Passengers & Cabin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Passengers</label>
          <div className="border rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: {
                        ...formData.passengers,
                        adults: Math.max(1, formData.passengers.adults - 1),
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center">
                  {formData.passengers.adults}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: {
                        ...formData.passengers,
                        adults: formData.passengers.adults + 1,
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Children</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: {
                        ...formData.passengers,
                        children: Math.max(0, formData.passengers.children - 1),
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center">
                  {formData.passengers.children}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      passengers: {
                        ...formData.passengers,
                        children: formData.passengers.children + 1,
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Select
            value={formData.cabinClass}
            onValueChange={(value) =>
              setFormData({ ...formData, cabinClass: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Cabin Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full h-10" loading={loading}>
            <Plane className="mr-2 h-4 w-4" />
            Search Flights
          </Button>
        </div>
      </div>
    </form>
  );
}

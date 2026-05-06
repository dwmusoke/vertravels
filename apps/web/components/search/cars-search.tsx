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
import { Car, MapPin, Calendar, Clock, Fuel, Settings } from "lucide-react";

export function CarsSearch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: undefined as Date | undefined,
    pickupTime: "10:00",
    dropoffDate: undefined as Date | undefined,
    dropoffTime: "10:00",
    carType: "",
    transmission: "",
    sameLocation: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.pickupLocation ||
      !formData.pickupDate ||
      !formData.dropoffDate
    ) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    console.log("Searching cars:", formData);

    const params = new URLSearchParams({
      pickup: formData.pickupLocation,
      dropoff: formData.dropoffLocation || formData.pickupLocation,
      pickupDate: formData.pickupDate.toISOString(),
      dropoffDate: formData.dropoffDate.toISOString(),
      pickupTime: formData.pickupTime,
      dropoffTime: formData.dropoffTime,
      type: formData.carType,
      transmission: formData.transmission,
    });

    setLoading(false);
    router.push(`/cars/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Same Location Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="sameLocation"
          checked={formData.sameLocation}
          onChange={(e) =>
            setFormData({ ...formData, sameLocation: e.target.checked })
          }
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="sameLocation" className="text-sm font-medium">
          Return car to same location
        </label>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pick-up Location"
          placeholder="City, airport, or address"
          value={formData.pickupLocation}
          onChange={(e) =>
            setFormData({ ...formData, pickupLocation: e.target.value })
          }
          icon={<MapPin className="h-4 w-4" />}
          required
        />

        {!formData.sameLocation && (
          <Input
            label="Drop-off Location"
            placeholder="City, airport, or address"
            value={formData.dropoffLocation}
            onChange={(e) =>
              setFormData({ ...formData, dropoffLocation: e.target.value })
            }
            icon={<MapPin className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pick-up Date</label>
          <Input
            type="date"
            value={
              formData.pickupDate
                ? formData.pickupDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                pickupDate: e.target.value
                  ? new Date(e.target.value)
                  : undefined,
              })
            }
            min={new Date().toISOString().split("T")[0]}
          />
          <Select
            value={formData.pickupTime}
            onValueChange={(value) =>
              setFormData({ ...formData, pickupTime: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick-up Time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem
                  key={hour}
                  value={`${hour.toString().padStart(2, "0")}:00`}
                >
                  {hour.toString().padStart(2, "0")}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Drop-off Date</label>
          <Input
            type="date"
            value={
              formData.dropoffDate
                ? formData.dropoffDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                dropoffDate: e.target.value
                  ? new Date(e.target.value)
                  : undefined,
              })
            }
            min={
              formData.pickupDate
                ? formData.pickupDate.toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
          <Select
            value={formData.dropoffTime}
            onValueChange={(value) =>
              setFormData({ ...formData, dropoffTime: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Drop-off Time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem
                  key={hour}
                  value={`${hour.toString().padStart(2, "0")}:00`}
                >
                  {hour.toString().padStart(2, "0")}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Car Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={formData.carType}
          onValueChange={(value) =>
            setFormData({ ...formData, carType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Car Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Type</SelectItem>
            <SelectItem value="economy">Economy</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="van">Van/Minivan</SelectItem>
            <SelectItem value="sports">Sports Car</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.transmission}
          onValueChange={(value) =>
            setFormData({ ...formData, transmission: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Options */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-3">Additional Options</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Fuel, label: "Unlimited Mileage" },
            { icon: Settings, label: "Air Conditioning" },
            { icon: Clock, label: "Free Cancellation" },
            { icon: Car, label: "Airport Pickup" },
          ].map((option) => (
            <label
              key={option.label}
              className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary"
              />
              <option.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <Button type="submit" className="w-full h-12 text-lg" loading={loading}>
        <Car className="mr-2 h-5 w-5" />
        Search Cars
      </Button>
    </form>
  );
}

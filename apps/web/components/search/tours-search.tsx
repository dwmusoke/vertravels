"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { Map, MapPin, Calendar, Users, Clock } from "lucide-react";

export function ToursSearch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    date: undefined as Date | undefined,
    duration: "",
    guests: 2,
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.destination) {
      alert("Please enter a destination");
      setLoading(false);
      return;
    }

    console.log("Searching tours:", formData);

    const params = new URLSearchParams({
      destination: formData.destination,
      date: formData.date?.toISOString() || "",
      duration: formData.duration,
      guests: formData.guests.toString(),
      category: formData.category,
    });

    setLoading(false);
    router.push(`/tours/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destination */}
      <Input
        label="Destination"
        placeholder="City or attraction"
        value={formData.destination}
        onChange={(e) =>
          setFormData({ ...formData, destination: e.target.value })
        }
        icon={<MapPin className="h-4 w-4" />}
        required
      />

      {/* Date & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={
              formData.date ? formData.date.toISOString().split("T")[0] : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <Select
          value={formData.duration}
          onValueChange={(value) =>
            setFormData({ ...formData, duration: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Duration</SelectItem>
            <SelectItem value="half">Half Day (up to 4 hours)</SelectItem>
            <SelectItem value="full">Full Day (4-8 hours)</SelectItem>
            <SelectItem value="multi">Multi-Day (2+ days)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guests & Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Guests</label>
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Number of Guests</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: Math.max(1, formData.guests - 1),
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                >
                  -
                </button>
                <span className="w-6 text-center">{formData.guests}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: formData.guests + 1,
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="food">Food & Wine</SelectItem>
              <SelectItem value="historical">Historical</SelectItem>
              <SelectItem value="nature">Nature & Wildlife</SelectItem>
              <SelectItem value="city">City Tours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full h-10" loading={loading}>
            <Map className="mr-2 h-4 w-4" />
            Search Tours
          </Button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-2">Popular Categories</p>
        <div className="flex flex-wrap gap-2">
          {[
            "City Tours",
            "Day Trips",
            "Adventure",
            "Food Tours",
            "Historical",
            "Night Tours",
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  category: cat.toLowerCase().replace(" ", "-"),
                })
              }
              className="px-3 py-1 text-sm rounded-full border hover:bg-accent transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

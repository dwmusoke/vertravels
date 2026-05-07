"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Hotel, MapPin, Calendar, Users, Star } from "lucide-react";

export function HotelsSearch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: {
      adults: 2,
      children: 0,
      rooms: 1,
    },
    starRating: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.destination || !formData.checkIn || !formData.checkOut) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    console.log("Searching hotels:", formData);

    const params = new URLSearchParams({
      destination: formData.destination,
      checkIn: formData.checkIn.toISOString(),
      checkOut: formData.checkOut.toISOString(),
      adults: formData.guests.adults.toString(),
      children: formData.guests.children.toString(),
      rooms: formData.guests.rooms.toString(),
      stars: formData.starRating,
    });

    setLoading(false);
    router.push(`/hotels/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destination */}
      <Input
        label="Destination"
        placeholder="City, hotel name, or landmark"
        value={formData.destination}
        onChange={(e) =>
          setFormData({ ...formData, destination: e.target.value })
        }
        icon={<MapPin className="h-4 w-4" />}
        required
      />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-in</label>
          <Input
            type="date"
            value={
              formData.checkIn
                ? formData.checkIn.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                checkIn: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Check-out</label>
          <Input
            type="date"
            value={
              formData.checkOut
                ? formData.checkOut.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                checkOut: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            min={
              formData.checkIn
                ? formData.checkIn.toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
        </div>
      </div>

      {/* Guests & Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Guests</label>
          <div className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: {
                        ...formData.guests,
                        adults: Math.max(1, formData.guests.adults - 1),
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                >
                  -
                </button>
                <span className="w-6 text-center">
                  {formData.guests.adults}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: {
                        ...formData.guests,
                        adults: formData.guests.adults + 1,
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
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
                      guests: {
                        ...formData.guests,
                        children: Math.max(0, formData.guests.children - 1),
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                >
                  -
                </button>
                <span className="w-6 text-center">
                  {formData.guests.children}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: {
                        ...formData.guests,
                        children: formData.guests.children + 1,
                      },
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
          <label className="mb-2 block text-sm font-medium">Rooms</label>
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Number of Rooms</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: {
                        ...formData.guests,
                        rooms: Math.max(1, formData.guests.rooms - 1),
                      },
                    })
                  }
                  className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                >
                  -
                </button>
                <span className="w-6 text-center">{formData.guests.rooms}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      guests: {
                        ...formData.guests,
                        rooms: formData.guests.rooms + 1,
                      },
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

        <div className="flex items-end">
          <Button type="submit" className="w-full h-10" loading={loading}>
            <Hotel className="mr-2 h-4 w-4" />
            Search Hotels
          </Button>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium">Star Rating</label>
        <div className="flex gap-2">
          {["", "3", "4", "5"].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => setFormData({ ...formData, starRating: stars })}
              className={`flex items-center gap-1 px-4 py-2 rounded-md border transition-colors ${
                formData.starRating === stars
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {stars ? (
                <>
                  <span>{stars}</span>
                  <Star className="h-4 w-4 fill-current" />
                </>
              ) : (
                "Any"
              )}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
